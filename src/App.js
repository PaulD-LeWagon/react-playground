import logo from "./logo.svg"
import "./App.css"
import Editor from "./editor/Editor"
import Calculator from "./calculator/Calculator"
import TodoList from "./todo/TodoList"
import { default as tasks } from "./todo/tasks"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>
          <img
            src={logo}
            className="header-logo"
            alt="logo"
          />{" "}
          <span className="header-text">My React Playground</span>
        </h2>
      </header>

      <div className="container">
        <TodoList
          name="Latin"
          currentTasks={tasks}
        />
        <Editor />
        <Calculator />
      </div>
    </div>
  )
}

export default App
