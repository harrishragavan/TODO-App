const express = require('express');
const router = express.Router();
const SharedTask = require('../models/SharedTask');
const authMiddleware = require('../middleware/authMiddleware');

// Share a task
router.post('/', authMiddleware, async (req, res) => {
  const { name, type, deadline, receiverEmail } = req.body;

  if (!name || !type || !deadline || !receiverEmail) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const sharedTask = new SharedTask({
      name,
      type,
      deadline,
      receiverEmail,
      sender: req.user._id,
    });

    await sharedTask.save();
    res.status(201).json({ message: 'Task shared successfully', task: sharedTask });
  } catch (err) {
    console.error('Share Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shared tasks by user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await SharedTask.find({ sender: req.user._id }).sort({ sharedAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
