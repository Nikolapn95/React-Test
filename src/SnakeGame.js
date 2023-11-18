import React, { useState, useEffect } from 'react';

const SnakeGame = () => {
  const gridSize = 20; // Change grid size
  const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
  const [food, setFood] = useState(generateFoodPosition());
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [resetGame, setResetGame] = useState(false);
  const [speed, setSpeed] = useState(1000 / 10); // Adjusted for slower snake movement

  function generateFoodPosition() {
    const x = Math.floor(Math.random() * gridSize);
    const y = Math.floor(Math.random() * gridSize);
    return { x, y };
  }

  const handleResetGame = () => {
    setSnake([{ x: 0, y: 0 }]);
    setFood(generateFoodPosition());
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setResetGame(false);
    setSpeed(1000 / 10); // Reset speed to a slower value
  };

  function moveSnake() {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      setGameOver(true);
      return;
    }

    const isSelfCollision = newSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);

    if (isSelfCollision) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFoodPosition());
      setScore((prevScore) => prevScore + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(interval);
  }, [direction, snake, gameOver, speed]);

  const handleKeyDown = (e) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        setDirection('UP');
        break;
      case 'ArrowDown':
        setDirection('DOWN');
        break;
      case 'ArrowLeft':
        setDirection('LEFT');
        break;
      case 'ArrowRight':
        setDirection('RIGHT');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div tabIndex="0" style={{ textAlign: 'center' }}>
      <h2>Score: {score}</h2>
      {gameOver ? (
        <div>
          <h3>Game Over</h3>
          <button onClick={handleResetGame}>Reset Game</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 20px)`, margin: '20px auto' }}>
          {Array.from({ length: gridSize * gridSize }).map((_, index) => {
            const position = { x: index % gridSize, y: Math.floor(index / gridSize) };
            const isSnake = snake.some((segment) => segment.x === position.x && segment.y === position.y);
            const isFood = food.x === position.x && food.y === position.y;

            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: isSnake ? 'green' : isFood ? 'red' : 'lightgray',
                  border: '1px solid white',
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
