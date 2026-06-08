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
        <div className="rounded-3xl border border-slate-700 glass p-8 text-center">
          <p className="text-slate-400">No tasks yet. Create one to get started!</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task._id} className="group rounded-2xl border border-slate-700 glass p-6 shadow-sm card-hover">
            <div className="flex gap-4 items-start">
              {task.imageUrl ? (
                <img
                  src={task.imageUrl}
                  alt={task.title}
                  className="h-28 w-28 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                />
              ) : (
                <div className="h-28 w-28 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">No Image</div>
              )}

              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                    {task.description && <p className="mt-1 text-slate-400 text-sm leading-6">{task.description}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[task.status]}`}>{task.status}</div>
                    {task.dueDate && <div className="text-xs text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</div>}
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[task.category]}`}>{task.category}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority || 'normal']}`}>{task.priority || 'normal'}</span>
                </div>

                {task.reminderDateTime && (
                  <div className="mt-3 text-sm text-slate-400">Reminder: {new Date(task.reminderDateTime).toLocaleString()}</div>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2 justify-end">
              <button onClick={() => onTaskEdit?.(task)} className="btn-primary text-sm">Edit</button>
              <button onClick={() => handleDelete(task._id)} className="btn-danger text-sm">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
