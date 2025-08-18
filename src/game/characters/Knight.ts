import { Game } from "../scenes/Game"
import { Character } from "./Character"

export class Knight extends Character {
    armor = 50
    resistance = 10

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, "knight")
    }
}
