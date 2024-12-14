import React, {useState} from "react";

const GameBoard = () => {
    const gridSize = 5;
    const boxSize = 100;
    const padding = 20;

    const [currentPlayer, setCurrentPlayer] = useState(1); // 1 or 2
    const [playerScores, setPlayerScores] = useState({ 1: 0, 2: 0 });

    const playerColors = { 1: "blue", 2: "green" };

    const [lines, setLines] = useState({
        vertical: Array(gridSize).fill(null).map(() => Array(gridSize + 1).fill(null)),
        horizontal: Array(gridSize + 1).fill(null).map(() => Array(gridSize).fill(null)),
    });

    const [completedBoxes, setCompletedBoxes] = useState(
        Array(gridSize - 1).fill(null).map(() => Array(gridSize - 1).fill(null))
    );

    const handleClick = (type, row, col) => {
        const newLines = {
            vertical: lines.vertical.map(row => [...row]),
            horizontal: lines.horizontal.map(row => [...row]),
        };

        // assign color
        newLines[type][row][col] = playerColors[currentPlayer];

        setLines(newLines);
        const completedBoxesAfterMove = checkCompletedBoxes(newLines);

        // change turn if no box is completed after move
        if (!completedBoxesAfterMove) {
            setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
        }
    };

    const checkCompletedBoxes = (newLines) => {
        const newCompletedBoxes = completedBoxes.map(row => [...row]);
        let boxesCompletedThisTurn = 0;

        for (let row = 0; row < gridSize - 1; row++) {
            for (let col = 0; col < gridSize - 1; col++) {
                // check if all four sides of the box are filled
                const topLine = newLines.horizontal[row][col];
                const bottomLine = newLines.horizontal[row + 1][col];
                const leftLine = newLines.vertical[row][col];
                const rightLine = newLines.vertical[row][col + 1];
    
                if (topLine && bottomLine && leftLine && rightLine && !newCompletedBoxes[row][col]) {
                    newCompletedBoxes[row][col] = currentPlayer; // mark box with current player number
                    boxesCompletedThisTurn++;
                }
            }
        }

        setCompletedBoxes(newCompletedBoxes);

        // increment the score of the current player if needed
        if (boxesCompletedThisTurn > 0) {
            setPlayerScores({
                ...playerScores,
                [currentPlayer]: playerScores[currentPlayer] + boxesCompletedThisTurn
            });
            return true; // return true if any box was completed
        }

        return false;
    };

    return (
        <div style={{padding}}>
            <h2>{`Player ${currentPlayer}'s Turn`}</h2>
            <h3>{`Player 1: ${playerScores[1]} | Player 2: ${playerScores[2]}`}</h3>

            <svg width={gridSize * boxSize + 2 * padding} height={gridSize * boxSize + 2 * padding} style={{border: "1px solid black"}}>
                {/* dots */}
                {Array.from({length: gridSize + 1}).map((_, row) =>
                    Array.from({length: gridSize + 1}).map((_, col) => (
                        <circle 
                            key={`dot-${row}-${col}`}
                            cx={col * boxSize + padding}
                            cy={row * boxSize + padding}
                            r="3"
                            fill="black"
                        />
                    ))
                )}

                {/* horizontal lines */}
                {lines.horizontal.map((row, rowIndex) =>
                    row.map((color, colIndex) => (
                        <line
                            key={`hline-${rowIndex}-${colIndex}`}
                            x1={colIndex * boxSize + padding}
                            y1={rowIndex * boxSize + padding}
                            x2={(colIndex + 1) * boxSize + padding}
                            y2={rowIndex * boxSize + padding}
                            stroke={color || "transparent"}
                            strokeWidth="5"
                            onMouseEnter={(e) => e.target.setAttribute("stroke", "gray")}
                            onMouseLeave={(e) => e.target.setAttribute("stroke", color || "transparent")}
                            onClick={() => handleClick("horizontal", rowIndex, colIndex)}
                        />
                    ))
                )}

                {/* vertical lines */}
                {lines.vertical.map((row, rowIndex) =>
                    row.map((color, colIndex) => (
                        <line 
                            key={`vline-${rowIndex}-${colIndex}`}
                            x1={colIndex * boxSize + padding}
                            y1={rowIndex * boxSize + padding}
                            x2={colIndex * boxSize + padding}
                            y2={(rowIndex + 1) * boxSize + padding}
                            stroke={color || "transparent"}
                            strokeWidth="5"
                            onMouseEnter={(e) => e.target.setAttribute("stroke", "gray")}
                            onMouseLeave={(e) => e.target.setAttribute("stroke", color || "transparent")}
                            onClick={() => handleClick("vertical", rowIndex, colIndex)}
                        />
                    ))
                )}

                {/* boxes */}
                {completedBoxes.map((row, rowIndex) =>
                    row.map((player, colIndex) =>
                        player ? (
                            <text
                                key={`box-${rowIndex}-${colIndex}`}
                                x={(colIndex + 0.5) * boxSize + padding}
                                y={(rowIndex + 0.5) * boxSize + padding}
                                fontSize="40"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={playerColors[player]}
                            >
                                X
                            </text>
                        ) : null
                    )
                )}
            </svg>
        </div>
    );
};

export default GameBoard;