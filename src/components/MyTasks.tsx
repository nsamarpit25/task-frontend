import { useState } from 'react';
import { Task } from '@/app/dashboard/page';

interface MyTasksProps {
  tasks: Task[];
  onTaskStatusChanged: (taskId: number, currentStatus: boolean) => void;
  onTaskDeleted: (taskId: number) => void;
}

export default function MyTasks({ tasks, onTaskStatusChanged, onTaskDeleted }: MyTasksProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  return (
     <div>
        <div className="flex justify-between items-center mb-6">
           <h1 className="text-3xl font-bold text-black">My Tasks</h1>
           <div className="flex gap-2">
              <button
                 onClick={() => setFilter("all")}
                 className={`px-4 py-2 rounded ${
                    filter === "all"
                       ? "bg-blue-500 text-white"
                       : "bg-gray-200 text-gray-700"
                 } hover:bg-blue-600 hover:text-white transition`}
              >
                 All
              </button>
              <button
                 onClick={() => setFilter("pending")}
                 className={`px-4 py-2 rounded ${
                    filter === "pending"
                       ? "bg-blue-500 text-white"
                       : "bg-gray-200 text-gray-700"
                 } hover:bg-blue-600 hover:text-white transition`}
              >
                 Pending
              </button>
              <button
                 onClick={() => setFilter("completed")}
                 className={`px-4 py-2 rounded ${
                    filter === "completed"
                       ? "bg-blue-500 text-white"
                       : "bg-gray-200 text-gray-700"
                 } hover:bg-blue-600 hover:text-white transition`}
              >
                 Completed
              </button>
           </div>
        </div>
        {filteredTasks.length === 0 ? (
           <p className="text-gray-500">No tasks found.</p>
        ) : (
           <div className="grid gap-4">
              {filteredTasks
                 .sort((a, b) => {
                    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                    return (
                       priorityOrder[a.priority as keyof typeof priorityOrder] -
                       priorityOrder[b.priority as keyof typeof priorityOrder]
                    );
                 })
                 .map((task) => (
                    <div
                       key={task.id}
                       className={`p-4 rounded-lg shadow ${
                          task.completed
                             ? "bg-green-50 border border-green-200"
                             : "bg-white"
                       }`}
                    >
                       <div className="flex items-start justify-between">
                          <div>
                             <h3
                                className={`text-lg font-semibold ${
                                   task.completed
                                      ? "line-through text-gray-500"
                                      : ""
                                }`}
                             >
                                {task.title}
                             </h3>
                             <p className="text-sm text-gray-500">
                                Priority: {task.priority}
                             </p>
                          </div>
                          <div className="flex gap-2">
                             <button
                                onClick={() =>
                                   onTaskStatusChanged(task.id, task.completed)
                                }
                                className={`px-3 py-1 rounded ${
                                   task.completed
                                      ? "bg-yellow-500 hover:bg-yellow-600"
                                      : "bg-green-500 hover:bg-green-600"
                                } text-white transition`}
                             >
                                {task.completed
                                   ? "Mark Incomplete"
                                   : "Mark Complete"}
                             </button>
                             <button
                                onClick={() => onTaskDeleted(task.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                             >
                                Delete
                             </button>
                          </div>
                       </div>
                    </div>
                 ))}
           </div>
        )}
     </div>
  );
}