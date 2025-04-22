import React, { useRef, useState, useEffect } from "react"

function TextEditor() {
  const editorRef = useRef(null)

  // const [text, setText] = useState("The quick brown fox, jumped of the lazy dog.")
  // const [selectionData, setSelectionData] = useState(null)

  const initialState = {
    content: "The quick brown fox, jumped of the lazy dog.",
    selection: null,
  }

  const [state, setState] = useState(initialState)

  const [compReRenderCounter, setCompReRenderCounter] = useState(0)

  (function anon(cRRC) {
    console.log(cRRC)
  })(compReRenderCounter)

  const [counter, setCounter] = useState(0)

  const [history, setHistory] = useState([initialState])
  const [historyIndex, setHistoryIndex] = useState(0)

  const getCounter = () => {
    setCounter(n => n + 1)
    return counter
  }

  const handleTextChange = (event) => {
    saveToHistory()
    setState({
      ...state,
      content: event.target.innerHTML
    })
  }

  const setStateSelection = (selObj = null) => {
    setState({
      ...state,
      selection: selObj,
    })
  }

  const saveToHistory = () => {
    let cSD = null // Current Selection Data
    const selection = window.getSelection()
    const editor = editorRef.current !== null ? editorRef.current : null

    if (
      selection.rangeCount > 0 &&
      editor &&
      editor.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0)
      cSD = {
        startContainerPath: getNodePath(range.startContainer, editor),
        startOffset: range.startOffset,
        endContainerPath: getNodePath(range.endContainer, editor),
        endOffset: range.endOffset,
      }
    }
    if (cSD && state.selection) {
      const stSel = state.selection
      if (
        cSD.startContainerPath === stSel.startContainerPath &&
        cSD.startOffset === stSel.startOffset &&
        cSD.endContainerPath === stSel.endContainerPath &&
        cSD.endOffset === stSel.endOffset
      ) {
        // No need to change anything (FLWs)...
        setHistory((prevHistory) => [
          ...prevHistory.slice(0, historyIndex + 1),
          state,
        ])
      }
    } else {
      // Different selection coordinates. So, let's save it.
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, historyIndex + 1),
        { content: state.content, selection: cSD },
      ])
    }
    setHistoryIndex((prevIndex) => prevIndex + 1)
    // setSelectionData(null) // Clear for now, useEffect will handle on restore
  }

  const restoreFromHistory = (index) => {
    const editor = editorRef.current
    const newState = history[index]
    setState(newState)
    setHistoryIndex(index)
    // Set selection data to trigger restoration in useEffect
    const selection = window.getSelection()
    if (editor) {
      // Try to set the cursor at the end of the restored text
      const range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false) // Collapse to the end
      selection.removeAllRanges()
      selection.addRange(range)
      // setSelectionData(history[index].selection) // Set the saved selection data
      // setSelectionData({
      //   // Indicate that we want to restore (end of text for now)
      //   startContainerPath: getNodePath(
      //     editorRef.current.lastChild || editorRef.current,
      //     editorRef.current
      //   ),
      //   startOffset: editorRef.current.lastChild
      //     ? editorRef.current.lastChild.textContent.length
      //     : 0,
      //   endContainerPath: getNodePath(
      //     editorRef.current.lastChild || editorRef.current,
      //     editorRef.current
      //   ),
      //   endOffset: editorRef.current.lastChild
      //     ? editorRef.current.lastChild.textContent.length
      //     : 0,
      // })
    } else {
      // setSelectionData(null)
    }
  }

  useEffect(() => {
    const editor = editorRef.current
    if (editor && state.selection) {
      const selection = window.getSelection()
      selection.removeAllRanges()
      const range = document.createRange()

      const startContainerNode = getNodeFromPath(
        state.selection.startContainerPath,
        editorRef.current
      )
      const endContainerNode = getNodeFromPath(
        state.selection.endContainerPath,
        editorRef.current
      )

      console.log("UseEffect", getCounter())
      console.log("startNode", startContainerNode)
      console.log("endNode", endContainerNode)

      if (startContainerNode && endContainerNode) {
        try {
          // console.log("Setting selection range: ")
          range.setStart(startContainerNode, state.selection.startOffset)
          // console.log("Start, OffSet & Node")
          // console.log(state.selection.startOffset, startContainerNode)
          range.setEnd(endContainerNode, state.selection.endOffset)
          // console.log("End, OffSet & Node")
          // console.log(state.selection.endOffset, endContainerNode)
          selection.addRange(range)
        } catch (error) {
          console.error("Error restoring selection:", error)
          setStateSelection()
        }
      } else {
        console.warn("Could not find nodes to restore selection.")
        setStateSelection()
      }
      // Reset selectionData after attempting to restore
      setStateSelection()
    }
  })

  // Helper function to get a unique path to a DOM node within the editor
  const getNodePath = (node, root) => {
    if (!node || node === root) return []
    const path = getNodePath(node.parentNode, root)
    const index = Array.from(node.parentNode.childNodes).indexOf(node)
    return [...path, index]
  }

  // Helper function to get a DOM node from a path
  const getNodeFromPath = (path, root) => {
    let currentNode = root
    if (!currentNode || !path) return null
    for (const index of path) {
      if (
        currentNode &&
        currentNode.childNodes &&
        currentNode.childNodes[index]
      ) {
        currentNode = currentNode.childNodes[index]
      } else {
        return null // Path is invalid
      }
    }
    return currentNode
  }

  return (
    <div style={{ textAlign: "left", padding: "15px" }}>
      <h4>Editor | Re-render counter: ({ compReRenderCounter })</h4>
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleTextChange}
        dangerouslySetInnerHTML={{ __html: state.content }}
        style={{
          border: "1px solid black",
          padding: "10px",
          minHeight: "100px",
        }}
      />
      <button
        style={{ marginTop: "10px" }}
        onClick={saveToHistory}>
        Save Selection
      </button>
      <div>
        <h3>History</h3>
        <ul style={{ listStyleType: "none", margin: "none", padding: "none" }}>
          {history.map((item, index) => (
            <li key={index}>
              <button onClick={() => restoreFromHistory(index)}>
                Version {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default TextEditor
