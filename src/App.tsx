import { useState, useEffect } from "react"

interface ISnake {
  body: string[];
  heading: string;
}

function App() {
  const initialSnake: ISnake = {
    body: ["4_2"],
    heading: "N"
  }
  const [snake, setSnake] = useState(initialSnake);
  const [playing, setPlaying] = useState(false);
  const [frame, setFrame] = useState(0);
  
  function handleKeyDown(event: KeyboardEvent) {
    if (event.code === "Enter") {
      console.log("Enter :: reset"); 
      setPlaying(false);
      setSnake(initialSnake);
    } else if (event.code === "ArrowLeft") {
      console.log("ArrowLeft :: updateHeading"); 
    } else if (event.code === "ArrowRight") {
      console.log("ArrowRight :: updateHeading"); 
    } else if (event.code === "Space") {
      console.log("Space :: play/pause");
      setPlaying((oldState) => !oldState);
    } else {
      // do nothing
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  useEffect(() => {
    if(playing) {
      console.log(frame);
      setTimeout(() => {
        setFrame(frame => frame + 1 > 2 ? 0 : frame + 1);
      }, 1000/2);
    }
  }, [playing, frame]);

  return (
    <div className="board">
      <Pixels snake={snake} />
    </div>
  )
}

function Pixels({snake}: {snake: ISnake}) {
  return (
    <>
      {
        new Array((4*8)).fill(0).map((item, key) => {
          const index = key + 1;
          const y = Math.ceil(index / 8);
          const x = 8 + index - (y*8);
          
          if (!snake.body.includes(`${x}_${y}`)) {
            return <span key={key} className="pixel"></span>
          } else {
            return <span key={key} className="pixel pixel-active"></span>
          }
        })
      }
    </>
  )
}

export default App
