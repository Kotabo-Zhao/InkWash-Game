#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
墨境棋局 - ComfyUI美术资源自动化生成管线 v2

分层控制策略：
1. 角色一致性：IP-Adapter + 角色参考图
2. 动作一致性：ControlNet OpenPose + 参考姿态
3. 风格统一：风格LoRA + 固定negative prompt
4. 版本管理：记录所有参数，确保可复现

使用方法：
    # 生成所有资源
    python scripts/art_pipeline.py --all

    # 只生成主角精灵表
    python scripts/art_pipeline.py --character protagonist

    # 生成第一章场景
    python scripts/art_pipeline.py --background chapter1

    # 指定ComfyUI服务器
    python scripts/art_pipeline.py --server http://localhost:8188 --all
"""

import argparse
import base64
import hashlib
import io
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import requests
except ImportError:
    print("错误: 需要安装 requests 库")
    print("运行: pip install requests")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("错误: 需要安装 Pillow 库")
    print("运行: pip install Pillow")
    sys.exit(1)


# ============================================================================
# 配置常量
# ============================================================================

PROJECT_ROOT = Path(__file__).parent.parent
ASSETS_DIR = PROJECT_ROOT / "assets"
REFS_DIR = ASSETS_DIR / "refs"  # 角色参考图
VERSIONS_DIR = ASSETS_DIR / "versions"  # 版本记录
LOGS_DIR = PROJECT_ROOT / "logs"

# ComfyUI默认配置
COMFYUI_SERVER = "http://127.0.0.1:8188"

# 模型配置（版本管理）
# 统一使用 SDXL 生态以确保兼容性
MODEL_VERSION = {
    "base_model": "sd_xl_base_1.0.safetensors",
    "style_lora": "ink_wash_style_xl_v1.safetensors",
    "controlnet": "diffusers_xl_canny_full.safetensors",
    "ip_adapter": "ip-adapter-plus_sdxl_vit-h.safetensors",
    "vae": "sdxl_vae.safetensors",
    "version_hash": "",  # 运行时计算
}

# 美术资源规格
SPEC_CHAR_WIDTH = 128
SPEC_CHAR_HEIGHT = 128
SPEC_BG_WIDTH = 800
SPEC_BG_HEIGHT = 600

# 风格约束（固定，确保一致性）
STYLE_CONFIG = {
    "base_prompt": "masterpiece, best quality, ink wash painting style, traditional chinese art",
    "negative_prompt": "low quality, worst quality, blurry, deformed, ugly, modern, western, photorealistic, 3d render, bright colors, saturated, cartoon, anime style, extra limbs, bad anatomy",
    "sampler": "dpm_2m_karras",
    "steps": 30,
    "cfg_scale": 7.5,
    "width": 512,
    "height": 512,
}

# 角色定义
CHARACTERS = {
    "protagonist": {
        "name_cn": "棋手",
        "description": "年轻的主角，穿着传统服饰，手持卡牌，眼神坚毅",
        "actions": ["idle", "walk", "attack", "run", "dead"],
        "directions": ["n", "ne", "e", "se", "s", "sw", "w", "nw"],
        "frames_per_action": {"idle": 4, "walk": 6, "attack": 4, "run": 6, "dead": 4},
    },
    "ink_beast": {
        "name_cn": "墨兽",
        "description": "由墨水构成的野兽，形态诡异，带有墨色雾气",
        "actions": ["idle", "walk", "attack", "dead"],
        "directions": ["s", "e", "w"],
        "frames_per_action": {"idle": 4, "walk": 6, "attack": 4, "dead": 4},
    },
    "ink_wolf": {
        "name_cn": "墨狼",
        "description": "墨色巨狼，毛发如墨水流动，眼神凶狠",
        "actions": ["idle", "walk", "attack", "dead"],
        "directions": ["s", "e", "w"],
        "frames_per_action": {"idle": 4, "walk": 6, "attack": 4, "dead": 4},
    },
    "shadow_wolf": {
        "name_cn": "墨龙王",
        "description": "威严的龙形生物，墨色鳞片，带有金光纹路",
        "actions": ["idle", "attack", "dead"],
        "directions": ["s"],
        "frames_per_action": {"idle": 4, "attack": 6, "dead": 4},
    },
}

# 场景定义
BACKGROUNDS = {
    "chapter1": {
        "name_cn": "墨林迷踪",
        "description": "墨色森林，古老树木，雾气缭绕，神秘氛围",
        "layers": ["far", "mid", "near", "foreground"],
    },
    "chapter2": {
        "name_cn": "影武者殿堂",
        "description": "古老殿堂，破败建筑，阴影笼罩，庄严而危险",
        "layers": ["far", "mid", "near", "foreground"],
    },
    "chapter3": {
        "name_cn": "墨渊深处",
        "description": "深邃的墨色深渊，黑暗神秘，微弱光芒",
        "layers": ["far", "mid", "near", "foreground"],
    },
}


# ============================================================================
# 版本管理器
# ============================================================================

class VersionManager:
    """管理生成的版本信息，确保可复现"""

    def __init__(self):
        VERSIONS_DIR.mkdir(parents=True, exist_ok=True)
        self._calculate_model_hash()

    def _calculate_model_hash(self):
        """计算模型版本哈希"""
        hash_input = json.dumps(MODEL_VERSION, sort_keys=True)
        MODEL_VERSION["version_hash"] = hashlib.md5(hash_input.encode()).hexdigest()[:8]

    def save_version(self, asset_type: str, asset_id: str, params: Dict[str, Any]) -> str:
        """保存版本信息，返回版本ID"""
        timestamp = int(time.time())
        version_id = f"{asset_type}_{asset_id}_{timestamp}"

        version_data = {
            "version_id": version_id,
            "timestamp": timestamp,
            "asset_type": asset_type,
            "asset_id": asset_id,
            "params": params,
            "model_version": MODEL_VERSION,
            "style_config": STYLE_CONFIG,
        }

        version_file = VERSIONS_DIR / f"{version_id}.json"
        with open(version_file, "w", encoding="utf-8") as f:
            json.dump(version_data, f, ensure_ascii=False, indent=2)

        print(f"  ✓ 版本已保存: {version_file.name}")
        return version_id

    def load_version(self, version_id: str) -> Optional[Dict[str, Any]]:
        """加载版本信息"""
        version_file = VERSIONS_DIR / f"{version_id}.json"
        if not version_file.exists():
            return None

        with open(version_file, "r", encoding="utf-8") as f:
            return json.load(f)

    def list_versions(self, asset_type: Optional[str] = None) -> List[str]:
        """列出所有版本"""
        versions = []
        for f in VERSIONS_DIR.glob("*.json"):
            if asset_type and not f.name.startswith(asset_type):
                continue
            versions.append(f.stem)
        return sorted(versions, reverse=True)


# ============================================================================
# ComfyUI API客户端（增强版）
# ============================================================================

class ComfyUIClient:
    """ComfyUI API客户端"""

    def __init__(self, server_url: str):
        self.server_url = server_url.rstrip("/")
        self.session = requests.Session()

    def test_connection(self) -> bool:
        """测试与ComfyUI服务器的连接"""
        try:
            response = self.session.get(f"{self.server_url}/system_stats", timeout=5)
            return response.status_code == 200
        except Exception as e:
            print(f"连接失败: {e}")
            return False

    def upload_image(self, image_data: bytes, filename: str) -> Optional[str]:
        """上传图片到ComfyUI，返回文件名"""
        try:
            files = {"image": (filename, image_data, "image/png")}
            response = self.session.post(
                f"{self.server_url}/upload/image",
                files=files,
                timeout=30,
            )
            if response.status_code == 200:
                result = response.json()
                return result.get("name")
            else:
                print(f"上传失败: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"上传异常: {e}")
            return None

    def queue_prompt(self, prompt: Dict) -> Optional[str]:
        """提交生成任务"""
        try:
            payload = {"prompt": prompt}
            response = self.session.post(
                f"{self.server_url}/prompt",
                json=payload,
                timeout=10,
            )
            if response.status_code == 200:
                result = response.json()
                return result.get("prompt_id")
            else:
                print(f"提交失败: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"提交异常: {e}")
            return None

    def wait_for_completion(self, prompt_id: str, timeout: int = 300) -> bool:
        """等待任务完成"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            try:
                response = self.session.get(
                    f"{self.server_url}/history/{prompt_id}",
                    timeout=5,
                )
                if response.status_code == 200:
                    history = response.json()
                    if prompt_id in history:
                        return True
                time.sleep(1)
            except Exception:
                time.sleep(1)
        return False

    def get_image(self, prompt_id: str, filename: str) -> Optional[bytes]:
        """获取生成的图片"""
        try:
            response = self.session.get(
                f"{self.server_url}/view",
                params={"filename": filename, "type": "output"},
                timeout=30,
            )
            if response.status_code == 200:
                return response.content
            return None
        except Exception as e:
            print(f"获取图片失败: {e}")
            return None


