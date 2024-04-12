import { useState, useEffect } from "react"

interface ISnake {
  body: string[];
  heading: string;
  started: boolean;
  paused: boolean;
}

const fortyEight = 48;
const eightyFour = 84;

function App() {
  const initialSnake: ISnake = {
    body: [`${eightyFour / 2}_${fortyEight / 2}`],
    heading: "N",
    started: false,
    paused: false,
  }
  const [snake, setSnake] = useState(initialSnake);
  const [frame, setFrame] = useState(0);

  
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === "Enter") {
        console.log("Enter :: reset");
        setSnake(initialSnake);
      } else if (event.code === "ArrowLeft") {
        console.log("ArrowLeft :: updateHeading");
        setSnake((snake) => {
          if (snake.started) {
            return { ...snake, heading: ["N", "E", "S", "W"][(["N", "E", "S", "W"].indexOf(snake.heading)) - 1] || "W" }
          } else {
            return snake;
          }
        });
      } else if (event.code === "ArrowRight") {
        console.log("ArrowRight :: updateHeading");
        setSnake((snake) => {
          if (snake.started) {
            return { ...snake, heading: ["N", "E", "S", "W"][(["N", "E", "S", "W"].indexOf(snake.heading)) + 1] || "N" }
          } else {
            return snake;
          }
        });
      } else if (event.code === "Space") {
        console.log("Space :: play/pause");
        setSnake((snake) => {
          return {
            ...snake,
            paused: !snake.paused,
            started: true
          }
        });
      } else {
        // do nothing
      }
    }
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  useEffect(() => {    
    if (snake.started) {
      // 1. check direction and add new "head" to snake
      // 2. check for wall collision
      // 3. check for snake collision
      // 4. remove tail from snake
      const _snake = snake.body;
      const head = _snake[0];
      let x = parseInt(head.split("_")[0]);
      let y = parseInt(head.split("_")[1]);

      // Loose conditions
      if (
        x === 0 ||
        x === eightyFour ||
        y === 0 ||
        y === fortyEight
      ) {
        alert("loose");
        setSnake(initialSnake);
      } else {
        if (snake.heading === "N") { y = y + 1 }
        if (snake.heading === "S") { y = y - 1 }
        if (snake.heading === "E") { x = x + 1 }
        if (snake.heading === "W") { x = x - 1 }

        const newSnakeHead = `${x}_${y}`;
        _snake.unshift(newSnakeHead);
        _snake.pop();

        // animate
        setSnake((snake) => { return { ...snake, body: _snake } });

        // @TODO - could update this to reference the last updated time in order to maintain regular update rate if thread is blocked
        setTimeout(() => {
          setFrame(frame => frame + 1 > 2 ? 0 : frame + 1);
        }, 1000 / 8);

      }


    }
  }, [snake, frame, initialSnake]);

  return (
    <div className="board">
      <Pixels snake={snake} />
    </div>
  )
}

function Pixels({ snake }: { snake: ISnake }) {
  return (
    <>
      {
        new Array((fortyEight * eightyFour)).fill(0).map((item, key) => {
          const index = key + 1;
          const _y = Math.ceil(index / eightyFour);
          const y = (fortyEight + 1) - Math.ceil(index / eightyFour);
          const x = eightyFour + index - (_y * eightyFour);

          if (!snake.body.includes(`${x}_${y}`)) {
            return <span key={key} className="pixel" id={`${x}_${y}`}></span>
          } else {
            return <span key={key} className="pixel pixel-active" id={`${x}_${y}`}></span>
          }
        })
      }
    </>
  )
}

export default App
