import "./App.css";

function App() {
  return (
    <div className="grid grid-cols-2 gap-6 h-screen p-6 bg-gray-100">
      {/* Left Section - Task Input */}
      <div className="flex flex-col items-center p-6 bg-white shadow-lg rounded-lg min-w-[600px] mx-auto">
        <h2 className="font-bold text-xl mb-4 text-gray-800">📌 Add a Task</h2>
        
        <input
          type="text"
          placeholder="Task Title"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none mb-3"
        />
        
        <textarea
          placeholder="Task Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none h-24 mb-3"
        ></textarea>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md transition-all duration-200 self-end">
          Add Task
        </button>
      </div>

      {/* Right Section - Task List */}
      <div className="p-6 border-l-4 border-gray-300">
        <h2 className="font-bold text-xl mb-4 text-gray-800">📋 Your Tasks</h2>
        
        <div className="space-y-4">
          {/* Task Card */}
          <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center border-l-5 border-blue-500 hover:shadow-lg transition-all duration-200">
            <div>
              <h3 className="font-bold text-gray-900">📖 Buy books</h3>
              <p className="text-gray-600 text-sm">Buy books for the next school year</p>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
