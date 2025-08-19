import { Game } from "../scenes/Game";
import { Archer } from "./Archer";
import { Character } from "./Character";
import { Knight } from "./Knight";
import { Rogue } from "./Rogue";

// Create a character registry
export class CharacterRegistry {
    private static registry: Map<string, new (scene: Game, x: number, y: number, name: string, id: string) => Character> = new Map();

    static register(name: string, characterClass: new (scene: Game, x: number, y: number, name: string, id: string) => Character) {
        this.registry.set(name, characterClass);
    }

    static create(name: string, scene: Game, x: number, y: number, id: string): Character {
        const CharacterClass = this.registry.get(name);
        if (!CharacterClass) {
            throw new Error(`Character class not found: ${name}`);
        }
        const character = new CharacterClass(scene, x, y, id, id);
        return character
    }

    static getAllRegistered(): string[] {
        return Array.from(this.registry.keys());
    }
}

CharacterRegistry.register('rogue', Rogue);
CharacterRegistry.register('knight', Knight);
CharacterRegistry.register('archer', Archer);