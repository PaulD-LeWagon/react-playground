/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  useState,
  unstable_ViewTransition as ViewTransition,
  startTransition,
} from "react"
import logo from "./logo.svg"
import "./App.css"
import Editor from "./editor/Editor"
import Calculator from "./calculator/Calculator"
import TodoList from "./todo/TodoList"
import { default as tasks } from "./todo/tasks"

function App() {
  const [activeTab, setActiveTab] = useState("todo_list")

  const handleTabClick = (event, tab) => {
    event.preventDefault()
    startTransition(() => {
      setActiveTab(tab)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          <img
            src={logo}
            className="App-logo header-logo"
            alt="logo"
          />{" "}
          <span className="header-text">My React Playground</span>
        </h2>
      </header>

      <main>
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
          </ul>
        </div>

        <ViewTransition
          key="todo_list"
          default="slow-fade">
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
          key="text_editor"
          default="slow-fade">
          <section
            id="text_editor"
            className={activeTab === "text_editor" ? "show" : "hide"}>
            <Editor />
          </section>
        </ViewTransition>

        <ViewTransition
          key="abacus"
          default="slow-fade">
          <section
            id="abacus"
            className={activeTab === "abacus" ? "show" : "hide"}>
            <Calculator />
          </section>
        </ViewTransition>
      </main>

      <footer>
        Devanney, Paul E. -{" "}
        <strong>
          <em>la Digitál Rógue</em>
        </strong>{" "}
        &copy; 2025
      </footer>
    </div>
  )
}

export default App
