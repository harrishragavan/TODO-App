const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const SharedTask = require('../models/SharedTask');
const nodemailer = require('nodemailer');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, type, deadline, receiverEmail } = req.body;

    const newSharedTask = new SharedTask({
      name,
      type,
      deadline,
      receiverEmail,
      senderId: req.user._id,
    });

    await newSharedTask.save();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,        // Your Gmail
        pass: process.env.EMAIL_PASS,        // App password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiverEmail,
      subject: `You have a new shared task from ${req.user.username || 'Task App User'}`,
      html: `
        <h3>New Task Shared With You</h3>
        <p><strong>Task Name:</strong> ${name}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Deadline:</strong> ${new Date(deadline).toLocaleDateString()}</p>
        <p>Check the app to see the task!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Task shared and email sent!' });
  } catch (error) {
    console.error('Error sharing task:', error);
    res.status(500).json({ message: 'Server error while sharing task' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const sharedTasks = await SharedTask.find({ senderId: req.user._id }).sort({ createdAt: -1 });
    res.json(sharedTasks);
  } catch (err) {
    console.error('Fetch shared tasks error:', err);
    res.status(500).json({ message: 'Failed to fetch shared tasks' });
  }
});

module.exports = router;
