import React, { useState, useRef, useEffect } from "react"
import "./Todo.css"

function Todo({ id, title, done, dispatch }) {
  const titleRef = useRef(null)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    if (editing && titleRef.current) {
      console.log(titleRef.current)
      titleRef.current.focus()
      // titleRef.current.setSelectionRange(-1, -1)
    }
  })

  const handleClick = (event, action) => {
    switch (action) {
      case "do_edit":
        setEditing(true)
        break
      case "do_save":
        setEditing(false)
        dispatch({
          type: action,
          id: id,
          title: titleRef.current.innerHTML,
        })
        break
      case "do_delete":
        dispatch({
          type: action,
          id: id,
        })
        break
      default:
        console.error(`Error: Unknown action [${action}], el: ${event.target}`)
        break
    }
  }

  const handleOnChange = (event, action) => {
    dispatch({
      type: action,
      id: id,
      done: event.target.checked,
    })
  }

  return (
    <div className="todo">
      <div className="todo-container">
        <input
          type="checkbox"
          name="todo-check"
          className="todo-check checkbox"
          checked={done || false}
          onChange={(e) => {
            handleOnChange(e, "do_done")
          }}
        />

        <h3
          ref={titleRef}
          className="todo-title"
          contentEditable={editing}
          dangerouslySetInnerHTML={{ __html: title || "This is a To-do Item!" }}
          onInput={(e) => {}}></h3>

        <div className="todo-controls">
          <button
            className={
              editing
                ? "todo-save button is-primary"
                : "todo-edit button is-warning"
            }
            onClick={(e) => {
              handleClick(e, editing ? "do_save" : "do_edit")
            }}>
            {editing ? (
              <span class="icon is-small">
                <i class="fa-solid fa-floppy-disk"></i>
              </span>
            ) : (
              <span class="icon is-small">
                <i
                  class="fa-solid fa-pen-to-square"
                  aria-hidden="true"></i>
              </span>
            )}
          </button>

          <button
            className="todo-delete button is-danger"
            onClick={(e) => {
              handleClick(e, "do_delete")
            }}>
            <span class="icon is-small">
              <i class="fa-solid fa-trash-can"></i>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Todo
