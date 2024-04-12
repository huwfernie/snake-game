import { useState, useEffect, useRef, useCallback } from "react"

interface ISnake {
  body: string[];
  heading: string;
}

interface IFruit {
  x: number;
  y: number;
}

const boardHeight = 48;
const boardWidth = 84;

function App() {
  const initialSnake = useCallback(() => {
    return {
      body: ["42_24", "42_23", "42_22", "42_21", "42_20", "42_19", "42_18", "42_17"],
      heading: "N"
    }
  }, []);

  const snakeRef = useRef(initialSnake());
  const intervalRef = useRef(0);
  const gamePausedRef = useRef(true);
  const gameOverRef = useRef(false);
  const fruitRef = useRef({ x: 84, y: 48 });

  const [snake, setSnake] = useState(initialSnake());

  const generateFruit = useCallback(() => {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }
    const newFruit = { x: getRandomInt(boardWidth), y: getRandomInt(boardHeight) }
    // don't place fruit if it's on the snake
    if (snakeRef.current.body.includes(`${newFruit.x}_${newFruit.y}`)) {
      generateFruit();
    } else {
      fruitRef.current = { x: getRandomInt(boardWidth), y: getRandomInt(boardHeight) }
    }
  }, []);

  const animate = useCallback(() => {
    if (gamePausedRef.current === false) {
      const _snake = snakeRef.current.body;
      const head = _snake[0];
      let x = parseInt(head.split("_")[0]);
      let y = parseInt(head.split("_")[1]);

      // Loose conditions
      const willHitBottom = y === 0 && snakeRef.current.heading === "S";
      const willHitTop = y === boardHeight - 1 && snakeRef.current.heading === "N";
      const willHitLeft = x === 0 && snakeRef.current.heading === "W";
      const willHitRight = x === boardWidth - 1 && snakeRef.current.heading === "E";

      if (willHitBottom || willHitTop || willHitLeft || willHitRight) {
        // console.log("loose condition: don't hit the wall");
        gamePausedRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = 0;
        gameOverRef.current = true;
      } else {
        if (snakeRef.current.heading === "N") { y = y + 1 }
        if (snakeRef.current.heading === "S") { y = y - 1 }
        if (snakeRef.current.heading === "E") { x = x + 1 }
        if (snakeRef.current.heading === "W") { x = x - 1 }

        const newSnakeHead = `${x}_${y}`;

        // IF newSnakeHead exists in snake - loose condition: don't eat yourself
        if (snakeRef.current.body.includes(newSnakeHead)) {
          // console.log("loose condition: don't eat yourself");
          gamePausedRef.current = true;
          clearInterval(intervalRef.current);
          intervalRef.current = 0;
          gameOverRef.current = true;
        }

        _snake.unshift(newSnakeHead);

        // handle eating fruit
        if (fruitRef.current.x === x && fruitRef.current.y === y) {
          generateFruit();
        } else {
          _snake.pop();
        }

        // animate
        setSnake((snake) => {
          return { ...snake, body: _snake }
        });
      }
    }
  }, [generateFruit]);

  useEffect(() => {
    function tick() {
      if (intervalRef.current !== 0) {
        // timer interval already set up, do nothing
      } else {
        intervalRef.current = setInterval(() => {
          animate();
        }, 125);
      }
    }

    function pauseGame() {
      if (gameOverRef.current === false) {
        if (gamePausedRef.current === false) {
          gamePausedRef.current = true;
          clearInterval(intervalRef.current);
          intervalRef.current = 0;
        } else {
          gamePausedRef.current = false;
          tick();
        }
      }
    }

    function resetGame() {
      snakeRef.current = initialSnake();
      gamePausedRef.current = true;
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      gameOverRef.current = false;
      setSnake(initialSnake());
    }

    function handleKeyDown(event: KeyboardEvent) {
      const compass = ["N", "E", "S", "W"];
      if (event.code === "Enter") {
        // console.log("Enter :: reset");
        resetGame();
      } else if (event.code === "ArrowLeft") {
        // console.log("ArrowLeft :: updateHeading");
        if (gamePausedRef.current === false) {
          snakeRef.current = {
            ...snakeRef.current,
            heading: compass[(compass.indexOf(snakeRef.current.heading)) - 1] || "W"
          }
        }
      } else if (event.code === "ArrowRight") {
        // console.log("ArrowRight :: updateHeading");
        if (gamePausedRef.current === false) {
          snakeRef.current = {
            ...snakeRef.current,
            heading: compass[(compass.indexOf(snakeRef.current.heading)) + 1] || "N"
          }
        }
      } else if (event.code === "Space") {
        // console.log("Space :: play/pause");
        pauseGame();
      } else {
        // do nothing
      }
    }

    generateFruit();

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [animate, generateFruit, initialSnake]);

  return (
    <>
      <div className="board">
        <SnakePixels snake={snake} />
        <Fruit x={fruitRef.current.x} y={fruitRef.current.y} />
      </div>
    </>
  )
}

function SnakePixels({ snake }: { snake: ISnake }) {
  return (
    <>
      {
        snake.body.map((item, key) => {
          const [x, y] = item.split("_").map((el) => parseInt(el));
          return <span key={key + item} className="pixel pixel-active" style={{ position: "absolute", bottom: y, left: x }}></span>
        })
      }
    </>
  )
}

function Fruit({ x, y }: IFruit) {
  return <span className="pixel pixel-active pixel-fruit" style={{ position: "absolute", bottom: y, left: x }}></span>
}

export default App
