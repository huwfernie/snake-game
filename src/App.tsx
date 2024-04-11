import { useState, useEffect } from "react"

interface ISnake {
  body: string[];
  heading: string;
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.code === "Enter") {
    console.log("Enter"); 
  } else if (event.code === "ArrowLeft") {
    console.log("ArrowLeft"); 
  } else if (event.code === "ArrowRight") {
    console.log("ArrowRight"); 
  } else if (event.code === "Space") {
    console.log("Space"); 
  } else {
    // do nothing
  }
}


function App() {
  const [snake] = useState({
    body: ["4_2"],
    heading: "N"
  });


  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

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
