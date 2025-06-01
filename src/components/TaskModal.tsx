import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, Task } from '@/app/dashboard/page';

interface TaskModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
  users: User[];
  task?: Task;
}

export default function TaskModal({
  projectId,
  isOpen,
  onClose,
  onTaskAdded,
  users,
  task
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignedToId, setAssignedToId] = useState<number>(users[0]?.id || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      setAssignedToId(task.assignedToId || users[0]?.id || 0);
    } else {
      setTitle('');
      setPriority('MEDIUM');
      setAssignedToId(users[0]?.id || 0);
    }
  }, [task, users]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const taskData = {
        title,
        priority,
        assignedToId,
        projectId,
        completed: task?.completed || false
      };

      if (task) {
        await api.put(`/tasks/${task.id}`, taskData);
      } else {
        await api.post('/tasks', taskData);
      }

      onTaskAdded();
      onClose();
      setTitle('');
      setPriority('MEDIUM');
      setAssignedToId(users[0]?.id || 0);
    } catch (error) {
      console.error('Failed to save task:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">
          {task ? 'Update Task' : 'Add New Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to
            </label>
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {users.map(user => (
                <option value={user.id} key={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}