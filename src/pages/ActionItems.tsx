import React, { useEffect, useState } from "react";
import { 
  ClipboardDocumentListIcon, 
  XMarkIcon, 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

interface Task {
  taskId: string;
  title: string;
  description: string;
  assignee: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  dueDate: string;
  progress: number;
  timeline: {
    start: string;
    end: string;
  };
  owner: string;
  goalNotes?: string;
  relevantFiles?: string[];
}

const ActionItems: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.userId || "";
  const role = user?.roleName || "";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"MAIN" | "GANTT" | "CARDS">("MAIN");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState(0);
  const [timelineStart, setTimelineStart] = useState("");
  const [timelineEnd, setTimelineEnd] = useState("");
  const [goalNotes, setGoalNotes] = useState("");

  const canModify = role === "ADMIN" || role === "MANAGER";

  // Mock data - replace with API calls
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        taskId: "1",
        title: "Implement User Authentication",
        description: "Set up JWT-based authentication system",
        assignee: "john.doe@company.com",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: "2024-03-15",
        progress: 65,
        timeline: { start: "2024-02-01", end: "2024-03-15" },
        owner: "Project Manager",
        goalNotes: "Critical for security compliance",
        relevantFiles: ["auth-spec.pdf", "security-requirements.docx"]
      },
      {
        taskId: "2",
        title: "Design Dashboard UI",
        description: "Create responsive dashboard components",
        assignee: "jane.smith@company.com",
        priority: "MEDIUM",
        status: "TODO",
        dueDate: "2024-03-20",
        progress: 0,
        timeline: { start: "2024-03-01", end: "2024-03-20" },
        owner: "UI/UX Lead",
        goalNotes: "Follow design system guidelines"
      },
      {
        taskId: "3",
        title: "Database Optimization",
        description: "Optimize queries and add indexing",
        assignee: "mike.wilson@company.com",
        priority: "HIGH",
        status: "REVIEW",
        dueDate: "2024-03-10",
        progress: 90,
        timeline: { start: "2024-02-15", end: "2024-03-10" },
        owner: "Tech Lead",
        goalNotes: "Improve application performance by 40%"
      }
    ];
    setTasks(mockTasks);
    setFilteredTasks(mockTasks);
  }, []);

  useEffect(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== "ALL") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [search, statusFilter, priorityFilter, tasks]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      taskId: Date.now().toString(),
      title,
      description,
      assignee,
      priority,
      status,
      dueDate,
      progress,
      timeline: {
        start: timelineStart,
        end: timelineEnd
      },
      owner: user?.name || "Manager",
      goalNotes
    };

    setTasks(prev => [...prev, newTask]);
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.taskId !== taskId));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("MEDIUM");
    setStatus("TODO");
    setDueDate("");
    setProgress(0);
    setTimelineStart("");
    setTimelineEnd("");
    setGoalNotes("");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "REVIEW": return "bg-purple-100 text-purple-800";
      case "TODO": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const renderMainTableView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
            {canModify && <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <tr key={task.taskId} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-gray-900">{task.assignee}</span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(task.timeline.start).toLocaleDateString()} - {new Date(task.timeline.end).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{task.progress}%</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              {canModify && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PencilSquareIcon className="w-4 h-4 text-indigo-500 cursor-pointer" />
                    <TrashIcon 
                      onClick={() => handleDelete(task.taskId)}
                      className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <div key={task.taskId} className="bg-white rounded-lg shadow p-4 border">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-lg">{task.title}</h3>
            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Assignee:</span>
              <span>{task.assignee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Due:</span>
              <span>{new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="pt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
          {canModify && (
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <PencilSquareIcon className="w-4 h-4 text-indigo-500 cursor-pointer" />
              <TrashIcon 
                onClick={() => handleDelete(task.taskId)}
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderGanttView = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-center text-gray-500">
        <ChartBarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>Gantt Chart View</p>
        <p className="text-sm">Frappe Gantt integration would be implemented here</p>
      </div>
      {/* Frappe Gantt would be integrated here */}
      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p className="text-gray-500">Frappe Gantt Chart Component</p>
        <p className="text-sm text-gray-400">Visual timeline of tasks and dependencies</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardDocumentListIcon className="w-7 h-7 text-indigo-600" />
          Action Planner
        </h2>
        {canModify && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            <PlusIcon className="w-5 h-5 mr-2" /> Add Task
          </button>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setView("MAIN")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "MAIN" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Main Table
        </button>
        <button
          onClick={() => setView("GANTT")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "GANTT" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Gantt
        </button>
        <button
          onClick={() => setView("CARDS")}
          className={`px-4 py-2 rounded-lg transition ${
            view === "CARDS" ? "bg-indigo-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Cards
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-2 border rounded-lg focus:ring focus:ring-indigo-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="REVIEW">Review</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      {/* Content View */}
      {view === "MAIN" && renderMainTableView()}
      {view === "CARDS" && renderCardsView()}
      {view === "GANTT" && renderGanttView()}

      {/* Task Details Modal */}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-2xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelectedTask(null)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-3 text-indigo-600">Task Details</h3>
            <div className="space-y-3">
              <p><strong>Title:</strong> {selectedTask.title}</p>
              <p><strong>Description:</strong> {selectedTask.description}</p>
              <p><strong>Assignee:</strong> {selectedTask.assignee}</p>
              <p><strong>Priority:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedTask.priority)}`}>
                  {selectedTask.priority}
                </span>
              </p>
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedTask.status)}`}>
                  {selectedTask.status.replace('_', ' ')}
                </span>
              </p>
              <p><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
              <p><strong>Progress:</strong> {selectedTask.progress}%</p>
              {selectedTask.goalNotes && <p><strong>Goal Notes:</strong> {selectedTask.goalNotes}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showForm && canModify && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Create New Task
            </h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <input
                    type="text"
                    placeholder="Assignee email"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full border rounded-lg p-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline Start</label>
                  <input
                    type="date"
                    value={timelineStart}
                    onChange={(e) => setTimelineStart(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline End</label>
                  <input
                    type="date"
                    value={timelineEnd}
                    onChange={(e) => setTimelineEnd(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Notes</label>
                <textarea
                  placeholder="Additional notes and goals..."
                  value={goalNotes}
                  onChange={(e) => setGoalNotes(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItems;