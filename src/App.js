import logo from "./logo.svg"
import "./App.css"
import Editor from "./Editor"
import "./Editor.css"
import TextEditor from "./TextEditor"

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
          <span className="header-text">My Basic Editor</span>
        </h2>
      </header>

      <Editor />

    </div>
  )
}

export default App
