import React, { useState, useEffect } from "react";
import "./App.css";
import Toast, { showErrorToast, showSuccessToast } from "./components/toast";
import {
  CreateTask,
  GetTasks,
  CompleteTask,
} from "./controllers/taskApiController";

interface Task {
  id?: number;
  title: string;
  description: string;
  dueDate: string;
}

function App() {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // For mobile view tabs: "form" or "tasks"

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const tasksData = await GetTasks();
      setTasks(tasksData || []);
    } catch (error) {
      showErrorToast("Failed to load tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskDescription || !dueDate) {
      showErrorToast("Please fill out all fields!");
      return;
    }

    setIsLoading(true);
    try {
      const newTask = {
        title: taskTitle,
        description: taskDescription,
        dueDate,
      };
      const response = await CreateTask(newTask);

      if (response) {
        await fetchTasks();
        showSuccessToast("Task added successfully!");

        setTaskTitle("");
        setTaskDescription("");
        setDueDate("");
        
        // Switch to tasks view on mobile after adding a task
        if (window.innerWidth < 768) {
          setActiveTab("tasks");
        }
      }
    } catch (error) {
      showErrorToast("Failed to add task. Please try again.");
      console.error("Error adding task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteTask = async (id: number | undefined) => {
    if (id === undefined) {
      showErrorToast("Cannot complete task without an ID");
      return;
    }

    setIsLoading(true);
    try {
      await CompleteTask(id);

      await fetchTasks();
      showSuccessToast("Task marked as done!");
    } catch (error) {
      showErrorToast("Failed to complete task");
      console.error("Error completing task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Mobile Navigation Tabs */}
      <div className="md:hidden flex w-full border-b border-gray-200 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === "form" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-600"
          }`}
        >
          Add Task
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 py-4 text-center font-medium ${
            activeTab === "tasks" 
              ? "text-blue-600 border-b-2 border-blue-600" 
              : "text-gray-600"
          }`}
        >
          Your Tasks {tasks.length > 0 && `(${tasks.length})`}
        </button>
      </div>

      {/* Main Content */}
      <div className="md:grid md:grid-cols-2 md:gap-6 p-4 md:p-6">
        {/* Form section */}
        <div className={`md:block ${activeTab === "form" ? "block" : "hidden"}`}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col p-4 md:p-6 bg-white shadow-lg rounded-lg w-full max-w-xl mx-auto"
          >
            <h2 className="font-bold text-xl mb-4 text-gray-800">
              📌 Add a Task
            </h2>

            <input
              type="text"
              placeholder="Task Title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-3"
              disabled={isLoading}
            />

            <textarea
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none h-24 mb-3"
              disabled={isLoading}
            />

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-3"
              disabled={isLoading}
            />

            <button
              type="submit"
              className={`${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              } text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 w-full md:w-auto md:self-end`}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </div>

        {/* Tasks section */}
        <div className={`mt-6 md:mt-0 md:block ${activeTab === "tasks" ? "block" : "hidden"}`}>
          <div className="p-4 md:p-6 border-l-0 md:border-l-4 border-gray-300 bg-white md:bg-transparent md:h-full shadow-md md:shadow-none">
            <h2 className="font-bold text-xl mb-4 text-gray-800">
              📋 Your Tasks
            </h2>

            {isLoading && tasks.length === 0 ? (
              <div className="flex justify-center items-center h-32">
                <p className="text-gray-500">Loading tasks...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <p className="text-gray-500">No tasks available</p>
                ) : (
                  tasks.map((task, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 gap-4"
                    >
                      <div className="w-full sm:w-auto">
                        <h3 className="font-bold text-gray-900">{task.title}</h3>
                        <p className="text-gray-600 text-sm">
                          {task.description}
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Due: {task.dueDate.substring(0, 10)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className={`${
                          isLoading
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600 cursor-pointer"
                        } text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md w-full sm:w-auto`}
                        disabled={isLoading}
                      >
                        Done
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Toast />
    </div>
  );
}

export default App;