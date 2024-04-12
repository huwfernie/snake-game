import { useState, useEffect, useRef, useCallback } from "react"

interface ISnake {
  body: string[];
  heading: string;
}

const boardHeight = 48;
const boardWidth = 84;

function App() {
  const initialSnake: ISnake = {
    body: ["42_24"],
    heading: "N"
  }

  const snakeRef = useRef(initialSnake);
  const intervalRef = useRef(0);
  const gamePausedRef = useRef(true);

  const [snake, setSnake] = useState(initialSnake);
  const [fruit, setFruit] = useState({ x: 84, y: 48 });

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
        console.log("loose");
        gamePausedRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = 0;
      } else {
        if (snakeRef.current.heading === "N") { y = y + 1 }
        if (snakeRef.current.heading === "S") { y = y - 1 }
        if (snakeRef.current.heading === "E") { x = x + 1 }
        if (snakeRef.current.heading === "W") { x = x - 1 }

        const newSnakeHead = `${x}_${y}`;
        _snake.unshift(newSnakeHead);
        _snake.pop();

        // animate
        setSnake((snake) => {
          return { ...snake, body: _snake }
        });
      }
    }
  }, []);

  const generateFruit = useCallback(() => {
    function getRandomInt(max: number) {
      return Math.floor(Math.random() * max);
    }
    const newFruit = { x: getRandomInt(boardWidth), y: getRandomInt(boardHeight)}
    // don't place fruit if it's on the snake
    if (snakeRef.current.body.includes(`${newFruit.x}_${newFruit.y}`)) {
      generateFruit();
    } else {
      setFruit({ x: getRandomInt(boardWidth), y: getRandomInt(boardHeight)})
    }
  }, []);

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
      if (gamePausedRef.current === false) {
        gamePausedRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = 0;
      } else {
        gamePausedRef.current = false;
        tick();
      }
    }

    function resetGame() {
      snakeRef.current = {
        body: ["42_24"],
        heading: "N"
      };
      gamePausedRef.current = true;
      clearInterval(intervalRef.current);
      intervalRef.current = 0;
      setSnake(snakeRef.current);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Enter") {
        // console.log("Enter :: reset");
        resetGame();
      } else if (event.code === "ArrowLeft") {
        // console.log("ArrowLeft :: updateHeading");
        if (gamePausedRef.current === false) {
          snakeRef.current = {
            ...snakeRef.current,
            heading: ["N", "E", "S", "W"][(["N", "E", "S", "W"].indexOf(snakeRef.current.heading)) - 1] || "W"
          }
        }
      } else if (event.code === "ArrowRight") {
        // console.log("ArrowRight :: updateHeading");
        if (gamePausedRef.current === false) {
          snakeRef.current = {
            ...snakeRef.current,
            heading: ["N", "E", "S", "W"][(["N", "E", "S", "W"].indexOf(snakeRef.current.heading)) + 1] || "N"
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
  }, [animate, generateFruit]);

  return (
    <>
      <div className="board">
        <Pixels snake={snake} />
        <Fruit x={fruit.x} y={fruit.y} />
      </div>
      <div>Snake: {JSON.stringify(snake)}</div>
      <div>Snake: {JSON.stringify(initialSnake)}</div>
      <div>Snake: {JSON.stringify(snakeRef.current)}</div>
    </>
  )
}

function Pixels({ snake }: { snake: ISnake }) {
  return (
    <>
      {
        snake.body.map((item, key) => {
          const [x, y] = item.split("_").map((el) => parseInt(el));
          return <span key={key + item} className="pixel pixel-active" id={`${x}_${y}`} style={{ position: "absolute", bottom: y, left: x }}></span>
        })
      }
    </>
  )
}

function Fruit({ x, y }: {x: number, y: number }) {
  return <span className="pixel pixel-active pixel-fruit" style={{ position: "absolute", bottom: y, left: x }}></span>
}

export default App
