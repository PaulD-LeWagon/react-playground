import React, {
  useState,
  useRef,
  useEffect,
  startTransition,
  unstable_ViewTransition as ViewTransition,
} from "react"
import "./Todo.css"

function Todo({ id, title, description, done, dispatch }) {
  const titleRef = useRef(null)
  const descRef = useRef(null)
  const [editing, setEditing] = useState(false)
  const [openDesc, setOpenDesc] = useState(false)

  useEffect(() => {
    if (editing && titleRef.current) {
      titleRef.current.focus()
      // titleRef.current.setSelectionRange(-1, -1)
    }
  })

  const handleClick = (event, action) => {
    switch (action) {
      case "do_edit":
        setEditing(true)
        if (!openDesc) setOpenDesc(!openDesc)
        break
      case "do_save":
        setEditing(false)
        if (openDesc) setOpenDesc(!openDesc)
        dispatch({
          type: action,
          id: id,
          title: titleRef.current.innerHTML,
          description: descRef.current.innerHTML,
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

  // console.count(`Todo (${id})`)

  return (
    <ViewTransition name={`todo-task-${id}`}>
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
            dangerouslySetInnerHTML={{
              __html: `${title || "This is a To-do Item!"}`,
            }}
            onInput={(e) => {}}
            onKeyDown={(e) => {
              if (e.key === "Enter")
                startTransition(() => {
                  handleClick(e, "do_save")
                })
            }}></h3>

          <div className="todo-controls">
            <button
              className={`button is-info`}
              onClick={() => {
                startTransition(() => {
                  setOpenDesc(!openDesc)
                })
              }}>
              <span className="icon is-small">
                {openDesc ? (
                  <i className="fa-solid fa-circle-chevron-up"></i>
                ) : (
                  <i className="fa-solid fa-circle-chevron-down"></i>
                )}
              </span>
            </button>

            <button
              className={
                editing
                  ? "todo-save button is-primary"
                  : "todo-edit button is-warning"
              }
              onClick={(e) => {
                startTransition(() => {
                  handleClick(e, editing ? "do_save" : "do_edit")
                })
              }}>
              <span className="icon is-small">
                <i
                  className={`fa-solid ${
                    editing ? "fa-floppy-disk" : "fa-pen-to-square"
                  }`}></i>
              </span>
            </button>

            <button
              className="todo-delete button is-danger"
              onClick={(e) => {
                startTransition(() => {
                  handleClick(e, "do_delete")
                })
              }}>
              <span className="icon is-small">
                <i className="fa-solid fa-trash-can"></i>
              </span>
            </button>
          </div>

          <div className="todo-dummy-spacer" />

          <ViewTransition
            name={`todo-${id}-desc`}
            default="slow-fade">
            <p
              ref={descRef}
              className={`todo-description ${openDesc ? "show" : "hide"}`}
              contentEditable={editing}
              dangerouslySetInnerHTML={{
                __html: `${
                  description ||
                  "Where we're going we don't need no description!"
                }`,
              }}
              onInput={(e) => {}}></p>
          </ViewTransition>
        </div>
      </div>
    </ViewTransition>
  )
}

export default Todo
