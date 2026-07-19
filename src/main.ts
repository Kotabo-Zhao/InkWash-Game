import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';
import { EventScene } from './scenes/EventScene';
import { ShopScene } from './scenes/ShopScene';
import { RestScene } from './scenes/RestScene';
import { RewardScene } from './scenes/RewardScene';
import { StoryScene } from './scenes/StoryScene';
import { SettingsOverlay } from './scenes/SettingsOverlay';
import { PauseOverlay } from './scenes/PauseOverlay';
import { UpgradeScene } from './scenes/UpgradeScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 390,
  height: 844,
  parent: 'game-container',
  backgroundColor: '#0f0f1a',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    MenuScene,
    StoryScene,
    MapScene,
    BattleScene,
    EventScene,
    ShopScene,
    RestScene,
    RewardScene,
    UpgradeScene,
    GameScene,
    ResultScene,
    SettingsOverlay,
    PauseOverlay,
  ],
};

const game = new Phaser.Game(config);

export default game;
