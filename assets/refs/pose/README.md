# 姿态参考图素材

用于 VNCCS Pose Studio 的 SAM 3D Body 姿态检测。

## 素材列表

### 真实人物照片（Pexels CC0）

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `pose_idle_1.jpg` | 800x533 | 站立/待机姿势 |
| `pose_action_1.jpg` | 800x534 | 太极动作 |
| `pose_action_2.jpg` | 800x1066 | 武术姿势（竖版） |
| `pose_action_3.jpg` | 800x1422 | 跳跃动作（竖版） |
| `pose_attack_1.jpg` | 800x533 | 拳击攻击 |

## 来源

- **Pexels** (https://www.pexels.com/) - 免费商用，无需署名
- 所有照片均为真实人物动作照片，包含完整人体骨骼姿态
- 分辨率匹配角色参考图比例（887x1182）

## 使用方式

1. 在 ComfyUI 中加载 VNCCS Pose Studio 工作流
2. 使用 Pose Studio 的 "Import Image" 功能导入姿态图
3. SAM 3D Body 会自动检测人体骨骼姿态
4. 将检测到的姿态应用到 3D 人偶模型
5. 导出 OpenPose 格式姿态图

## 后续扩展

- 从 Mixamo 下载 FBX 动画帧（需 Adobe 账号）
- 从 Kenney.nl 下载高清精灵表（CC0）
- 使用 Blender 渲染自定义姿态
