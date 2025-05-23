import React, { useReducer, useRef, startTransition } from "react"
import "./TodoList.css"
import "../app-utilities"
import Todo from "./Todo"
import tasksReducer from "./tasksReducer"

let nextId = 0

function TodoList({ name, currentTasks }) {
  const [tasks, dispatch] = useReducer(tasksReducer, currentTasks)
  const addTodoInputRef = useRef(null)
  nextId = nextId >= currentTasks.length ? nextId : currentTasks.length

  const handleAddTodoClick = (e) => {
    startTransition(() => {
      dispatch({
        type: "add_new",
        todo: {
          id: nextId++,
          title: addTodoInputRef.current.value,
          done: false,
        },
      })
      addTodoInputRef.current.value = ""
    })
  }

  // console.count(`Todo List`)

  return (
    <div className="task-list-component">
      <h2 className="title">The {name} Task List</h2>

      <div className="task-list-add-container">
        <input
          ref={addTodoInputRef}
          type="text"
          placeholder="Add a todo?"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTodoClick(e)
          }}
        />
        <button
          className="button is-primary"
          onClick={handleAddTodoClick}>
          Add
        </button>
      </div>

      <ul className="task-list-ul">
        {tasks.map((task, i) => {
          return (
            <li key={task.id}>
              <Todo
                {...task}
                dispatch={dispatch}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TodoList