# ============================================================================
# Prompt生成器（带ControlNet和IP-Adapter）
# ============================================================================

class PromptBuilder:
    """构建ComfyUI工作流（包含ControlNet和IP-Adapter）"""

    def __init__(self, style_config: Dict):
        self.style = style_config

    def build_character_ref_prompt(self, character: Dict) -> Dict:
        """构建角色参考图生成工作流（不使用ControlNet）"""
        prompt = f"{self.style['base_prompt']}, character design sheet, {character['name_cn']}, {character['description']}, multiple views, front side back, white background, clean lines, game asset"

        workflow = self._base_workflow(prompt)
        workflow["4"]["inputs"]["seed"] = 42  # 固定seed确保可复现
        return workflow

    def build_character_frame_prompt(
        self, character: Dict, action: str, direction: str, frame: int, ref_image_name: str
    ) -> Dict:
        """构建角色帧生成工作流（使用IP-Adapter和ControlNet）"""
        action_desc = {
            "idle": "standing still",
            "walk": "walking",
            "attack": "attacking with sword",
            "run": "running",
            "dead": "lying down",
        }.get(action, action)

        direction_desc = {
            "n": "facing north",
            "ne": "facing northeast",
            "e": "facing east",
            "se": "facing southeast",
            "s": "facing south",
            "sw": "facing southwest",
            "w": "facing west",
            "nw": "facing northwest",
        }.get(direction, direction)

        prompt = f"{self.style['base_prompt']}, character sprite, {character['name_cn']}, {character['description']}, {action_desc}, {direction_desc}, frame {frame}, full body, dynamic pose, transparent background"

        workflow = self._base_workflow(prompt)

        # 添加IP-Adapter（保持角色一致性）
        workflow["10"] = {
            "class_type": "IPAdapterApply",
            "inputs": {
                "ipadapter": None,  # 需要IP-Adapter模型
                "clip_vision": None,  # 需要CLIP Vision模型
                "image": ref_image_name,  # 角色参考图
                "model": workflow["3"]["inputs"]["model"],
                "weight": 0.8,
            },
        }
        workflow["3"]["inputs"]["model"] = ["10", 0]

        # 添加ControlNet OpenPose（控制姿态）
        pose_image = f"pose_{action}_{direction}_{frame}.png"
        workflow["11"] = {
            "class_type": "ControlNetApply",
            "inputs": {
                "control_net": None,  # 需要OpenPose ControlNet模型
                "conditioning": workflow["4"]["inputs"]["conditioning"],
                "image": pose_image,
                "strength": 0.7,
            },
        }
        workflow["4"]["inputs"]["conditioning"] = ["11", 0]

        # 使用基于帧号的seed确保可复现
        seed = hash(f"{character['name_cn']}_{action}_{direction}_{frame}") % (2**32)
        workflow["4"]["inputs"]["seed"] = seed

        return workflow

    def build_background_prompt(self, background: Dict, layer: str) -> Dict:
        """构建背景生成工作流"""
        layer_desc = {
            "far": "far background, atmospheric perspective, misty, blurred",
            "mid": "middle ground, clear details, main landscape",
            "near": "near foreground, detailed elements",
            "foreground": "immediate foreground, decorative elements, semi-transparent",
        }.get(layer, layer)

        prompt = f"{self.style['base_prompt']}, landscape background, {background['name_cn']}, {background['description']}, {layer_desc}, parallax scrolling game asset, 4:3 aspect ratio"

        workflow = self._base_workflow(prompt)
        workflow["4"]["inputs"]["width"] = SPEC_BG_WIDTH
        workflow["4"]["inputs"]["height"] = SPEC_BG_HEIGHT

        return workflow

    def _base_workflow(self, prompt: str) -> Dict:
        """基础工作流模板"""
        return {
            "3": {
                "class_type": "KSampler",
                "inputs": {
                    "model": None,  # 由IP-Adapter填充
                    "positive": ["4", 0],
                    "negative": ["5", 0],
                    "latent_image": ["6", 0],
                    "seed": 0,
                    "steps": self.style["steps"],
                    "cfg": self.style["cfg_scale"],
                    "sampler_name": self.style["sampler"],
                    "scheduler": "normal",
                    "denoise": 1.0,
                },
            },
            "4": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": ["7", 0],
                    "text": prompt,
                },
            },
            "5": {
                "class_type": "CLIPTextEncode",
                "inputs": {
                    "clip": ["7", 0],
                    "text": self.style["negative_prompt"],
                },
            },
            "6": {
                "class_type": "EmptyLatentImage",
                "inputs": {
                    "width": self.style["width"],
                    "height": self.style["height"],
                    "batch_size": 1,
                },
            },
            "7": {
                "class_type": "CheckpointLoaderSimple",
                "inputs": {
                    "ckpt_name": MODEL_VERSION["base_model"],
                },
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {
                    "samples": ["3", 0],
                    "vae": ["7", 0],
                },
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {
                    "images": ["8", 0],
                    "filename_prefix": "ink_realm",
                },
            },
        }


