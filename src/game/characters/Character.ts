import Phaser from "phaser";

export class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string | Phaser.Textures.Texture
    ) {
        super(scene, x, y, texture);
    }
}
