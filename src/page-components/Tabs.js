/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useRef,
  useState,
  startTransition,
  unstable_ViewTransition as ViewTransition,
} from "react"
import Editor from "../editor/Editor"
import Calculator from "../calculator/Calculator"
import TodoList from "../todo/TodoList"
import { Button } from "./components"
import { default as tasks } from "../todo/tasks"
import { randInt } from "../app-utilities"

function Tabs({ isActive, onCloseClk, isActive2, onCloseClk2 }) {
  const [activeTab, setActiveTab] = useState("animations") // todo_list
  const [isCentred, setIsCentred] = useState(true)
  const containerRef = useRef(null)
  const [isCentred2, setIsCentred2] = useState(true)
  const containerRef2 = useRef(null)
  const flexDir = ["row", "row-reverse", "column", "column-reverse"]
  const flexAlign = [
    "flex-start",
    "center",
    "space-around",
    "space-between",
    "baseline",
    "flex-end",
  ]

  const containerStyle = {
    justifyContent: isCentred ? "center" : "space-between",
  }
  const handleAnimButtonClick = (event) => {
    // Determine the direction
    const goingToCentre = !isCentred
    if (!document.startViewTransition) {
      setIsCentred(goingToCentre)
      return
    }
    const tvo = document.startViewTransition(() => {
      setIsCentred(goingToCentre)
      // if (containerRef.current) {
      //   containerRef.current.style.setProperty(
      //     "--slide-direction",
      //     // -1 for moving together (left), 1 for moving apart (right)
      //     goingToCentre ? -1 : 1
      //   )
      // }
    })
    console.log(tvo)
  }

  const containerStyle2 = {
    justifyContent: flexAlign[randInt(0, 5)],
    alignItems: flexAlign[randInt(0, 5)],
    flexDirection: flexDir[randInt(0, 3)],
  }
  const handleAnim2ButtonClick = (event) => {
    // Determine the direction
    const goingToCentre2 = !isCentred2
    if (!document.startViewTransition) {
      setIsCentred(goingToCentre2)
      return
    }
    const tvo = document.startViewTransition(() => {
      setIsCentred2(goingToCentre2)
      // if (containerRef2.current) {
      // containerRef2.current.querySelectoryAll(".box").forEach((box) => {
      //   box.style.setProperty("animation-name", "fade-in, spin")
      //   box.style.setProperty("animation-duration", "0.5s")
      //   box.style.setProperty("animation-timing-function", "ease-in")
      // })
      // containerRef2.current.style.setProperty(
      //   "--slide-direction",
      //   // -1 for moving together (left), 1 for moving apart (right)
      //   goingToCentre2 ? -1 : 1
      // )
      // }
    })
    console.log(tvo)
  }

  const handleTabClick = (event, tab) => {
    event.preventDefault()
    startTransition(() => {
      setActiveTab(tab)
    })
  }
  return (
    <>
      <div className="tabs is-large is-right is-boxed">
        <ul>
          <li className={activeTab === "todo_list" ? "is-active" : ""}>
            <a
              onClick={(e) => {
                handleTabClick(e, "todo_list")
              }}>
              <span className="icon is-small">
                <i
                  className="fa-solid fa-list"
                  aria-hidden="true"></i>
              </span>
              <span>Todo List</span>
            </a>
          </li>
          <li className={activeTab === "text_editor" ? "is-active" : ""}>
            <a
              onClick={(e) => {
                handleTabClick(e, "text_editor")
              }}>
              <span className="icon is-small">
                <i
                  className="fa-solid fa-pen-to-square"
                  aria-hidden="true"></i>
              </span>
              <span>Text Editor</span>
            </a>
          </li>
          <li className={activeTab === "abacus" ? "is-active" : ""}>
            <a
              onClick={(e) => {
                handleTabClick(e, "abacus")
              }}>
              <span className="icon is-small">
                <i
                  className="fa-solid fa-calculator"
                  aria-hidden="true"></i>
              </span>
              <span>Calculator</span>
            </a>
          </li>
          <li className={activeTab === "animations" ? "is-active" : ""}>
            <a
              onClick={(e) => {
                handleTabClick(e, "animations")
              }}>
              <span className="icon is-small">
                <i
                  className="fa-solid fa-film"
                  aria-hidden="true"></i>
              </span>
              <span>Animations</span>
            </a>
          </li>
        </ul>
      </div>

      <ViewTransition
        name="todo_list"
        default="slow-fade none">
        <section
          id="todo_list"
          className={activeTab === "todo_list" ? "show" : "hide"}>
          <TodoList
            name="Latin"
            currentTasks={tasks}
          />
        </section>
      </ViewTransition>

      <ViewTransition
        name="text_editor"
        default="slow-fade">
        <section
          id="text_editor"
          className={activeTab === "text_editor" ? "show" : "hide"}>
          <Editor />
        </section>
      </ViewTransition>

      <ViewTransition
        name="abacus"
        default="slow-fade">
        <section
          id="abacus"
          className={activeTab === "abacus" ? "show" : "hide"}>
          <Calculator />
        </section>
      </ViewTransition>

      <ViewTransition
        name="animations"
        default="slow-fade none">
        <section
          id="animations"
          className={activeTab === "animations" ? "show" : "hide"}>
          <div className="animations content">
            <h3>Bulma styled modal windows...</h3>

            <Button
              classList="button is-warning"
              content="View 'Card' Modal?"
              atts={{
                onClick: onCloseClk,
              }}
            />

            &nbsp;

            <Button
              classList="button is-danger"
              content="View 'image' Modal?"
              atts={{
                onClick: onCloseClk2,
              }}
            />
          </div>

          <br />

          <div className="animations content">
            <h3>Switching to the Browser's native View Transition API</h3>
            <p>
              Lorem Ipsum, we don't know what the fuck is going on behind the
              scene...
            </p>
            <button
              className="button is-success"
              onClick={(e) => {
                handleAnimButtonClick(e)
              }}>
              Spin {isCentred ? "Out" : "In"}?
            </button>
            <div
              ref={containerRef}
              className="box-container rvt"
              style={containerStyle}>
              <div className={`red box rvt`} />
              <div className={`green box rvt`} />
              <div className={`blue box rvt`} />
            </div>
          </div>

          <br />

          <div className="animations content">
            <h3>Using the Browser's Native ViewTransition API</h3>
            <p>Notice how this animation does not trigger other animations!?</p>
            <button
              className="button is-success"
              onClick={(e) => {
                handleAnim2ButtonClick(e)
              }}>
              Random Jump?
            </button>

            <div
              ref={containerRef2}
              className="box-container nvt"
              style={containerStyle2}>
              <div className={`red box nvt`} />
              <div className={`green box nvt`} />
              <div className={`blue box nvt`} />
            </div>
          </div>
        </section>
      </ViewTransition>
    </>
  )
}
export default Tabs
