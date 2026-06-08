import { useState, useEffect } from 'react';
import { tasksAPI, uploadAPI } from './api';

export default function TaskForm({ onTaskCreated, editingTask = null, onEditComplete = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category: 'general',
    priority: 'normal',
    dueDate: '',
    reminderDate: '',
    reminderTime: '',
    imageUrl: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      const due = editingTask.dueDate ? new Date(editingTask.dueDate).toISOString().split('T')[0] : '';
      const reminder = editingTask.reminderDateTime ? new Date(editingTask.reminderDateTime).toISOString().split('T') : ['', ''];

      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
        category: editingTask.category,
        priority: editingTask.priority || 'normal',
        dueDate: due,
        reminderDate: reminder[0],
        reminderTime: reminder[1]?.slice(0, 5) || '',
        imageUrl: editingTask.imageUrl || '',
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        reminderDateTime:
          formData.reminderDate && formData.reminderTime
            ? new Date(`${formData.reminderDate}T${formData.reminderTime}`)
            : undefined,
        imageUrl: formData.imageUrl || undefined,
      };

      if (imageFile) {
        const uploadResponse = await uploadAPI.uploadImage(imageFile);
        payload.imageUrl = uploadResponse.data.imageUrl;
      }

      if (editingTask) {
        await tasksAPI.updateTask(editingTask._id, payload);
        onEditComplete?.();
      } else {
        await tasksAPI.createTask(payload);
      }

      setFormData({
        title: '',
        description: '',
        status: 'pending',
        category: 'general',
        priority: 'normal',
        dueDate: '',
        reminderDate: '',
        reminderTime: '',
        imageUrl: '',
      });
      setImageFile(null);
      onTaskCreated?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-700 glass p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2 text-white">{editingTask ? 'Edit Task' : 'Create Task'}</h2>
      <p className="text-sm text-slate-400 mb-4">Quickly add tasks and set reminders.</p>
      {error && <div className="mb-4 p-3 rounded-lg bg-red-900/30 text-red-400 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-2xl bg-transparent border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          required
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-3 rounded-2xl bg-transparent border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />

        <div className="grid gap-3 md:grid-cols-3">
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          >
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="urgent">Urgent</option>
          </select>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          >
            <option value="low">Low priority</option>
            <option value="normal">Normal</option>
            <option value="high">High priority</option>
          </select>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          />
          <input
            type="time"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          />
          <input
            type="date"
            name="reminderDate"
            value={formData.reminderDate}
            onChange={handleChange}
            className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-sky-500"
          />
        </div>

        <label className="block text-sm font-medium text-slate-300">
          Upload image (optional)
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 w-full text-sm text-slate-200 file:mr-4 file:rounded-full file:border-0 file:bg-slate-700 file:px-4 file:text-slate-100 hover:opacity-95"
          />
        </label>

        {formData.imageUrl && !imageFile && (
          <img src={formData.imageUrl} alt="Task" className="h-40 w-full rounded-3xl object-cover border border-slate-700" />
        )}

        {imageFile && (
          <p className="text-sm text-slate-400">Selected file: {imageFile.name}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : editingTask ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
