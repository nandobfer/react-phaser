import React, { useEffect, useMemo, useState } from 'react'
import {Box, Dialog, Typography} from '@mui/material'
import { CharacterRegistry } from '../../game/characters/CharacterRegistry'
import { Game } from '../../game/scenes/Game'
import { EventBus } from '../../game/EventBus'
import { CharacterDto } from '../../game/characters/Character'
import { NewCharacterContainer } from './NewCharacterContainer'
import { useGameScene } from '../../hooks/useGameScene'

interface NewCharacterModalProps {
    open: boolean
    handleClose: () => void
}

export const NewCharacterModal: React.FC<NewCharacterModalProps> = (props) => {
    const game = useGameScene()

    const classes = useMemo(() => {
        if (!game) return []

        const characters:CharacterDto[] = []

        const availableCharacters = CharacterRegistry.getAllRegistered()
        for (const name of availableCharacters) {
            const character = CharacterRegistry.create(name, game, 0, 0, Phaser.Utils.String.UUID())
            characters.push(character.getDto())
            character.destroy(true)
        }

        return characters
    }, [game])

    const onChooseCharacter = (dto: CharacterDto) => {
        console.log({dto})
        game?.newPlayerCharacter(dto)
        props.handleClose()
    }

    
    return (
        <Dialog open={props.open} onClose={props.handleClose} >
            <Typography variant='h5' color='primary.main' fontWeight={'bold'}>new character</Typography>
            <Box sx={{gap: 1}}>
                {classes.map(character => <NewCharacterContainer character={character} key={character.id} onChoose={onChooseCharacter} />)}
            </Box>
        </Dialog>
    )
}