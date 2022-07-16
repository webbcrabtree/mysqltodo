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

router.get('/', async (req, res) => {
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
    const { todo } = req.body;

    if (todo.trim().length === 0) {
        return res.status(400).json({ error: 'Todo must be valid' });
    }

    const insertTodoQuery = 'INSERT INTO todos (todo) VALUES(?);';
    const getTodoById = 'SELECT * FROM todos WHERE id = ?;';

    try {
        const [queryResult] = await connection.query(insertTodoQuery, [todo]);

        const [todos] = await connection.query(getTodoById, [queryResult.insertId]);

        res.json(todos[0]);
    } catch (error) {
        res.status(500).json(error);
    }

});

router.delete('./:todoId', async (req, res) => {
    const { todoId } = req.params;
    const getTodoById = 'SELECT * FROM todos WHERE id = ?;';
    const deleteTodoById = 'DELETE FROM todos WHERE id = ?;';
    
    try {
        const result = await connection.query(deleteTodoById, todoId);
        if (todos.length === 0) {
            return res.status(404).json({error: 'Todo with that id not found'});
        }
        await connection.query(deleteTodoById, todoId);
        res.json(todos[0]);
    
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.put('./:todoId', async (req, res) => {
    const {todo} = req.body;
    const {todoId} = req.params;
    if (todo.trim().length === 0) {
        return res.status(400).json({eror: 'Todo must be provided'});
    }
    const updateTodoById = 'UPDATE todos SET todo = ? WHERE id = ?;';
    try {
        const result = await connection.query(updateTodoById, [todo, todoId]);
        console.log(result);
        res.json(result);
    } catch (error) {
        res.status(500).json({error});
    }
});

module.exports = router;