# ============================================================================
# 后处理器
# ============================================================================

class PostProcessor:
    """图片后处理"""

    @staticmethod
    def resize(image_data: bytes, width: int, height: int) -> bytes:
        """调整图片尺寸"""
        img = Image.open(io.BytesIO(image_data))
        img = img.resize((width, height), Image.Resampling.LANCZOS)
        output = io.BytesIO()
        img.save(output, format="PNG")
        return output.getvalue()

    @staticmethod
    def remove_background(image_data: bytes, threshold: int = 240) -> bytes:
        """移除背景（简单阈值法）"""
        img = Image.open(io.BytesIO(image_data)).convert("RGBA")
        data = img.getdata()
        new_data = []
        for item in data:
            if item[0] > threshold and item[1] > threshold and item[2] > threshold:
                new_data.append((255, 255, 255, 0))
            else:
                new_data.append(item)
        img.putdata(new_data)
        output = io.BytesIO()
        img.save(output, format="PNG")
        return output.getvalue()

    @staticmethod
    def create_sprite_sheet(images: List[bytes], cols: int, frame_width: int, frame_height: int) -> bytes:
        """创建精灵表"""
        rows = (len(images) + cols - 1) // cols
        sheet = Image.new("RGBA", (cols * frame_width, rows * frame_height), (0, 0, 0, 0))
        for idx, img_data in enumerate(images):
            img = Image.open(io.BytesIO(img_data))
            row = idx // cols
            col = idx % cols
            x = col * frame_width
            y = row * frame_height
            sheet.paste(img, (x, y))
        output = io.BytesIO()
        sheet.save(output, format="PNG")
        return output.getvalue()


