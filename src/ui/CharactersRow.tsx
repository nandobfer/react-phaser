import React, { useMemo, useState } from "react"
import { Box, Paper, Typography } from "@mui/material"
import { Character, CharacterGroup } from "../game/characters/Character"
import { CharacterSheet } from "./CharacterSheet/CharacterSheet"

interface CharactersRowProps {
    charactersGroup: CharacterGroup
}

export const CharactersRow: React.FC<CharactersRowProps> = (props) => {
    const characters = useMemo(() => props.charactersGroup.getChildren() as Character[], [props.charactersGroup])

    return (
        <Paper sx={{ flexDirection: "column", padding: 1, pointerEvents: "auto", width: 300 }}>
            {characters.map((char) => (
                <CharacterSheet character={char} key={char.name} />
            ))}
        </Paper>
    )
}
