import { Game } from "../scenes/Game"
import { Character } from "./Character"

export class Knight extends Character {
    armor = 10
    resistance = 10

    constructor(scene: Game, x: number, y: number, id: string) {
        super(scene, x, y, "knight", id)
    }
}
