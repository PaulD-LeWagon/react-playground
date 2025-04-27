import logo from "./logo.svg"
import "./App.css"
import Editor from "./editor/Editor"
import Calculator from "./calculator/Calculator"

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

      <div className="container">
        {/* <Editor /> */}
        <Calculator />
      </div>
    </div>
  )
}

export default App
