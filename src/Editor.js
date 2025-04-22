import React, { useState, useEffect, useRef, useCallback } from "react"
import { debounce } from "lodash"

function Editor() {
  // Create UUID for Editor or just a reference to the editor pane.
  const editorPaneRef = useRef()
  const [state, setState] = useState({
    content:
      "The quick brown fox, jumped over the lazy dog. Humpty dumpty sat on a wall...",
    selection: null,
  })
  const [doEdit, setDoEdit] = useState(false)
  const [history, setHistory] = useState([state])
  // const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    console.count("UseEffect")

    // Return now if we have no selection data to set
    if (!state.selection) return
    console.log("Got Selection: ", state.selection)

    const editorPane = editorPaneRef.current || null

    if (editorPane) {
      editorPane.focus()
      const selection = window.getSelection()
      selection.removeAllRanges()

      const startContainerNode = getNodeFromPath(
        state.selection.startContainer,
        editorPane
      )
      const endContainerNode = getNodeFromPath(
        state.selection.endContainer,
        editorPane
      )

      // const startContainerNode = state.selection.startContainer
      // const endContainerNode = state.selection.endContainer

      if (startContainerNode && endContainerNode) {
        try {
          const range = document.createRange()
          range.setStart(startContainerNode, state.selection.startOffset)
          range.setEnd(endContainerNode, state.selection.endOffset)
          selection.addRange(range)
          console.log(`sel: ${selection.toString()}`)
          console.log(`rng: ${range.toString()}`)
        } catch (error) {
          console.error("Error restoring selection:", error)
          // Handle cases where the saved nodes might no longer be valid
          console.warn("Could not find nodes to restore selection.")
          console.warn("Current Seletion Data: ")
          console.warn(state.selection)
          console.warn("Mutating State: Setting Selection Object to NULL")
          state.selection = null
          setState((prevState) => ({ ...prevState, selection: null }))
          console.warn(state.selection)
        }
      } else {
        console.warn("Could not find nodes to restore selection.")
        console.warn("Current Seletion Data: ")
        console.warn(state.selection)
        console.warn("Mutating State: Setting Selection Object to NULL")
        setState((prevState) => ({ prevState, selection: null }))
        console.warn(state.selection)
      }
    }
  })

  // // Helper function to get a unique path to a DOM node within the editor
  // function getNodePath(node, root) {
  //   if (!node || node === root) return []
  //   const path = getNodePath(node.parentNode, root)
  //   const index = Array.from(node.parentNode.childNodes).indexOf(node)
  //   return [...path, index]
  // }

  // // Helper function to get a DOM node from a path
  // function getNodeFromPath(path, root) {
  //   let currentNode = root
  //   for (const index of path) {
  //     if (
  //       currentNode &&
  //       currentNode.childNodes &&
  //       currentNode.childNodes[index]
  //     ) {
  //       currentNode = currentNode.childNodes[index]
  //     } else {
  //       return null
  //     }
  //   }
  //   return currentNode
  // }

  const getNodePath = useCallback((node, root) => {
    if (!node || node === root) {
      return []
    }
    const parent = node.parentNode
    if (!parent) {
      return []
    }

    const index = Array.from(parent.childNodes).findIndex(
      (child) => child === node
    )

    return [...getNodePath(parent, root), index]
  }, [])

  const getNodeFromPath = useCallback((path, root) => {
    let currentNode = root
    if (!currentNode || !path) {
      return null
    }

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
  }, [])

  function getNewSelectionGeometry(editorPane) {
    const selection = window.getSelection()
    // Is there a selection and if so, is it within our basic editor pane?
    if (selection.rangeCount > 0 && editorPane.contains(selection.anchorNode)) {
      // Get the selection range object
      const range = selection.getRangeAt(0)
      // Get the start and end points of the current selection
      const startNode = getNodePath(range.startContainer, editorPane)
      const startOffset = range.startOffset
      const endNode = getNodePath(range.endContainer, editorPane)
      const endOffset = range.endOffset
      // Debug info.
      console.debug("Start Node:", startNode)
      console.debug("Start Offset:", startOffset)
      console.debug("End Node:", endNode)
      console.debug("End Offset:", endOffset)
      // Return new selection object
      return {
        startContainer: startNode,
        startOffset: startOffset,
        endContainer: endNode,
        endOffset: endOffset,
      }
    } else {
      return null
    }
  }

  function contentHasChanged(newContent) {
    if (newContent !== state.content) return true
    else return false
  }

  function selectionGeometryHasChanged(newSelection) {
    for (let key in newSelection) {
      if (state.hasOwnProperty(key) && state[key] !== newSelection[key]) {
        return true
      } else {
        continue
      }
    }
    return false
  }

  function stateHasChanged(theNewState) {
    // Has the content changed?
    const contentChanged = contentHasChanged(theNewState.content)
    // Has the selection geometry changed?
    const selectionChanged = selectionGeometryHasChanged(theNewState.selection)
    return contentChanged || selectionChanged
  }

  function addToHistory(currentState) {
    setHistory([currentState, ...history])
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
    let span
    switch (thisCommand) {
      case "h1":
        return wrapTag("h1", toTextNode(onSelectedText))

      case "h2":
        return wrapTag("h2", toTextNode(onSelectedText))

      case "h3":
        return wrapTag("h3", toTextNode(onSelectedText))

      case "bold":
        return wrapTag("b", toTextNode(onSelectedText))

      case "italic":
        return wrapTag("i", toTextNode(onSelectedText))

      case "underline":
        return wrapTag("u", toTextNode(onSelectedText))

      case "capitalize":
        span = wrapTag("span", toTextNode(onSelectedText))
        span.setAttribute("style", "text-transform:capitalize")
        return span

      case "uppercase":
        span = wrapTag("span", toTextNode(onSelectedText))
        span.setAttribute("style", "text-transform:uppercase")
        return span

      case "lowercase":
        span = wrapTag("span", toTextNode(onSelectedText))
        span.setAttribute("style", "text-transform:lowercase")
        return span

      default:
        console.warn(`${thisCommand} not implemented.`)
        return toTextNode(onSelectedText)
    }
  }

  function mutateSelectedText(event, command) {
    console.count("mutateSelectedText() fired")

    const editorPane = editorPaneRef.current || null
    if (editorPane) {
      const selection = window.getSelection()
      // Is there a selection and if so, is it within our basic editor pane?
      if (
        selection.rangeCount > 0 &&
        editorPane.contains(selection.anchorNode)
      ) {
        const range = selection.getRangeAt(0)
        const selectedText = range.toString()
        if (selectedText) {
          const newTextNode = doExecute(command, selectedText)
          range.deleteContents()
          range.insertNode(newTextNode)
          // Collapse the selection to the end of the inserted text
          // range.collapse(false)
          // selection.removeAllRanges()
          selection.addRange(range)
        }
        // Manually trigger onInput event on the editor pane
        const event = new Event("input", { bubbles: true })
        editorPane.dispatchEvent(event)
      }
    } else {
      throw new Error("Exception: No EditorPane Node to process.")
    }
  }

  function handleEditorPaneInput(event) {
    console.count("handleEditorPaneInput() triggered!")

    const editorPane = event.target || null
    if (editorPane) {
      // editorPane.focus()
      const newState = {
        ...state, // This is redundent at the moment...
        // Get the new content
        content: editorPane.innerHTML,
        // Get the new selection geometry
        selection: getNewSelectionGeometry(editorPane),
      }
      if (stateHasChanged(newState)) {
        // Update history variable with current state.
        addToHistory(state)
        // Update the state variable with new state.
        setState(newState)
      }
    }
  }

  function handleUndo() {
    // console.warn("handleUndo() not implemented.")
    if (history.length) {
      setState(history[0])
      setHistory(history.slice(1))
    }
  }

  console.count("Editor Re-Rendered")

  return (
    <div className="basic-editor">
      <h4>Basic Text Editor Version 1.0</h4>
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
            title="To Title Case!"
            onClick={(e) => {
              mutateSelectedText(e, "capitalize")
            }}>
            C
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
            onClick={(e) => {
              // document.execCommand("bold", false, null)
              mutateSelectedText(e, "bold")
            }}>
            <b>
              <i>B</i>
            </b>
          </button>
          <button
            onClick={(e) => {
              // document.execCommand("italic", false, null)
              mutateSelectedText(e, "italic")
            }}>
            <b>
              <i>i</i>
            </b>
          </button>
          <button
            onClick={(e) => {
              // document.execCommand("underline", false, null)
              mutateSelectedText(e, "underline")
            }}>
            <b>
              <i>
                <u>U</u>
              </i>
            </b>
          </button>

          <button
            title="Undo edit."
            onClick={handleUndo}>
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
        onInput={handleEditorPaneInput}
        contentEditable={true}
        dangerouslySetInnerHTML={{ __html: state.content }}></div>
    </div>
  )
}
export default Editor
