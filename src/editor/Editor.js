import React, { useState, useEffect, useRef, useCallback } from "react"
import _ from "lodash"
// import { debounce } from "lodash"

function Editor() {
  // Create UUID for Editor or just a reference to the editor pane.
  const editorPaneRef = useRef()
  const [state, setState] = useState({
    content: `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore
        magnam aliquam quaerat voluptatem. Ut enim aeque doleamus
        animo, cum corpore dolemus, fieri tamen permagna accessio
        potest, si aliquod aeternum et infinitum impendere malum
        nobis opinemur.
      `.trim(),
    selection: null,
  })
  const [doEdit, setDoEdit] = useState(false)
  const [history, setHistory] = useState([state])
  // const [historyIndex, setHistoryIndex] = useState(0)

  const isDisabled = history.length <= 1

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

  const resetSelection = useCallback(() => {
    // Return now if we have no selection data to set
    if (!state.selection) return
    // Okay, let's get this show on the road...
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

      if (startContainerNode && endContainerNode) {
        try {
          const range = document.createRange()
          range.setStart(startContainerNode, state.selection.startOffset)
          range.setEnd(endContainerNode, state.selection.endOffset)
          selection.addRange(range)
          return true
        } catch (error) {
          console.error("Error restoring selection:", error)
          // Handle cases where the saved nodes might no longer be valid
          console.warn("Mutating State: Setting Selection Object to NULL")
          setState((prevState) => ({ ...prevState, selection: null }))
          return false
        }
      } else {
        console.warn("Could not find nodes to restore selection.")
        console.warn("Mutating State: Setting Selection Object to NULL")
        setState((prevState) => ({ prevState, selection: null }))
        return false
      }
    } else {
      throw Error(
        "Exception: Cannot restore selection. No editorPane to process."
      )
    }
  }, [state, getNodeFromPath])

  const getNewSelectionGeometry = useCallback(
    (editorPane) => {
      const selection = window.getSelection()
      // Is there a selection and if so, is it within our basic editor pane?
      if (
        selection.rangeCount > 0 &&
        editorPane.contains(selection.anchorNode)
      ) {
        // Get the selection range object
        const range = selection.getRangeAt(0)
        // Get the start and end points of the current selection
        const startNode = getNodePath(range.startContainer, editorPane)
        const startOffset = range.startOffset
        const endNode = getNodePath(range.endContainer, editorPane)
        const endOffset = range.endOffset
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
    },
    [getNodePath]
  )

  const contentHasChanged = useCallback(
    (newContent) => {
      if (newContent !== state.content) return true
      else return false
    },
    [state]
  )

  const selectionGeometryHasChanged = useCallback(
    (newSelection) => {
      for (let key in newSelection) {
        if (state.hasOwnProperty(key) && state[key] !== newSelection[key]) {
          return true
        } else {
          continue
        }
      }
      return false
    },
    [state]
  )

  const stateHasChanged = useCallback(
    (theNewState) => {
      // Has the content changed?
      const contentChanged = contentHasChanged(theNewState.content)
      // Has the selection geometry changed?
      const selectionChanged = selectionGeometryHasChanged(
        theNewState.selection
      )
      return contentChanged || selectionChanged
    },
    [contentHasChanged, selectionGeometryHasChanged]
  )

  const addToHistory = useCallback(
    (currentState) => {
      setHistory([currentState, ...history])
    },
    [history]
  )

  function toTextNode(withThisString) {
    return document.createTextNode(withThisString)
  }

  const wrapTag = (tagName, content, attr = {}) => {
    const doc = document
    const tag = doc.createElement(tagName)
    if (content instanceof Node && content instanceof Text) {
      tag.appendChild(content)
    } else if (typeof content === "string") {
      tag.innerHTML = content
    }
    for (const [key, value] of Object.entries(attr)) {
      tag.setAttribute(key, value)
    }
    return tag
  }

  function doExecute(thisCommand, onSelectedText) {
    switch (thisCommand) {
      case "h1":
        return wrapTag("h1", onSelectedText)

      case "h2":
        return wrapTag("h2", onSelectedText)

      case "h3":
        return wrapTag("h3", onSelectedText)

      case "h4":
        return wrapTag("h4", onSelectedText)

      case "h5":
        return wrapTag("h5", onSelectedText)

      case "bold":
        return wrapTag("b", onSelectedText)

      case "italic":
        return wrapTag("i", onSelectedText)

      case "underline":
        return wrapTag("u", onSelectedText)

      case "capitalize":
        return wrapTag("span", onSelectedText, {
          style: "text-transform:capitalize",
        })

      case "uppercase":
        return wrapTag("span", onSelectedText, {
          style: "text-transform:uppercase",
        })

      case "lowercase":
        return wrapTag("span", onSelectedText, {
          style: "text-transform:lowercase",
        })

      default:
        console.warn(`${thisCommand} not implemented.`)
        return toTextNode(onSelectedText)
    }
  }

  function mutateSelectedText(event, command) {
    // console.count("mutateSelectedText() fired")

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

  const handleEditorPaneInput = useCallback(
    (event) => {
      // console.count("handleEditorPaneInput() triggered!")

      const editorPane = event.target || null
      if (editorPane) {
        const newState = {
          // ...state, // This is redundent at the moment...
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
    },
    [state, getNewSelectionGeometry, stateHasChanged, addToHistory, setState]
  )

  const handleUndo = useCallback(
    (event) => {
      // console.warn("handleUndo() not implemented.")
      if (history.length) {
        setState(history[0])
        setHistory(history.slice(1))
      }
    },
    [history, setState, setHistory]
  )

  useEffect(() => {
    // console.count("UseEffect")
    resetSelection()
  }, [resetSelection])

  // const myCurryFunc = (a) => (b) => (c) => `${a} ${b} ${c}`
  // console.log(myCurryFunc('This')('is a')('test!'))
  // console.count("Editor Re-Rendered")

  return (
    <div className="basic-editor">
      <h4>Basic Text Editor Version 1.0</h4>
      <div className="basic-editor-controls">
        <div className={doEdit ? "show" : "hide"}>
          <button
            title="H1 Title"
            onClick={(e) => {
              mutateSelectedText(e, "h1")
            }}>
            h1
          </button>
          <button
            title="H2 Title"
            onClick={(e) => {
              mutateSelectedText(e, "h2")
            }}>
            h2
          </button>
          <button
            title="H3 Title"
            onClick={(e) => {
              mutateSelectedText(e, "h3")
            }}>
            h3
          </button>
          <button
            title="H4 Title"
            onClick={(e) => {
              mutateSelectedText(e, "h4")
            }}>
            h4
          </button>
          <button
            title="H5 Title"
            onClick={(e) => {
              mutateSelectedText(e, "h5")
            }}>
            h5
          </button>

          <button
            title="Title Case (Capitalise)"
            onClick={(e) => {
              mutateSelectedText(e, "capitalize")
            }}>
            C
          </button>
          <button
            title="To UPPERCASE"
            onClick={(e) => {
              mutateSelectedText(e, "uppercase")
            }}>
            A
          </button>
          <button
            title="To lowercase"
            onClick={(e) => {
              mutateSelectedText(e, "lowercase")
            }}>
            a
          </button>

          <button
            title="Bold face"
            onClick={(e) => {
              mutateSelectedText(e, "bold")
            }}>
            <b>
              <i>B</i>
            </b>
          </button>
          <button
            title="Italicise selection"
            onClick={(e) => {
              mutateSelectedText(e, "italic")
            }}>
            <b>
              <i>i</i>
            </b>
          </button>
          <button
            title="Underline selection"
            onClick={(e) => {
              mutateSelectedText(e, "underline")
            }}>
            <b>
              <i>
                <u>U</u>
              </i>
            </b>
          </button>

          <button
            title="Undo last edit"
            onClick={handleUndo}
            disabled={isDisabled}>
            Undo
          </button>
        </div>
        <button
          title={doEdit ? "Save current edits?" : "Edit this text?"}
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
        contentEditable={doEdit ? true : false}
        dangerouslySetInnerHTML={{ __html: state.content }}></div>
    </div>
  )
}
export default Editor
