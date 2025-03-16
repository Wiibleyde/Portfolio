"use client"
import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
    query: {
        player: '' // This will be updated with the player's name
    }
});

interface GameStatus {
    status: string;
    board: number[][];
    players: string[];
    currentPlayer: string;
    winner: string;
    winnerType: string;
    turns: number;
}

export default function Puissance4Page() {
    const t = useTranslations("Power4Page");

    const [gameCode, setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);
    const [inGame, setInGame] = useState(false);

    useEffect(() => {
        socket.on('game-code', (code) => setGameCode(code));
        socket.on('game-status', (status) => {
            const parsedStatus = JSON.parse(status);
            setGameStatus(parsedStatus);
            setInGame(parsedStatus.players.includes(playerName));
            console.log(parsedStatus);
        });
        socket.on('error', (error) => alert(error));
        socket.on('turn-played', (status) => setGameStatus(JSON.parse(status)));
        socket.on('reconnect', () => {
            console.log('Reconnected to server');
            if (inGame) {
                socket.emit('join-game', gameCode, playerName);
            }
        });
        return () => {
            socket.off('game-code');
            socket.off('game-status');
            socket.off('error');
            socket.off('turn-played');
            socket.off('reconnect');
        };
    }, [playerName, inGame, gameCode]);

    const createGame = () => {
        if (playerName.trim() === '') {
            alert('Player name cannot be empty');
            return;
        }
        socket.emit('create-game', playerName);
        socket.io.opts.query = { player: playerName }; // Update the player name in the socket query
    };

    const joinGame = () => {
        if (inGame) {
            alert('You are already in a game');
            return;
        }
        console.log(playerName, gameCode);
        if (playerName.trim() === '' || gameCode.trim() === '') {
            alert('Player name and game code cannot be empty');
            return;
        }
        socket.emit('join-game', gameCode, playerName);
        socket.io.opts.query = { player: playerName }; // Update the player name in the socket query
    };

    const playTurn = (column: number) => {
        socket.emit('play-turn', gameCode, column);
    };

    const startGame = () => {
        socket.emit('start-game', gameCode);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <input 
                type="text" 
                placeholder={t('playerName')}
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                className="mb-2 p-2 border rounded"
            />
            <button 
                onClick={createGame} 
                className={`mb-2 p-2 ${playerName.trim() === '' ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded`} 
                disabled={playerName.trim() === ''}
            >
                {t('createGame')}
            </button>
            <input 
                type="text" 
                placeholder={t('gameCode')}
                value={gameCode} 
                onChange={(e) => setGameCode(e.target.value)} 
                className="mb-2 p-2 border rounded"
            />
            <button 
                onClick={joinGame} 
                className={`mb-4 p-2 ${playerName.trim() === '' || gameCode.trim() === '' ? 'bg-gray-400' : 'bg-green-500'} text-white rounded`} 
                disabled={playerName.trim() === '' || gameCode.trim() === ''}
            >
                {t('joinGame')}
            </button>
            {gameStatus && (
                <div className="text-center">
                    {gameStatus.players.length === 2 && gameStatus.status === 'STANDBY' && (
                        <button onClick={startGame} className="mb-2 p-2 bg-yellow-500 text-white rounded">
                            {t('startGame')}
                        </button>
                    )}
                    <h3 className="text-xl mb-2">{t('playerTurn', { player: gameStatus.currentPlayer })}</h3>
                    <h3 className="text-xl mb-2">{t('turns', { turns: gameStatus.turns })}</h3>
                    {gameStatus.winner && <WinnerPopup winner={gameStatus.winner} />}
                    {gameStatus.status === 'STANDBY' && <h3 className="text-xl mb-2">{t('waitingForPlayers')}</h3>}
                    <div className="grid grid-cols-7 gap-1 bg-blue-700 p-4 rounded">
                        <Grid board={gameStatus.board} playTurn={playTurn} />
                    </div>
                </div>
            )}
        </div>
    );
};

export function Grid({ board, playTurn }: { board: number[][], playTurn: (column: number) => void }) {
    return (
        <>
            {board[0].map((_, columnIndex) => (
                <Column key={columnIndex} columnValues={board.map(row => row[columnIndex])} playMove={() => playTurn(columnIndex)} />
            ))}
        </>
    );
}

export function Column({ columnValues, playMove }: { columnValues: number[], playMove: () => void }) {
    return (
        <div className={`grid grid-rows-${columnValues.length} gap-1 cursor-pointer`} onClick={playMove}>
            {columnValues.map((cellValue, index) => (
                <Cell key={index} value={cellValue} />
            ))}
        </div>
    )
}

const colors: { [key: number]: string } = {
    0: 'bg-blue-900',
    1: 'bg-red-500',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
    4: 'bg-blue-500',
    5: 'bg-purple-500',
    6: 'bg-orange-500',
    7: 'bg-pink-500',
    8: 'bg-brown-500',
};

export function Cell({ value }: { value: number }) {
    return <div className={`w-12 h-12 ${colors[value]} flex items-center justify-center rounded-full`} />;
}

function WinnerPopup({ winner }: { winner: string }) {
    const t = useTranslations("Power4Page");

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-gray-500 p-4 rounded-xl">
                <h2 className="text-2xl font-bold mb-4">{t('winner')}</h2>
                <p className="text-xl">{winner}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    {t('playAgain')}
                </button>
            </div>
        </div>
    );
}