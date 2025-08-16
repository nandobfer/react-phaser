import React, { useState } from 'react'
import {Box} from '@mui/material'
import { Character, CharacterGroup } from '../game/characters/Character'

interface CharactersRowProps {
    charactersGroup: CharacterGroup
}

export const CharactersRow: React.FC<CharactersRowProps> = (props) => {
    const [characters, setCharacters] = useState<Character[]>([])

    
    return (
        <Box sx={{}}>
            
        </Box>
    )
}