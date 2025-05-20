import "./App.css"
import React, { useState, useRef } from "react"

function App() {
  const [isCentred, setIsCentred] = useState(true)
  const containerRef = useRef(null)

  const toggleAlignment = () => {
    if (!document.startViewTransition) {
      setIsCentred(!isCentred)
      return
    }
    document.startViewTransition(() => {
      const goingToCentre = !isCentred
      if (containerRef.current) {
        containerRef.current.style.setProperty(
          "--slide-direction",
          `${goingToCentre ? -1 : 1}%`
        )
      }
      setIsCentred(goingToCentre)
    })
  }

  const containerStyle = {
    justifyContent: isCentred ? "center" : "space-between",
  }

  return (
    <div
      className="App content"
      style={{ width: "350px", margin: "1rem auto" }}>
      <h3>Sliding Boxes, Apparently!</h3>
      <button
        className="button is-success"
        onClick={toggleAlignment}>
        Slide {isCentred ? "Out" : "In"}?
      </button>
      <div
        style={containerStyle}
        className="box-container"
        ref={containerRef}>
        <div className="red box" />
        <div className="green box" />
        <div className="blue box" />
      </div>
    </div>
  )
}
export default App
