const express = require("express")
const cors = require("cors")
const { v4, validate } = require("uuid")

const app = express()

app.use(cors())
app.use(express.json())

const users = []

function findUserById(request, response, next) {
  const { id: userId } = request.params

  const user = users.find(user => user.id === userId)

  if(!user) {
    return response.status(404).json({ error: "User don't exists!" })
  }

  request.user = user

  return next()
}

function checksTodoExists(request, response, next) {
  const { username } = request.headers
  const { id: todoId } = request.params

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({ error: "User don't found!" })
  }

  if(!validate(todoId)) {
    return response.status(400).json({ error: "Id of todo don't is a uuid!" })
  }

  const todo = user.todos.find(todo => todo.id === todoId)

  if(!todo) {
    return response.status(404).json({ error: "Todo don't found!" })
  }

  request.user = user
  request.todo = todo

  return next()
}

function checksCreateTodosUserAvailability(request, response, next) {
  const { user } = request

  if(user.pro) {
    return next()
  } else if(!user.pro) {
    const todosCount = user.todos.length + 1

    if(todosCount <= 10) {
      return next()
    } else {
      return response.status(403).json({ error: "You need to upgrade your plan to create more than ten todos." })
    }
  }
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(user => user.username === username)

  if(!user) {
    return response.status(404).json({ error: "User don't found!" })
  }

  request.user = user

  return next()
}

app.get("/users/:id", findUserById, (request, response) => {
  const { user } = request

  return response.json(user)
})

app.patch("/users/:id/pro", findUserById, (request, response) => {
  const { user } = request

  if(user.pro) {
    return response.status(400).json({ error: "Pro plan is already activated!" });
  }

  user.pro = true

  return response.json(user)
})

app.post("/users", (request, response) => {
  const { name, username, pro } = request.body

  const usernameAlreadyExists = users.some(user => user.username === username)

  if(usernameAlreadyExists) {
    return response.status(400).json({ error: "User already exists" })
  }

  const user = {
    id: v4(),
    name,
    username,
    pro: pro === true ? true : false,
    todos: []
  }

  users.push(user)

  return response.status(201).json(user)
})

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request

  return response.json(user.todos)
})

app.post("/todos", checksExistsUserAccount, checksCreateTodosUserAvailability, (request, response) => {
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

app.put("/todos/:id", checksTodoExists, (request, response) => {
  const { user, todo } = request
  const { title, deadline } = request.body

  title ? todo.title = title : false
  deadline ? todo.deadline = deadline : false

  return response.json(todo)
})

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request
  const { id } = request.params

  const indexOfTodo = user.todos.findIndex(todo => todo.id === id)

  if(indexOfTodo == -1) {
    return response.status(404).json({ error: "Todo don't found!" })
  }

  user.todos[indexOfTodo].done = true

  return response.json(user.todos[indexOfTodo])
})

app.delete("/todos/:id", checksTodoExists, (request, response) => {
  const { user, todo: todoSended } = request

  const indexOfTodoToDelete = user.todos.findIndex(todo => todo.id === todoSended.id)

  user.todos.splice(indexOfTodoToDelete, 1)

  return response.status(204).send()
})

module.exports = {
  app,
  users,
  checksExistsUserAccount,
  checksCreateTodosUserAvailability,
  checksTodoExists,
  findUserById
}