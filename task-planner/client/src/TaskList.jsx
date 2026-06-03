import { tasksAPI } from './api';

export default function TaskList({ tasks, onTaskDeleted, onTaskEdit }) {
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await tasksAPI.deleteTask(taskId);
      onTaskDeleted?.();
    } catch (err) {
      alert('Failed to delete task.');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-900/30 text-yellow-400',
    'in-progress': 'bg-blue-900/30 text-blue-400',
    completed: 'bg-green-900/30 text-green-400',
  };

  const categoryColors = {
    work: 'bg-purple-900/30 text-purple-400',
    personal: 'bg-pink-900/30 text-pink-400',
    urgent: 'bg-red-900/30 text-red-400',
    general: 'bg-slate-700 text-slate-300',
  };

  const priorityColors = {
    low: 'bg-emerald-900/30 text-emerald-400',
    normal: 'bg-slate-700 text-slate-300',
    high: 'bg-red-900/30 text-red-400',
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-8 text-center">
          <p className="text-slate-400">No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="rounded-3xl border border-slate-700 bg-slate-900/80 p-6 shadow-sm shadow-slate-900/10">
            {task.imageUrl && (
              <img
                src={task.imageUrl}
                alt={task.title}
                className="mb-4 h-48 w-full rounded-3xl object-cover border border-slate-700"
              />
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{task.title}</h3>
                {task.description && <p className="mt-2 text-slate-400 text-sm leading-6">{task.description}</p>}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[task.category]}`}>
                    {task.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority || 'normal']}`}>
                    {task.priority || 'normal'} priority
                  </span>
                  {task.dueDate && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300">
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {task.reminderDateTime && (
                  <div className="mt-3 text-sm text-slate-400">
                    Reminder set for {new Date(task.reminderDateTime).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onTaskEdit?.(task)}
                  className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
