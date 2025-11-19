import React, { useEffect, useState } from "react";
import { 
  ClipboardDocumentListIcon, 
  XMarkIcon, 
  PencilSquareIcon, 
  TrashIcon,
  PlusIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient"; // Import axios client for API calls

// Interface matching the backend DTO structure
interface Task {
  taskId: string;
  title: string;
  description: string;
  assignee: string; // Email of the assignee
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  dueDate: string;
  progress: ProgressStage; // Progress stage from backend enum
  progressPercentage: number; // Calculated percentage from progress stage
  timeline: {
    start: string;
    end: string;
  };
  owner: string;
  goalNotes?: string;
  relevantFiles?: string[];
}

// Progress stage enum to match backend
enum ProgressStage {
  NOT_STARTED = "NOT_STARTED",
  INFORMATION_GATHERING = "INFORMATION_GATHERING",
  REQUIREMENTS_ANALYSIS = "REQUIREMENTS_ANALYSIS",
  IMPLEMENTATION = "IMPLEMENTATION",
  TESTING = "TESTING",
  DEPLOYMENT = "DEPLOYMENT"
}

const ActionItems: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.userId || "";
  const role = user?.roleName || "";

  // State management
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"MAIN" | "GANTT" | "CARDS">("MAIN");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state - matches ActionDTO structure
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [status, setStatus] = useState<"TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED">("TODO");
  const [dueDate, setDueDate] = useState("");
  const [progress, setProgress] = useState<ProgressStage>(ProgressStage.NOT_STARTED);
  const [timelineStart, setTimelineStart] = useState("");
  const [timelineEnd, setTimelineEnd] = useState("");
  const [goalNotes, setGoalNotes] = useState("");

  // Permission check - only ADMIN and MANAGER can modify tasks
  const canModify = role === "ADMIN" || role === "MANAGER";

  // Fetch all tasks from backend on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetches all tasks from the backend API
   */
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/actions");
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
      // Fallback to empty array if API fails
      setTasks([]);
      setFilteredTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search term and filters
  useEffect(() => {
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.assignee.toLowerCase().includes(search.toLowerCase())
    );

    // Apply status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "ALL") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  }, [search, statusFilter, priorityFilter, tasks]);

  /**
   * Creates a new task by calling the backend API
   */
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      // Prepare task data matching ActionDTO structure
      const taskData = {
        title,
        description,
        assignee, // Email of the assignee
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

      // API call to create task
      const response = await axiosClient.post("/actions", taskData);
      
      // Add new task to local state
      setTasks(prev => [...prev, response.data]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task. Please check the assignee email and try again.");
    }
  };

  /**
   * Updates an existing task via backend API
   */
  const handleUpdate = async (taskId: string, updatedTask: Partial<Task>) => {
    setError(null);
    try {
      const response = await axiosClient.put(`/actions/${taskId}`, updatedTask);
      
      // Update task in local state
      setTasks(prev => prev.map(task => 
        task.taskId === taskId ? response.data : task
      ));
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    }
  };

  /**
   * Deletes a task via backend API
   */
  const handleDelete = async (taskId: string) => {
    setError(null);
    try {
      await axiosClient.delete(`/actions/${taskId}`);
      
      // Remove task from local state
      setTasks(prev => prev.filter(task => task.taskId !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  /**
   * Updates task progress stage via backend API
   */
  const handleProgressUpdate = async (taskId: string, progressStage: ProgressStage) => {
    setError(null);
    try {
      const response = await axiosClient.patch(`/actions/${taskId}/progress?progress=${progressStage}`);
      
      // Update task in local state
      setTasks(prev => prev.map(task => 
        task.taskId === taskId ? response.data : task
      ));
    } catch (err) {
      console.error("Error updating task progress:", err);
      setError("Failed to update task progress. Please try again.");
    }
  };

  /**
   * Fetches tasks by assignee email from backend
   */
  const fetchTasksByAssignee = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/actions/assignee/${email}`);
      setFilteredTasks(response.data);
    } catch (err) {
      console.error("Error fetching tasks by assignee:", err);
      setError("Failed to load tasks for this assignee.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Searches tasks via backend API
   */
  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/actions/search?q=${encodeURIComponent(searchTerm)}`);
      setFilteredTasks(response.data);
    } catch (err) {
      console.error("Error searching tasks:", err);
      setError("Search failed. Please try again.");
      // Fallback to client-side search
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTasks(filtered);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Applies filters via backend API
   */
  const handleFilter = async (status: string, priority: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get(`/actions/filter?status=${status}&priority=${priority}`);
      setFilteredTasks(response.data);
    } catch (err) {
      console.error("Error filtering tasks:", err);
      setError("Filter failed. Please try again.");
      // Fallback to client-side filtering
      let filtered = tasks;
      if (status !== "ALL") {
        filtered = filtered.filter(task => task.status === status);
      }
      if (priority !== "ALL") {
        filtered = filtered.filter(task => task.priority === priority);
      }
      setFilteredTasks(filtered);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets form fields to initial state
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setAssignee("");
    setPriority("MEDIUM");
    setStatus("TODO");
    setDueDate("");
    setProgress(ProgressStage.NOT_STARTED);
    setTimelineStart("");
    setTimelineEnd("");
    setGoalNotes("");
  };

  /**
   * Gets CSS classes for priority badge colors
   */
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Gets CSS classes for status badge colors
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800";
      case "REVIEW": return "bg-purple-100 text-purple-800";
      case "TODO": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  /**
   * Renders the main table view of tasks
   */
  const renderMainTableView = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {loading && (
        <div className="p-4 text-center text-gray-500">Loading tasks...</div>
      )}
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
            <tr 
              key={task.taskId} 
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
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
                    style={{ width: `${task.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{task.progressPercentage}% - {task.progress}</span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {new Date(task.dueDate).toLocaleDateString()}
              </td>
              {canModify && (
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {/* Progress update dropdown */}
                    <select
                      value={task.progress}
                      onChange={(e) => handleProgressUpdate(task.taskId, e.target.value as ProgressStage)}
                      className="text-xs border rounded p-1"
                      onClick={(e) => e.stopPropagation()} // Prevent row click
                    >
                      {Object.values(ProgressStage).map(stage => (
                        <option key={stage} value={stage}>
                          {stage.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                    <PencilSquareIcon 
                      className="w-4 h-4 text-indigo-500 cursor-pointer hover:text-indigo-700" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Implement edit functionality
                      }}
                    />
                    <TrashIcon 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(task.taskId);
                      }}
                      className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
                    />
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTasks.length === 0 && !loading && (
        <div className="p-8 text-center text-gray-500">
          No tasks found. {search ? "Try a different search term." : "Create your first task!"}
        </div>
      )}
    </div>
  );

  /**
   * Renders the card view of tasks
   */
  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTasks.map((task) => (
        <div 
          key={task.taskId} 
          className="bg-white rounded-lg shadow p-4 border hover:shadow-md transition cursor-pointer"
          onClick={() => setSelectedTask(task)}
        >
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
                <span>{task.progressPercentage}% - {task.progress.replace('_', ' ')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${task.progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
          {canModify && (
            <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
              <select
                value={task.progress}
                onChange={(e) => handleProgressUpdate(task.taskId, e.target.value as ProgressStage)}
                className="text-xs border rounded p-1"
                onClick={(e) => e.stopPropagation()}
              >
                {Object.values(ProgressStage).map(stage => (
                  <option key={stage} value={stage}>
                    {stage.replace('_', ' ')}
                  </option>
                ))}
              </select>
              <PencilSquareIcon 
                className="w-4 h-4 text-indigo-500 cursor-pointer hover:text-indigo-700"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement edit functionality
                }}
              />
              <TrashIcon 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(task.taskId);
                }}
                className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-700"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  /**
   * Renders the Gantt chart view (placeholder for Frappe Gantt integration)
   */
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
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

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
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(search);
              }
            }}
            className="flex-1 p-2 border rounded-lg focus:ring focus:ring-indigo-200"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              handleFilter(e.target.value, priorityFilter);
            }}
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
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              handleFilter(statusFilter, e.target.value);
            }}
            className="p-2 border rounded-lg"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <button
            onClick={() => fetchTasks()} // Refresh button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Content View */}
      {loading && view !== "MAIN" && (
        <div className="text-center p-4 text-gray-500">Loading tasks...</div>
      )}
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
              <p><strong>Progress:</strong> {selectedTask.progressPercentage}% - {selectedTask.progress.replace('_', ' ')}</p>
              <p><strong>Timeline:</strong> {new Date(selectedTask.timeline.start).toLocaleDateString()} to {new Date(selectedTask.timeline.end).toLocaleDateString()}</p>
              <p><strong>Owner:</strong> {selectedTask.owner}</p>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee Email *</label>
                  <input
                    type="email"
                    placeholder="Assignee email"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress Stage</label>
                  <select
                    value={progress}
                    onChange={(e) => setProgress(e.target.value as ProgressStage)}
                    className="w-full border rounded-lg p-2"
                  >
                    {Object.values(ProgressStage).map(stage => (
                      <option key={stage} value={stage}>
                        {stage.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline Start *</label>
                  <input
                    type="date"
                    value={timelineStart}
                    onChange={(e) => setTimelineStart(e.target.value)}
                    required
                    className="w-full border rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline End *</label>
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