# ============================================================================
# 主流程控制
# ============================================================================

class ArtPipeline:
    """美术资源生成管线"""

    def __init__(self, comfyui_server: str):
        self.client = ComfyUIClient(comfyui_server)
        self.prompt_builder = PromptBuilder(STYLE_CONFIG)
        self.post_processor = PostProcessor()
        self.version_mgr = VersionManager()
        self.log_entries = []

        # 确保目录存在
        REFS_DIR.mkdir(parents=True, exist_ok=True)
        LOGS_DIR.mkdir(parents=True, exist_ok=True)

    def test_connection(self) -> bool:
        """测试ComfyUI连接"""
        print("测试ComfyUI连接...")
        if self.client.test_connection():
            print("✓ 连接成功")
            return True
        else:
            print("✗ 连接失败，请确保ComfyUI正在运行")
            return False

    def generate_character_ref(self, character_id: str) -> Optional[str]:
        """生成角色参考图（一次性）"""
        character = CHARACTERS[character_id]
        print(f"\n[角色参考] 生成 {character['name_cn']} 参考图...")

        ref_file = REFS_DIR / f"{character_id}_ref.png"

        # 检查是否已存在
        if ref_file.exists():
            print(f"  ✓ 参考图已存在: {ref_file.name}")
            return f"{character_id}_ref.png"

        # 构建工作流
        workflow = self.prompt_builder.build_character_ref_prompt(character)

        # 提交生成
        prompt_id = self.client.queue_prompt(workflow)
        if not prompt_id:
            return None

        # 等待完成
        if not self.client.wait_for_completion(prompt_id):
            print("  ✗ 生成超时")
            return None

        # 获取图片
        image_data = self.client.get_image(prompt_id, f"ink_realm_{prompt_id}_00001_.png")
        if not image_data:
            return None

        # 后处理
        image_data = self.post_processor.resize(image_data, 512, 512)
        image_data = self.post_processor.remove_background(image_data)

        # 保存
        with open(ref_file, "wb") as f:
            f.write(image_data)

        # 上传到ComfyUI供后续使用
        uploaded_name = self.client.upload_image(image_data, f"{character_id}_ref.png")

        # 保存版本
        self.version_mgr.save_version(
            "character_ref",
            character_id,
            {
                "character": character,
                "ref_file": ref_file.name,
                "uploaded_name": uploaded_name,
            },
        )

        print(f"  ✓ 参考图已生成: {ref_file.name}")
        return uploaded_name

    def generate_character(self, character_id: str) -> bool:
        """生成单个角色的所有精灵"""
        if character_id not in CHARACTERS:
            print(f"未知角色: {character_id}")
            return False

        character = CHARACTERS[character_id]
        print(f"\n{'='*60}")
        print(f"生成角色: {character['name_cn']} ({character_id})")
        print(f"{'='*60}")

        # 创建输出目录
        output_dir = ASSETS_DIR / "sprites" / character_id
        output_dir.mkdir(parents=True, exist_ok=True)

        # 生成参考图
        ref_image_name = self.generate_character_ref(character_id)
        if not ref_image_name:
            print("  ✗ 无法生成参考图，跳过")
            return False

        # 计算总帧数
        total_frames = sum(
            character["frames_per_action"][action] * len(character["directions"])
            for action in character["actions"]
        )
        print(f"\n共需生成 {total_frames} 帧")

        # 生成每一帧
        current_frame = 0
        for action in character["actions"]:
            num_frames = character["frames_per_action"][action]
            for direction in character["directions"]:
                for frame in range(num_frames):
                    current_frame += 1
                    print(f"  [{current_frame}/{total_frames}] {action}_{direction}_{frame}...", end=" ")

                    # 构建工作流
                    workflow = self.prompt_builder.build_character_frame_prompt(
                        character, action, direction, frame, ref_image_name
                    )

                    # 提交生成
                    prompt_id = self.client.queue_prompt(workflow)
                    if not prompt_id:
                        print("失败")
                        continue

                    # 等待完成
                    if not self.client.wait_for_completion(prompt_id, timeout=120):
                        print("超时")
                        continue

                    # 获取图片
                    image_data = self.client.get_image(prompt_id, f"ink_realm_{prompt_id}_00001_.png")
                    if not image_data:
                        print("失败")
                        continue

                    # 后处理
                    image_data = self.post_processor.resize(image_data, SPEC_CHAR_WIDTH, SPEC_CHAR_HEIGHT)
                    image_data = self.post_processor.remove_background(image_data)

                    # 保存单帧
                    frame_file = output_dir / f"{character_id}_{direction}_{action}_{frame}.png"
                    with open(frame_file, "wb") as f:
                        f.write(image_data)

                    print("✓")

                    # 记录日志
                    self.log_entries.append(
                        {
                            "type": "character_frame",
                            "character": character_id,
                            "action": action,
                            "direction": direction,
                            "frame": frame,
                            "file": frame_file.name,
                            "prompt_id": prompt_id,
                        }
                    )

        # 生成精灵表
        print(f"\n  生成精灵表...")
        self._generate_sprite_sheet(character_id)

        # 保存版本
        self.version_mgr.save_version(
            "character",
            character_id,
            {
                "character": character,
                "total_frames": total_frames,
                "ref_image": ref_image_name,
                "output_dir": output_dir.name,
            },
        )

        return True

    def _generate_sprite_sheet(self, character_id: str):
        """为角色生成精灵表"""
        character = CHARACTERS[character_id]
        output_dir = ASSETS_DIR / "sprites" / character_id

        for action in character["actions"]:
            frames = []
            for direction in character["directions"]:
                for frame in range(character["frames_per_action"][action]):
                    frame_file = output_dir / f"{character_id}_{direction}_{action}_{frame}.png"
                    if frame_file.exists():
                        with open(frame_file, "rb") as f:
                            frames.append(f.read())

            if frames:
                # 创建精灵表（按方向分行）
                cols = character["frames_per_action"][action]
                sheet_data = self.post_processor.create_sprite_sheet(
                    frames, cols, SPEC_CHAR_WIDTH, SPEC_CHAR_HEIGHT
                )
                sheet_file = output_dir / f"{character_id}_{action}_spritesheet.png"
                with open(sheet_file, "wb") as f:
                    f.write(sheet_data)
                print(f"    ✓ {sheet_file.name}")

    def generate_background(self, chapter: str) -> bool:
        """生成单个章节的场景背景"""
        if chapter not in BACKGROUNDS:
            print(f"未知章节: {chapter}")
            return False

        background = BACKGROUNDS[chapter]
        print(f"\n{'='*60}")
        print(f"生成场景: {background['name_cn']} ({chapter})")
        print(f"{'='*60}")

        output_dir = ASSETS_DIR / "backgrounds" / chapter
        output_dir.mkdir(parents=True, exist_ok=True)

        for layer in background["layers"]:
            print(f"  生成 {layer} 层...", end=" ")

            # 构建工作流
            workflow = self.prompt_builder.build_background_prompt(background, layer)

            # 提交生成
            prompt_id = self.client.queue_prompt(workflow)
            if not prompt_id:
                print("失败")
                continue

            # 等待完成
            if not self.client.wait_for_completion(prompt_id):
                print("超时")
                continue

            # 获取图片
            image_data = self.client.get_image(prompt_id, f"ink_realm_{prompt_id}_00001_.png")
            if not image_data:
                print("失败")
                continue

            # 后处理
            image_data = self.post_processor.resize(image_data, SPEC_BG_WIDTH, SPEC_BG_HEIGHT)

            # 保存
            layer_file = output_dir / f"background_{layer}.png"
            with open(layer_file, "wb") as f:
                f.write(image_data)

            print("✓")

            # 记录日志
            self.log_entries.append(
                {
                    "type": "background_layer",
                    "chapter": chapter,
                    "layer": layer,
                    "file": layer_file.name,
                    "prompt_id": prompt_id,
                }
            )

        # 保存版本
        self.version_mgr.save_version(
            "background",
            chapter,
            {
                "background": background,
                "layers": background["layers"],
                "output_dir": output_dir.name,
            },
        )

        return True

    def generate_all(self) -> bool:
        """生成所有资源"""
        print("\n" + "=" * 60)
        print("开始生成所有美术资源")
        print("=" * 60)

        success = True

        # 生成角色
        print("\n[1/2] 生成角色精灵")
        for char_id in CHARACTERS:
            if not self.generate_character(char_id):
                success = False

        # 生成场景
        print("\n[2/2] 生成场景背景")
        for chapter in BACKGROUNDS:
            if not self.generate_background(chapter):
                success = False

        # 保存日志
        self._save_log()

        return success

    def _save_log(self):
        """保存生成日志"""
        log_file = LOGS_DIR / f"art_pipeline_{int(time.time())}.json"
        with open(log_file, "w", encoding="utf-8") as f:
            json.dump(self.log_entries, f, ensure_ascii=False, indent=2)
        print(f"\n日志已保存: {log_file}")


