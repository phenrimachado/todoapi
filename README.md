# Todo API

## 😊 Why?

This project was the first challenge on Rocketseat's NodeJS track. Created with NodeJS and using the Express framework for requests, the challenge was to create an API with Todo CRUD, using middleware to control business rules.

## Build the project

Clone de project

```$ git clone https://github.com/phenrimachado/todoapi.git```

Install all dependecies with npm:

```$ npm install ```

or with yarn:

```$ yarn```

To run the server:

```$ npm run dev```

or:

```$ yarn dev```

## Documentation

### To create Todos, first you need to create your user on the URL with Post method:

POST ```http://localhost:3333/users``` with JSON on body, like that:

```javascript
{
  "name": "Pedro Machado",
  "username": "machado"
}
```

### 🚩After this, all requests must have your username placed on headers of request.

### To create a new Todo

POST ```http://localhost:3333/todos``` and set "username" as "machado" on headers of you request and set information of todo on body:

```javascript
{
  "title": "Celebrate Christmas",
  "deadline": "2021-12-25"
}
```

### To get all Todo of user set on headers

GET ```http://localhost:3333/todos``` 

### To change title or deadline of a especific Todo

PUT ```http://localhost:3333/todos/:id_of_todo``` send the id of the todo you want to change the information

```javascript
{
  "title": "Celebrate Christmas with all family",
  "deadline": "2021-12-24"
}
```

### To mark a todo as done 

PATCH ```http://localhost:3333/todos/:id_of_todo/done``` send the id of the todo you want to mark as done

### Delete a todo

DELETE ```http://localhost:3333/todos/:id_of_todo``` send the id of the todo you want to delete
