import Phaser from 'phaser'

import GameScene from './scenes/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 700,
	height: 700,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)