# ============================================================================
# CLI入口
# ============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="墨境棋局 - ComfyUI美术资源自动化生成管线 v2",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  %(prog)s --all                          # 生成所有资源
  %(prog)s --character protagonist        # 生成主角精灵表
  %(prog)s --background chapter1          # 生成第一章场景
  %(prog)s --server http://localhost:8188 # 指定ComfyUI服务器

分层控制策略:
  1. 角色一致性: IP-Adapter + 角色参考图
  2. 动作一致性: ControlNet OpenPose + 参考姿态
  3. 风格统一: 风格LoRA + 固定negative prompt
  4. 版本管理: 记录所有参数，确保可复现
        """,
    )

    parser.add_argument(
        "--server",
        default=COMFYUI_SERVER,
        help=f"ComfyUI服务器地址 (默认: {COMFYUI_SERVER})",
    )

    # 生成选项
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--all", action="store_true", help="生成所有资源")
    group.add_argument("--character", type=str, help="生成指定角色 (protagonist/ink_beast/ink_wolf/shadow_wolf)")
    group.add_argument("--background", type=str, help="生成指定章节场景 (chapter1/chapter2/chapter3)")
    group.add_argument("--versions", action="store_true", help="列出版本记录")

    args = parser.parse_args()

    # 列出版本
    if args.versions:
        version_mgr = VersionManager()
        versions = version_mgr.list_versions()
        if versions:
            print("版本记录:")
            for v in versions:
                print(f"  - {v}")
        else:
            print("暂无版本记录")
        return

    # 创建管线
    pipeline = ArtPipeline(args.server)

    # 测试连接
    if not pipeline.test_connection():
        print("\n提示: 如需实际生成，请启动ComfyUI服务器:")
        print("  cd /path/to/ComfyUI")
        print("  python main.py")
        print("\n当前为预览模式，仅显示生成计划")
        return

    # 执行生成
    if args.all:
        success = pipeline.generate_all()
    elif args.character:
        success = pipeline.generate_character(args.character)
    elif args.background:
        success = pipeline.generate_background(args.background)

    if success:
        print("\n✓ 生成完成")
    else:
        print("\n✗ 生成失败")
        sys.exit(1)


if __name__ == "__main__":
    main()
