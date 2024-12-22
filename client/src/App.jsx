import { useState, useEffect } from "react";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null);

  const fetchTodos = async () => {
    try {
      const response = await fetch("http://localhost:3000/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: todo }),
      });
      const newTodo = await response.json();
      setTodos((prevState) => [...prevState, newTodo]);
      setTodo("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });
      if (response.status === 200) {
        const newTodos = todos.filter((t) => t._id !== id);
        setTodos(newTodos);
      } else {
        console.error("Error deleting todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    try {
      const response = await fetch(
        `http://localhost:3000/todos/${currentTodoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: todo }),
        }
      );
      if (response.status === 200) {
        const updatedTodo = await response.json();
        const newTodos = todos.map((t) => {
          if (t._id === currentTodoId) {
            return updatedTodo;
          }
          return t;
        });
        setTodos(newTodos);
        setTodo("");
        setIsModalOpen(false);
      } else {
        console.error("Error updating todo:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const openModal = (todoId, currentText) => {
    setCurrentTodoId(todoId);
    setTodo(currentText);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTodo("");
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl text-white py-4">Todo App</h1>
      <form
        className="flex justify-center items-center gap-2"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Add Todo"
          className="input input-bordered w-1/3 font-bold text-2xl border-2 outline-none focus:outline-none hover:outline-none border-indigo-700 hover:border-4 py-5 hover:border-indigo-700"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
      <ul className="mt-4">
        {todos.map((t) => (
          <li
            key={t._id}
            className="capitalize text-xl font-poppins font-bold tracking-wider p-2 my-2 shadow-md rounded"
          >
            {t.type}
            <button
              onClick={() => handleDelete(t._id)}
              className="btn btn-error ml-5"
            >
              Delete
            </button>
            <button
              className="btn btn-accent ml-5"
              onClick={() => openModal(t._id, t.type)}
            >
              Update
            </button>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center">
          <div className="bg-transparent shadow-2xl p-6 rounded-lg w-1/3">
            <h2 className="text-2xl mb-4">Update Todo</h2>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                className="input input-bordered w-full font-bold text-2xl border-2 bg-transparent outline-none focus:outline-none font-poppins hover:outline-none border-indigo-700 hover:border-4 py-5 hover:border-indigo-700"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
