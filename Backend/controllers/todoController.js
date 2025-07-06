const Todo = require('../models/Todo');

exports.createTodo = async (req, res) => {
  try {
    const { name, type, date, description } = req.body;
    const newTodo = new Todo({
      name,
      type,
      date,
      description,
      completed: false,
      user: req.user._id,
    });
    const savedTodo = await newTodo.save();
    res.status(201).json({ message: 'Task created', todo: savedTodo });
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const { completed, sortBy = 'date', order = 'desc', page = 1, limit = 5 } = req.query;
    const filter = { user: req.user._id };
    if (completed === 'true') filter.completed = true;
    if (completed === 'false') filter.completed = false;

    const sort = {};
    if (sortBy) sort[sortBy] = order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const todos = await Todo.find(filter).sort(sort).skip(skip).limit(parseInt(limit));
    const totalCount = await Todo.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ todos, totalPages });
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ message: 'Server error while fetching todos' });
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { name, type, date, description, completed } = req.body;
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, type, date, description, completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task updated', todo: updated });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
};
