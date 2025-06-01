import { useEffect, useState } from 'react';
import NewProjectModal from './NewProjectModal';
import TaskModal from './TaskModal';
import { Project, User } from '@/app/dashboard/page';

interface ProjectsProps {
  projects: Project[];
  users: User[];
  onProjectAdded: () => void;
  onTaskAdded: () => void;
  onProjectDeleted: (projectId: number) => void;
}

export default function Projects({
  projects,
  users,
  onProjectAdded,
  onTaskAdded,
  onProjectDeleted
}: ProjectsProps) {
  const [expandedProject, setExpandedProject] = useState<Project | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Project['tasks'][0] | null>(null);

  const handleTaskClick = (task: Project['tasks'][0]) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  useEffect(() => {
    if(expandedProject){
      setExpandedProject(projects.find(project => project.id === expandedProject.id) || null)
    }
  }, [projects, expandedProject])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black">Your Projects</h1>
        <button
          onClick={() => setShowNewProjectModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Create New Project
        </button>
      </div>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                project.id === expandedProject?.id
                  ? "bg-gray-100"
                  : "bg-white"
              } p-4 rounded shadow hover:shadow-lg transition text-black`}
              onClick={() => {
                if (expandedProject?.id === project.id) {
                  setExpandedProject(null);
                  return;
                }
                setExpandedProject(project);
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-grow cursor-pointer">
                  <h2 className="text-xl font-semibold">
                    {project.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProjectDeleted(project.id);
                  }}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {expandedProject && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              Tasks for {expandedProject.name}
            </h2>
            <button
              onClick={() => {
                setSelectedTask(null);
                setShowTaskModal(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add New Task for {expandedProject.name}
            </button>
          </div>
          <div className="grid gap-4">
            {expandedProject.tasks
              .sort((a, b) => {
                const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
                return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
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
                    <p className="text-sm text-gray-600">
                      Assigned To: {task.assignedTo.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleTaskClick(task)}
                    className="text-blue-500 hover:text-blue-700 p-1 cursor-pointer"
                    title="Edit task"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <TaskModal
            users={users}
            projectId={expandedProject.id}
            isOpen={showTaskModal}
            onClose={() => {
              setShowTaskModal(false);
              setSelectedTask(null);
            }}
            onTaskAdded={onTaskAdded}
            task={selectedTask || undefined}
          />
        </div>
      )}
      <NewProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
        onProjectAdded={onProjectAdded}
      />
    </div>
  );
}