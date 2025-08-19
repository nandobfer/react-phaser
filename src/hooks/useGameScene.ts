import { useEffect, useState } from "react"
import { EventBus } from "../game/EventBus"
import { Game } from "../game/scenes/Game"

export const useGameScene = () => {
    const [game, setGame] = useState<Game | null>(null)

    useEffect(() => {
        EventBus.on("game-ready", (game: Game) => setGame(game))

        return () => {
            EventBus.off("game-ready", (game: Game) => setGame(game))
        }
    }, [])

    return game
}
