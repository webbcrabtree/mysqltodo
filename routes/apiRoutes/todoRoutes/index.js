const router = require('express').Router();
const connection = require('./../../../db/connection');

const isEven = function (number) {
  return new Promise((resolve, reject) => {
    if (number % 2 === 0) {
      resolve('isEven');
    } else {
      reject('isOdd');
    }
  });
};


// /api/todos
router.get('/', async (req, res) => {
  // Run as much code as we can inside of the try block
  // if any of it throws an error, immediately go into the catch block
  // with the specific error that happened and exit out of the try block
  try {
    const getAllTodos = 'SELECT * FROM todos;';
    const [todos] = await connection.query(getAllTodos);

    res.json(todos);
  } catch (e) {
    console.log(e);
    res.json(e);
  }
});


router.post('/', async (req, res) => {
  const {todo} = req.body;

  if (todo.trim().length === 0) {
    return res.status(400).json({error: 'Todo must be valid'});
  }

  const insertTodoQuery = 'INSERT INTO todos (todo) VALUES(?);';
  const getTodoById = 'SELECT * FROM todos WHERE id = ?;';

  try {
    const [queryResult] = await connection.query(insertTodoQuery, [todo]);
    /* [ { howManyRowsWereInserted, insertId,  }, null]  */
    const [todos] = await connection.query(getTodoById, [queryResult.insertId]);
    res.json(todos[0]);
  } catch (error) {
    res.status(500).json(error);
  }
});



/*
*
fetch(`/api/todos/${todoId}`, {
  method: 'DELETE',
}).then(res => res.json()
.then(deletedTodo => console.log(deletedTodo));

* */

router.delete('/:todoId', async (req, res) => {
  const {todoId} = req.params;

  const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
  const deleteTodoById = 'DELETE FROM todos WHERE id = ?;';
  try {
    const [todos] = await connection.query(getTodoById, todoId);
    if (todos.length === 0) {
      return res.status(404).json({error: 'Todo not found with that id'});
    }
    await connection.query(deleteTodoById, todoId);
    res.json(todos[0]);
  } catch (error) {
    res.status(500).json({error});
  }
});



/*
*
fetch(`/api/todos/${todoId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ todo: 'Run 3 miles'})
}).then(res => res.json()
.then(deletedTodo => console.log(deletedTodo));


* */


router.patch('/:todoId', async (req, res) => {
  const {todo} = req.body;
  const {todoId} = req.params;
  if (todo.trim().length === 0) {
    return res.status(400).json({error: 'Todo must be provided'});
  }
  const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
  const updateTodoById = 'UPDATE todos SET todo = ? WHERE id = ?;';
  try {
    await connection.query(updateTodoById, [todo, todoId]);
    const [todos] = await connection.query(getTodoById, todoId);
    res.json(todos[0]);
  } catch (error) {
    res.status(500).json({error});
  }
});

module.exports = router;