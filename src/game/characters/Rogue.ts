import { Game } from "../scenes/Game";
import { Character } from "./Character";

export class Rogue extends Character {
    attackSpeed = 1.5
    speed = 50
    attackDamage = 20

    constructor(scene: Game, x: number, y: number) {
        super(scene, x, y, "rogue")
    }
}