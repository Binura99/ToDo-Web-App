import axios from "axios";

const baseURL: string = import.meta.env.VITE_API_URL;

interface TaskData {
  title: string;
  description: string;
  dueDate: string;
}

async function CreateTask({ title, description, dueDate }: TaskData) {
  try {
    const response = await axios.post(baseURL, { title, description, dueDate });
    return response.data;
  } catch (error) {
    console.error("Error From CreateTask API:", error);
    throw error;
  }
}

async function GetTasks() {
  try {
    const response = await axios.get(baseURL);
    return response.data;
  } catch (error) {
    console.error("Error From GetTasks API:", error);
    throw error;
  }
}

async function CompleteTask(id: number) {
  try {
    const response = await axios.patch(`${baseURL}/${id}`, { completed: true });
    return response.data;
  } catch (error) {
    console.error("Error From CompleteTask API:", error);
    throw error;
  }
}

export { CreateTask, GetTasks, CompleteTask };