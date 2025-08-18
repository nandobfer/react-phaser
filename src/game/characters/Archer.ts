import { Arrow } from "../objects/Arrow"
import { Game } from "../scenes/Game"
import { RangedCharacter } from "./RangedCharacter"

export class Archer extends RangedCharacter<Arrow> {
    attackSpeed = 0.75
    speed = 40
    attackDamage = 30

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, "archer", Arrow)
    }

    extractAttackingAnimation() {
        this.extractAnimationsFromSpritesheet("attacking", 208, 13)
    }
}
