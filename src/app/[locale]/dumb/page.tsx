"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Game2048() {
    const [grid, setGrid] = useState<number[][]>([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]);
    const [positions, setPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [jsonGame, setJsonGame] = useState<string | null>(null);

    const tileSize = 72;
    const gapSize = 8;

    const calculatePositions = (grid: number[][]) => {
        const newPositions: { [key: string]: { x: number; y: number } } = {};
        grid.forEach((row, rowIndex) => {
            row.forEach((_, colIndex) => {
                newPositions[`${rowIndex}-${colIndex}`] = {
                    x: colIndex * (tileSize + gapSize),
                    y: rowIndex * (tileSize + gapSize),
                };
            });
        });
        return newPositions;
    };

    useEffect(() => {
        setPositions(calculatePositions(grid));
    }, [grid]);

    const addRandomTile = (currentGrid: number[][]) => {
        const emptyTiles = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (currentGrid[i][j] === 0) {
                    emptyTiles.push([i, j]);
                }
            }
        }
        if (emptyTiles.length > 0) {
            const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            currentGrid[i][j] = Math.random() < 0.8 ? 2 : 4;
        } else {
            setGameOver(true);
            setJsonGame(JSON.stringify(currentGrid));
        }
        return currentGrid;
    };

    const isGameOver = (currentGrid: number[][]): boolean => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (currentGrid[i][j] === 0) {
                    return false;
                }
                if (i > 0 && currentGrid[i][j] === currentGrid[i - 1][j]) {
                    return false;
                }
                if (i < 3 && currentGrid[i][j] === currentGrid[i + 1][j]) {
                    return false;
                }
                if (j > 0 && currentGrid[i][j] === currentGrid[i][j - 1]) {
                    return false;
                }
                if (j < 3 && currentGrid[i][j] === currentGrid[i][j + 1]) {
                    return false;
                }
            }
        }
        return true;
    };

    const moveLeft = () => {
        const newGrid = grid.map(row => {
            const filteredRow = row.filter(cell => cell !== 0);
            for (let i = 0; i < filteredRow.length - 1; i++) {
                if (filteredRow[i] === filteredRow[i + 1]) {
                    filteredRow[i] *= 2;
                    setScore(score => score + filteredRow[i]);
                    filteredRow.splice(i + 1, 1);
                }
            }
            while (filteredRow.length < 4) {
                filteredRow.push(0);
            }
            return filteredRow;
        });
        return newGrid;
    };

    const moveRight = () => {
        const newGrid = grid.map(row => {
            const filteredRow = row.filter(cell => cell !== 0);
            for (let i = filteredRow.length - 1; i > 0; i--) {
                if (filteredRow[i] === filteredRow[i - 1]) {
                    filteredRow[i] *= 2;
                    setScore(score => score + filteredRow[i]);
                    filteredRow.splice(i - 1, 1);
                }
            }
            while (filteredRow.length < 4) {
                filteredRow.unshift(0);
            }
            return filteredRow;
        });
        return newGrid;
    };

    const moveUp = () => {
        const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
        for (let j = 0; j < 4; j++) {
            const column: number[] = [];
            for (let i = 0; i < 4; i++) {
                if (grid[i][j] !== 0) column.push(grid[i][j]);
            }
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1]) {
                    column[i] *= 2;
                    setScore(score => score + column[i]);
                    column.splice(i + 1, 1);
                }
            }
            while (column.length < 4) {
                column.push(0);
            }
            for (let i = 0; i < 4; i++) {
                newGrid[i][j] = column[i];
            }
        }
        return newGrid;
    };

    const moveDown = () => {
        const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
        for (let j = 0; j < 4; j++) {
            const column: number[] = [];
            for (let i = 0; i < 4; i++) {
                if (grid[i][j] !== 0) column.push(grid[i][j]);
            }
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1]) {
                    column[i] *= 2;
                    setScore(score => score + column[i]);
                    column.splice(i - 1, 1);
                }
            }
            while (column.length < 4) {
                column.unshift(0);
            }
            for (let i = 0; i < 4; i++) {
                newGrid[i][j] = column[i];
            }
        }
        return newGrid;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (!gameOver) {
            let newGrid = null;
            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    newGrid = moveLeft();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    newGrid = moveRight();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    newGrid = moveUp();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    newGrid = moveDown();
                    break;
                default:
                    break;
            }
            if (newGrid && JSON.stringify(newGrid) !== JSON.stringify(grid)) {
                const updatedGrid = addRandomTile([...newGrid]);
                setGrid(updatedGrid);
                if (isGameOver(updatedGrid)) {
                    setGameOver(true);
                    setJsonGame(JSON.stringify(updatedGrid));
                }
            }
        }
    };

    // // Add touch support for mobile devices
    // const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
    // const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

    // const handleTouchStart = (e: React.TouchEvent) => {
    //     setTouchStart({
    //         x: e.touches[0].clientX,
    //         y: e.touches[0].clientY
    //     });
    // };

    // const handleTouchMove = (e: React.TouchEvent) => {
    //     setTouchEnd({
    //         x: e.touches[0].clientX,
    //         y: e.touches[0].clientY
    //     });
    // };

    // const handleTouchEnd = () => {
    //     if (!gameOver) {
    //         const deltaX = touchEnd.x - touchStart.x;
    //         const deltaY = touchEnd.y - touchStart.y;
    //         let newGrid: number[][] = [[], [], [], []];

    //         if (Math.abs(deltaX) > 30 || Math.abs(deltaY) > 30) {
    //             if (Math.abs(deltaX) > Math.abs(deltaY)) {
    //                 // Horizontal swipe
    //                 if (deltaX > 0) {
    //                     newGrid = moveRight();
    //                 } else {
    //                     newGrid = moveLeft();
    //                 }
    //             } else {
    //                 // Vertical swipe
    //                 if (deltaY > 0) {
    //                     newGrid = moveDown();
    //                 } else {
    //                     newGrid = moveUp();
    //                 }
    //             }

    //             if (newGrid && JSON.stringify(newGrid) !== JSON.stringify(grid)) {
    //                 const updatedGrid = addRandomTile([...newGrid]);
    //                 setGrid(updatedGrid);
    //                 if (isGameOver(updatedGrid)) {
    //                     setGameOver(true);
    //                     setJsonGame(JSON.stringify(updatedGrid));
    //                 }
    //             }
    //         }
    //     }
    // };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [grid, gameOver]);

    useEffect(() => {
        setGrid(prevGrid => addRandomTile([...prevGrid]));
    }, []);

    const getTileColor = (tile: number) => {
        switch (tile) {
            case 2: return 'bg-red-100';
            case 4: return 'bg-red-200';
            case 8: return 'bg-red-300';
            case 16: return 'bg-red-400';
            case 32: return 'bg-red-500';
            case 64: return 'bg-red-600';
            case 128: return 'bg-red-700';
            case 256: return 'bg-red-800';
            case 512: return 'bg-red-900';
            case 1024: return 'bg-red-950';
            case 2048: return 'bg-red-950';
            default: return 'bg-gray-700';
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen relative">
            <div 
                className="grid grid-cols-4 gap-2 absolute"
                // onTouchStart={handleTouchStart}
                // onTouchMove={handleTouchMove}
                // onTouchEnd={handleTouchEnd}
            >
                {grid.map((row, rowIndex) => (
                    row.map((tile, colIndex) => (
                        <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className={`absolute w-16 h-16 flex items-center justify-center text-white font-bold ${getTileColor(tile)}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{
                                scale: tile !== 0 ? 1 : 0.9,
                                opacity: tile !== 0 ? 1 : 0.5,
                                x: positions[`${rowIndex}-${colIndex}`]?.x || 0,
                                y: positions[`${rowIndex}-${colIndex}`]?.y || 0,
                            }}
                            transition={{
                                scale: { duration: 0.2 },
                                opacity: { duration: 0.2 },
                                x: { duration: 0.3 },
                                y: { duration: 0.3 },
                            }}
                        >
                            {tile !== 0 ? tile : ''}
                        </motion.div>
                    ))
                ))}
            </div>
            <p className="absolute top-5 left-5 text-white">Score: {score}</p>
            {jsonGame && <p className="absolute bottom-5 left-5 text-white">DEBUG: {jsonGame}</p>}
            {gameOver && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl">Game Over!</div>}
        </div>
    );
}