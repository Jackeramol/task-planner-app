import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import Login from './Login';
import Register from './Register';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { tasksAPI } from './api';

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    setLoadingTasks(true);
    try {
      const response = await tasksAPI.getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleAuthSuccess = () => {
    const storedUser = localStorage.getItem('user');
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
    setAuthMode('login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setTasks([]);
    setEditingTask(null);
  };

  const exportTasks = () => {
    if (!tasks.length) return;
    const sheet = XLSX.utils.json_to_sheet(
      tasks.map((task) => ({
        Title: task.title,
        Description: task.description,
        Status: task.status,
        Category: task.category,
        Priority: task.priority || 'normal',
        DueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '',
        Reminder: task.reminderDateTime ? new Date(task.reminderDateTime).toLocaleString() : '',
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Tasks');
    XLSX.writeFile(workbook, 'task-planner-tasks.xlsx');
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for (const row of rows) {
      const taskData = {
        title: row.Title || row.title || 'Untitled task',
        description: row.Description || row.description || '',
        status: row.Status || row.status || 'pending',
        category: row.Category || row.category || 'general',
        priority: row.Priority || row.priority || 'normal',
        dueDate: row.DueDate ? new Date(row.DueDate) : undefined,
        reminderDateTime: row.Reminder ? new Date(row.Reminder) : undefined,
      };

      try {
        await tasksAPI.createTask(taskData);
      } catch (err) {
        console.error('Failed to import task:', err);
      }
    }

    fetchTasks();
    event.target.value = '';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-semibold text-white">Task Planner</h1>
            <p className="mt-2 text-slate-400">Manage your tasks efficiently</p>
          </div>

          {authMode === 'login' ? (
            <>
              <Login onSuccess={handleAuthSuccess} />
              <div className="mt-4 text-center">
                <p className="text-slate-400">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              <Register onSuccess={handleAuthSuccess} />
              <div className="mt-4 text-center">
                <p className="text-slate-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <header className="app-header rounded-3xl p-4 mb-6 glass flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-sky-500 w-12 h-12 flex items-center justify-center text-white text-xl font-bold">TP</div>
            <div>
              <h1 className="text-2xl font-semibold">Task Planner</h1>
              <p className="text-sm text-slate-300">Welcome, {user?.name} — stay on top of your work</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportTasks} className="btn-primary">Export</button>
            <label className="btn-secondary cursor-pointer">
              Import
              <input type="file" accept=".xlsx,.xls" onChange={handleImportFile} className="hidden" />
            </label>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </div>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <aside className="md:col-span-1">
            <div className="sticky top-6">
              <TaskForm
                onTaskCreated={() => {
                  fetchTasks();
                  setEditingTask(null);
                }}
                editingTask={editingTask}
                onEditComplete={() => {
                  fetchTasks();
                  setEditingTask(null);
                }}
              />
            </div>
          </aside>

          <section className="md:col-span-1">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full">
                <input
                  type="search"
                  placeholder="Search tasks by title or description..."
                  onInput={(e) => {
                    const q = e.target.value.toLowerCase();
                    if (!q) return fetchTasks();
                    setTasks((prev) => prev.filter(t => (t.title + ' ' + (t.description||'')).toLowerCase().includes(q)));
                  }}
                  className="flex-1 px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <select
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'all') return fetchTasks();
                    setTasks((prev) => prev.filter(t => t.status === v));
                  }}
                  className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {loadingTasks ? (
              <div className="text-center text-slate-400">Loading tasks...</div>
            ) : (
              <TaskList tasks={tasks} onTaskDeleted={fetchTasks} onTaskEdit={setEditingTask} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
