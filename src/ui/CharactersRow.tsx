import React, { useMemo, useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import { CharacterSheet } from "./CharacterSheet/CharacterSheet"
import { CharacterGroup } from "../game/characters/CharacterGroup"

interface CharactersRowProps {
    charactersGroup: CharacterGroup
}

export const CharactersRow: React.FC<CharactersRowProps> = (props) => {
    const characters = useMemo(() => props.charactersGroup.getChildren(), [props.charactersGroup])

    return (
        <Paper sx={{ flexDirection: "column", padding: 1, pointerEvents: "auto", width: "20vw" }}>
            {characters.map((char) => (
                <CharacterSheet character={char} key={char.id} />
            ))}
        </Paper>
    )
}
