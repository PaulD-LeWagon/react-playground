function tasksReducer(tasks, action) {
  let newTask = {}
  switch (action.type) {
    case "add_new": {
      return [...tasks, action.todo]
    }
    case "do_done": {
      return tasks.map((task, i) => {
        if (task.id === action.id) {
          Object.assign(newTask, task, { done: action.done })
          return newTask
        } else {
          return task
        }
      })
    }
    case "do_save": {
      return tasks.map((task, i) => {
        if (task.id === action.id) {
          Object.assign(newTask, task, { title: action.title, description: action.description })
          return newTask
        } else {
          return task
        }
      })
    }
    case "do_delete": {
      return tasks.filter((task) => task.id !== action.id)
    }
    default:
      console.error(`Error: Unknown action [${action.type}]`)
      break
  }
}

export default tasksReducer
