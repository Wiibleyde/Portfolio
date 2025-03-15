"use client"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

interface GameStatus {
    status: string;
    board: number[][];
    players: string[];
    currentPlayer: string;
    winner: string;
    winnerType: string;
    turns: number;
}

const Puissance4Page = () => {
    const [gameCode, setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('');
    const [gameStatus, setGameStatus] = useState<GameStatus | null>(null);

    useEffect(() => {
        socket.on('game-code', (code) => setGameCode(code));
        socket.on('game-status', (status) => {
            setGameStatus(JSON.parse(status))
            console.log(JSON.parse(status));
        });
        socket.on('error', (error) => alert(error));
        socket.on('turn-played', (status) => setGameStatus(JSON.parse(status)));
        return () => {
            socket.off('game-code');
            socket.off('game-status');
            socket.off('error');
            socket.off('turn-played');
        };
    }, []);

    const createGame = () => {
        if (playerName.trim() === '') {
            alert('Player name cannot be empty');
            return;
        }
        socket.emit('create-game', playerName);
    };

    const joinGame = () => {
        console.log(playerName, gameCode);
        if (playerName.trim() === '' || gameCode.trim() === '') {
            alert('Player name and game code cannot be empty');
            return;
        }
        socket.emit('join-game', gameCode, playerName);
    };

    const playTurn = (column: number) => {
        socket.emit('play-turn', gameCode, column);
    };

    const startGame = () => {
        socket.emit('start-game', gameCode);
    };

    return (
        <div className="flex flex-col items-center p-4">
            <h1 className="text-4xl font-bold mb-4">Puissance4 Game</h1>
            <input 
                type="text" 
                placeholder="Player Name" 
                value={playerName} 
                onChange={(e) => setPlayerName(e.target.value)} 
                className="mb-2 p-2 border rounded"
            />
            <button onClick={createGame} className="mb-2 p-2 bg-blue-500 text-white rounded">Create Game</button>
            <input 
                type="text" 
                placeholder="Game Code" 
                value={gameCode} 
                onChange={(e) => setGameCode(e.target.value)} 
                className="mb-2 p-2 border rounded"
            />
            <button onClick={joinGame} className="mb-4 p-2 bg-green-500 text-white rounded">Join Game</button>
            {gameStatus && (
                <div className="text-center">
                    {gameStatus.players.length === 2 && gameStatus.status === 'STANDBY' && (
                        <button onClick={startGame} className="mb-2 p-2 bg-yellow-500 text-white rounded">Start Game</button>
                    )}
                    <h2 className="text-2xl mb-2">Game Status: {gameStatus.status}</h2>
                    <h3 className="text-xl mb-2">Current Player: {gameStatus.currentPlayer}</h3>
                    {gameStatus.winner && <h3 className="text-xl mb-2">Winner: {gameStatus.winner} ({gameStatus.winnerType})</h3>}
                    <div className="grid grid-cols-7 gap-1">
                        <Grid board={gameStatus.board} playTurn={playTurn} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Puissance4Page;

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
        <div className="grid grid-rows-6 gap-1 cursor-pointer" onClick={playMove}>
            {columnValues.map((cellValue, index) => (
                <Cell key={index} value={cellValue} />
            ))}
        </div>
    )
}

const colors: { [key: number]: string } = {
    0: 'bg-gray-300',
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
    return <div className={`w-12 h-12 ${colors[value]} flex items-center justify-center`} />;
}