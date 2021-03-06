import React, { useState, useEffect } from "react";
import axios from "axios";

const Lambdady = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]);
  const [editedTask, setEditedTask] = useState({ id: "", title: "" });
  const [id, setId] = useState(1);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setTasks(res.data.Items);
      });
  }, []);

  const deleteTask = (id) => {
    axios
      .delete(process.env.REACT_APP_URL + `/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTasks(tasks.filter((item) => item.id !== id));
        setSelectedTask([]);
        if (editedTask.id === id) {
          setEditedTask({ id: "", title: "" });
        }
      });
  };

  const newTask = (task) => {
    const data = {
      title: task.title,
    };
    axios
      .post(process.env.REACT_APP_URL, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTasks([...tasks, res.data.body.Item]);
        setEditedTask({ id: "", title: "" });
      });
  };

  const editTask = (task) => {
    const data = {
      title: task.title,
    };
    axios
      .put(process.env.REACT_APP_URL + `/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setTasks(
          tasks.map((task) =>
            task.id === editedTask.id ? res.data.Item : task
          )
        );
        setEditedTask({ id: "", title: "" });
      });
  };

  const handleInputChange = (evt) => {
    const value = evt.target.value;
    const name = evt.target.name;
    setEditedTask({ ...editedTask, [name]: value });
  };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {" "}
            {task.title}
            <button onClick={() => deleteTask(task.id)}>Delete</button>
            <button onClick={() => setEditedTask(task)}>Edit</button>
          </li>
        ))}
      </ul>

      <h3>
        {selectedTask.title}
        {selectedTask.id}
      </h3>

      <input
        type="text"
        name="title"
        value={editedTask.title}
        onChange={(evt) => handleInputChange(evt)}
        placeholder="??????????????????"
        required
      ></input>
      {editedTask.id ? (
        <button onClick={() => editTask(editedTask)}>Update</button>
      ) : (
        <button onClick={() => newTask(editedTask)}>Create</button>
      )}
    </div>
  );
};

export default Lambdady;
