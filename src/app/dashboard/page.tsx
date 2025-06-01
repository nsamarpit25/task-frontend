'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getToken } from '@/lib/auth';
import FullscreenLoader from '@/components/FullScreenLoader';
import Projects from '@/components/Projects';
import MyTasks from '@/components/MyTasks';

export interface User {
  id: number;
  name: string;
}

export interface Task {
  id: number;
  title: string;
  priority: string;
  assignedToId: number | null;
  assignedTo: User;
  completed: boolean;
  project?: {
    id: number;
    name: string;
  };
}

export interface Project {
  id: number;
  name: string;
  createdAt: string;
  tasks: Task[];
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');
  const [myTasks, setMyTasks] = useState<Task[]>([]);

  const router = useRouter();

  const fetchData = async () => {
    const token = getToken();
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const promisesArray = [api.get("/projects"), api.get("/users"), api.get("/tasks/me")];

      const [projectsRes, usersRes, tasksRes] = await Promise.all(promisesArray);

      setProjects(projectsRes.data);
      setUsers(usersRes.data);
      setMyTasks(tasksRes.data);
    } catch (err: unknown) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [router]);

  const handleTaskStatusChange = async (taskId: number, currentStatus: boolean) => {
    try {
      await api.put(`/tasks/${taskId}`, { completed: !currentStatus });
      await fetchData();
    } catch (err: unknown) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchData();
    } catch (err: unknown) {
      console.error('Failed to delete task:', err);
    }
  };

  const handleProjectDelete = async (projectId: number) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }

    try {
      await api.delete(`/projects/${projectId}`);
      await fetchData();
    } catch (err: unknown) {
      console.error('Failed to delete project:', err);
    }
  };

  if (loading) return <FullscreenLoader />;

  return (
    <main className="p-8 min-h-screen bg-gray-100 text-black">
      <div className="mb-8">
        <div className="flex space-x-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Tasks
          </button>
        </div>
      </div>

      {activeTab === 'projects' ? (
        <Projects
          projects={projects}
          users={users}
          onProjectAdded={fetchData}
          onTaskAdded={fetchData}
          onProjectDeleted={handleProjectDelete}
        />
      ) : (
        <MyTasks
          tasks={myTasks}
          onTaskStatusChanged={handleTaskStatusChange}
          onTaskDeleted={handleTaskDelete}
        />
      )}
    </main>
  );
}