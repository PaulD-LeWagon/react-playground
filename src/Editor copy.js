import { useState } from "react"
import { useEffect } from "react"
import { useRef } from "react"

const useMutationObserver = (
  ref,
  callback,
  options = {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
  }
) => {
  useEffect(() => {
    if (ref.current) {
      const observer = new MutationObserver(callback)
      observer.observe(ref.current, options)
      return () => {
        observer.disconnect()
      }
    }
  }, [callback, options])
}

function Editor() {
  const [content, setContent] = useState(
    "The quick brown fox, jumped over the lazy dog."
  )
  const [history, setHistory] = useState([content])
  const [doEdit, setDoEdit] = useState(false)
  const [startNode, setStartNode] = useState(null)
  const [startOffset, setStartOffset] = useState(null)
  const [endNode, setEndNode] = useState(null)
  const [endOffset, setEndOffset] = useState(null)
  const editorPaneRef = useRef()

  useEffect(() => {
    if (editorPaneRef.current) {
      const selection = window.getSelection()
      selection.removeAllRanges()

      // const range = document.createRange()
      // const startContainerNode = getNodeFromPath(
      //   selectionData.startContainerPath,
      //   editorRef.current
      // )
      // const endContainerNode = getNodeFromPath(
      //   selectionData.endContainerPath,
      //   editorRef.current
      // )
      //   if (startContainerNode && endContainerNode) {
      //     try {
      //       range.setStart(startContainerNode, selectionData.startOffset)
      //       range.setEnd(endContainerNode, selectionData.endOffset)
      //       selection.addRange(range)
      //     } catch (error) {
      //       console.error("Error restoring selection:", error)
      //       // Handle cases where the saved nodes might no longer be valid
      //       setSelectionData(null)
      //     }
      //   } else {
      //     console.warn("Could not find nodes to restore selection.")
      //     setSelectionData(null)
      //   }
      if (startNode && endNode) {
        const el = editorPaneRef.current
        console.log(el.className)
        // --- Create the new selection range ---
        const range = document.createRange()
        try {
          range.setStart(startNode, startOffset)
          range.setEnd(endNode, endOffset)
          selection.addRange(range)
        } catch (error) {
          console.error("Error restoring selection:", error)
          console.error("Range: ", range)
        }
      } else {
        console.warn("Could not find nodes to restore selection.")
      }
    }
  })

  function addToHistory(currentState) {
    if (currentState !== history[0]) {
      setHistory([currentState, ...history])
      return true
    } else {
      return false
    }
  }

  function toTextNode(withThisString) {
    return document.createTextNode(withThisString)
  }

  function wrapTag(tagName, content) {
    const wt = document.createElement(tagName)
    wt.appendChild(content)
    return wt
  }

  function doExecute(thisCommand, onSelectedText) {
    switch (thisCommand) {
      case "uppercase":
        return toTextNode(onSelectedText.toUpperCase())

      case "lowercase":
        return toTextNode(onSelectedText.toLowerCase())

      case "h1":
        return wrapTag("h1", toTextNode(onSelectedText))

      case "h2":
        return wrapTag("h2", toTextNode(onSelectedText))

      case "h3":
        return wrapTag("h3", toTextNode(onSelectedText))

      default:
        console.log(`${thisCommand} not implemented.`)
        return toTextNode(onSelectedText)
    }
  }

  function mutateSelectedText(event, command) {
    const editableDiv = event.target
      .closest("div.basic-editor")
      .querySelector(".basic-editor-pane")
    const selection = window.getSelection()
    // Is there a selection and if so, is it within our basic editor pane?
    if (
      selection.rangeCount > 0 &&
      editableDiv.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0)

      const selectedText = range.toString()
      if (selectedText) {
        const newTextNode = doExecute(command, selectedText)
        range.deleteContents()
        range.insertNode(newTextNode)
        // Collapse the selection to the end of the inserted text
        // range.collapse(false);
        // selection.removeAllRanges();
        selection.addRange(range)
      }

      // Get the start and end points of the current selection
      const startNode = range.startContainer
      const startOffset = range.startOffset
      const endNode = range.endContainer
      const endOffset = range.endOffset

      setStartNode(startNode)
      setStartOffset(startOffset)
      setEndNode(endNode)
      setEndOffset(endOffset)

      console.log("Start Node:", startNode)
      console.log("Start Offset:", startOffset)
      console.log("End Node:", endNode)
      console.log("End Offset:", endOffset)
    }
  }

  const options = {
    attributes: false,
    characterData: true,
    childList: true,
    subtree: true,
  }

  function updateEditorPane(observed) {
    const el = editorPaneRef.current
    // console.log(el.innerHTML)
    addToHistory(content)
    setContent(el.innerHTML)
  }

  useMutationObserver(editorPaneRef, updateEditorPane, options)

  return (
    <div className="basic-editor">
      <div className="basic-editor-controls">
        <div className={doEdit ? "show" : "hide"}>
          <button
            onClick={(e) => {
              mutateSelectedText(e, "h1")
            }}>
            h1
          </button>
          <button
            onClick={(e) => {
              mutateSelectedText(e, "h2")
            }}>
            h2
          </button>
          <button
            onClick={(e) => {
              mutateSelectedText(e, "h3")
            }}>
            h3
          </button>

          <button
            onClick={(e) => {
              mutateSelectedText(e, "uppercase")
            }}>
            A
          </button>
          <button
            onClick={(e) => {
              mutateSelectedText(e, "lowercase")
            }}>
            a
          </button>
          <button
            title="To Title Case!"
            onClick={(e) => {
              mutateSelectedText(e, "titlecase")
            }}>
            TC
          </button>
          <button
            title="To sentence case."
            onClick={(e) => {
              mutateSelectedText(e, "sentencecase")
            }}>
            SC
          </button>

          <button
            onClick={(e) => {
              document.execCommand("bold", false, null)
            }}>
            <b>
              <i>B</i>
            </b>
          </button>
          <button
            onClick={(e) => {
              document.execCommand("italic", false, null)
            }}>
            <b>
              <i>i</i>
            </b>
          </button>
          <button
            onClick={(e) => {
              document.execCommand("underline", false, null)
            }}>
            <b>
              <i>
                <u>U</u>
              </i>
            </b>
          </button>

          <button
            title="Undo edit."
            onClick={(e) => {
              if (history.length) {
                setContent(history[0])
                setHistory(history.slice(1))
              }
            }}>
            Undo
          </button>
        </div>
        <button
          onClick={() => {
            setDoEdit(!doEdit)
            // Add to history
            // Persist data with AJAX etc.
          }}>
          {doEdit ? "Save" : "Edit"}
        </button>
      </div>
      <div
        ref={editorPaneRef}
        className="basic-editor-pane"
        contentEditable={doEdit ? true : false}
        dangerouslySetInnerHTML={{ __html: content }}></div>
    </div>
  )
}
export default Editor
