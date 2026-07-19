# 姿态参考图目录

此目录用于存放从外部来源下载的姿态参考图，用于 VNCCS POSE STUDIO 的姿态迁移。

## 用途

- **输入**: 从免费素材网站下载的角色动作帧（任意风格）
- **处理**: VNCCS POSE STUDIO 提取骨骼姿态
- **输出**: 标准 OpenPose 格式姿态图（供 ControlNet 使用）

## 推荐素材来源

### 免费可商用素材

1. **Kenney.nl** - CC0 游戏素材
   - 角色动画包: https://kenney.nl/assets/category:2D
   - 许可证: CC0 (公共领域)

2. **itch.io** - 免费游戏资源
   - 搜索 "sprite sheet CC0" 或 "character animation free"
   - 注意查看具体许可证

3. **OpenGameArt.org** - 开源游戏素材
   - 角色动画分类: https://opengameart.org/art-search-advanced?keys=&field_art_type_tid%5B%5D=9
   - 许可证: CC0 / GPL / OGA-BY

4. **Mixamo** - 3D 动作库
   - 可导出 FBX 格式，用于 VNCCS POSE STUDIO
   - 免费使用（需 Adobe 账号）

## 文件命名规范

```
{来源}_{角色类型}_{动作}_{方向}_{帧号}.png
```

示例:
- `kenney_hero_idle_s_0.png`
- `mixamo_warrior_attack_e_1.png`

## 已下载素材

### 1. Puny Characters (OpenGameArt)
- **来源**: https://opengameart.org/content/puny-characters
- **作者**: Shade
- **许可证**: CC0
- **尺寸**: 32x32 像素
- **内容**: 8方向角色动画（idle, walk, attack, death）
- **用途**: 测试 VNCCS 姿态提取

### 2. Hero Knight (itch.io)
- **来源**: https://luizmelo.itch.io/hero-knight
- **作者**: LuizMelo
- **许可证**: CC0
- **尺寸**: 高分辨率精灵
- **内容**: 动画帧（idle, run, attack, death）
- **用途**: 主角动作参考

## 下一步

1. 下载更多高质量姿态参考图
2. 使用 VNCCS POSE STUDIO 提取骨骼姿态
3. 生成标准 OpenPose 格式图片
4. 用于 ControlNet 驱动角色精灵生成

## 注意事项

- 所有下载的素材必须符合许可证要求
- 优先使用 CC0 或明确标注可商用的素材
- 保留原始文件以便追溯来源
- 记录每个素材的作者和许可证信息
