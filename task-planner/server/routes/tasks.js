const express = require('express');
const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, status, category, dueDate, priority, reminderDateTime, imageUrl } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  try {
    const task = new Task({
      title,
      description,
      status,
      category,
      priority,
      dueDate,
      reminderDateTime,
      imageUrl,
      user: req.user.id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task.', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const updates = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task.', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task.', error: error.message });
  }
});

module.exports = router;
