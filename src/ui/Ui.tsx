import React, { useEffect, useState } from "react"
import { Box, ThemeProvider } from "@mui/material"
import Phaser from "phaser"
import { CharactersRow } from "./CharactersRow"
import { Game } from "../game/scenes/Game"
import { EventBus } from "../game/EventBus"
import { useMuiTheme } from "../hooks/useMuiTheme"

interface UiProps {}

export const Ui: React.FC<UiProps> = (props) => {
    const theme = useMuiTheme()
    const [game, setGame] = useState<Game | null>(null)
    useEffect(() => {
        EventBus.on("game-ready", (game: Game) => setGame(game))
    }, [])
    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 5,
                    border: "1px solid red",
                    pointerEvents: "none",
                }}
            >
                {game && <CharactersRow charactersGroup={game.playerTeam} />}
            </Box>
        </ThemeProvider>
    )
}
