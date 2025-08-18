import { Game } from "../scenes/Game"
import { Character } from "./Character"

export class Archer extends Character {
    attackSpeed = 0.75
    speed = 40
    attackDamage = 30
    attackRange = 5

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, "archer")
    }

    extractAttackingAnimation() {
        this.extractAnimationsFromSpritesheet("attacking1", 208, 13)
        this.extractAnimationsFromSpritesheet("attacking2", 208, 13)
    }
}
