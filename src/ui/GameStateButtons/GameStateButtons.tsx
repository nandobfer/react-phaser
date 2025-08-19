import React, { useEffect, useState } from "react"
import { Box, Button } from "@mui/material"
import { Game, GameState } from "../../game/scenes/Game"
import { EventBus } from "../../game/EventBus"

interface GameStateButtonsProps {
    game: Game
}

export const GameStateButtons: React.FC<GameStateButtonsProps> = (props) => {
    const [gameState, setGameState] = useState(props.game.state)

    const onResetClick = () => {
        props.game.playerTeam.reset()
        props.game.enemyTeam.reset()
    }

    const onPlayClick = () => {
        props.game.changeState("fighting")
    }

    const onStopClick = () => {
        props.game.changeState("idle")
        onResetClick()
    }

    useEffect(() => {
        EventBus.on("gamestate", (state: GameState) => setGameState(state))
    }, [])

    return (
        <Box sx={{ pointerEvents: "auto", flexDirection: "column", gap: 1, height: "min-content" }}>
            <Button variant="outlined" onClick={onResetClick}>
                reset
            </Button>
            <Button variant="outlined" onClick={gameState === "fighting" ? onStopClick : onPlayClick}>
                {gameState === "fighting" ? "stop" : "fight"}
            </Button>
        </Box>
    )
}
