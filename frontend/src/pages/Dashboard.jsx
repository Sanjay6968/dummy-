import React, {
    useContext,
    useEffect,
    useState
} from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {

    const { token, logout } = useContext(AuthContext);

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);

    // GET TASKS
    const fetchTasks = async () => {
        try {

            const response = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTasks(response.data);

        } catch (error) {

            console.error(error);

            if (error.response?.status === 401) {
                logout();
                navigate("/login");
            }
        }
    };

    // FETCH WHEN DASHBOARD LOADS
    useEffect(() => {

        if (token) {
            fetchTasks();
        }

    }, [token]);


    // CREATE TASK
    const createTask = async (e) => {

        e.preventDefault();

        if (!title.trim()) {
            return;
        }

        setLoading(true);

        try {

            await axios.post(
                `${import.meta.env.VITE_API_URL}/tasks`,
                {
                    title,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setTitle("");
            setDescription("");

            fetchTasks();

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };


    // UPDATE TASK
    const updateTask = async (task) => {

        const newTitle = prompt(
            "Enter new title:",
            task.title
        );

        if (newTitle === null) {
            return;
        }

        try {

            await axios.put(
                `${import.meta.env.VITE_API_URL}/tasks/${task.id}`,
                {
                    title: newTitle,
                    description: task.description,
                    status: task.status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };


    // DELETE TASK
    const deleteTask = async (id) => {

        try {

            await axios.delete(
                `${import.meta.env.VITE_API_URL}/tasks/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchTasks();

        } catch (error) {

            console.error(error);
        }
    };


    // LOGOUT
    const handleLogout = () => {

        logout();
        navigate("/login");

    };


    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <h1>Task Manager</h1>

                <button onClick={handleLogout}>
                    Logout
                </button>

            </header>

            <main>

                <section className="task-form">

                    <h2>Create Task</h2>

                    <form onSubmit={createTask}>

                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating..."
                                : "Add Task"}
                        </button>

                    </form>

                </section>


                <section className="task-list">

                    <h2>Your Tasks</h2>

                    {tasks.length === 0 ? (

                        <p>No tasks yet.</p>

                    ) : (

                        tasks.map((task) => (

                            <div
                                className="task-card"
                                key={task.id}
                            >

                                <h3>{task.title}</h3>

                                <p>
                                    {task.description}
                                </p>

                                <p>
                                    Status: {task.status}
                                </p>

                                <button
                                    onClick={() =>
                                        updateTask(task)
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteTask(task.id)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        ))

                    )}

                </section>

            </main>

        </div>
    );
};

export default Dashboard;