const express = require("express")
const { v4 } = require("uuid")

const app = express()

app.use(express.json())

const users = []

function checkExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({ error: "User don't found!" })
  }

  request.user = user

  return next()
}

app.post("/users", (request, response) => {
  const { name, username } = request.body

  const usernameAlreadyExists = users.some(user => user.username === username)

  if(usernameAlreadyExists) {
    return response.status(400).json({ error: "User already exists" })
  }

  const user = {
    id: v4(),
    name,
    username,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
})

app.get("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos)
})

app.post("/todos", checkExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body

  const todo = {
    id: v4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).json(todo)
})

app.put("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { user } = request
  const { title, deadline } = request.body
  const { id } = request.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(indexOfTodo == -1) {
    return response.status(400).json({ error: "Todo don't found!" })
  }

  user.todos[indexOfTodo].title = title
  user.todos[indexOfTodo].deadline = deadline

  return response.send()
})

app.patch("/todos/:id/done", checkExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(indexOfTodo == -1) {
    return response.status(400).json({ error: "Todo don't found!" })
  }

  user.todos[indexOfTodo].done = true

  return response.send()
})

app.delete("/todos/:id", checkExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(indexOfTodo == -1) {
    return response.status(400).json({ error: "Todo don't found!" })
  }

  user.todos.splice(indexOfTodo, 1)

  return response.send()
})

app.listen(3333, () => {
  console.log("Server Running on PORT 3333")
})