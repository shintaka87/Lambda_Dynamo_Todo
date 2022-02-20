import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Lambdady = () => {

    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState([]);
    const [editedTask, setEditedTask] = useState({id: '', title: ''});
    const [id, setId] = useState(1);

    useEffect(() =>{
        axios.get('https://uy9tl4mut7.execute-api.ap-northeast-1.amazonaws.com/Todo/task' , {
            headers: {'Content-Type':'application/json'} })
            .then(res => {setTasks(res.data.Items);
            
        });
    },[]);

   
    const deleteTask = (id) => {
        
        axios.delete(`https://uy9tl4mut7.execute-api.ap-northeast-1.amazonaws.com/Todo/task/${id}`,  {
            headers: {
                'Content-Type':'application/json',
            }})
            .then(res => {setTasks(tasks.filter(item => item.id !== id));
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
        axios.post(` https://uy9tl4mut7.execute-api.ap-northeast-1.amazonaws.com/Todo/task`, data,{
            headers: {
                'Content-Type':'application/json',
            }})
            .then(res => {setTasks([...tasks, res.data.body.Item]);  
            setEditedTask({id:'', title:''});
        });
    };

    const editTask = (task) => {
        const data = {
            title: task.title,
        };
        axios.put(` https://uy9tl4mut7.execute-api.ap-northeast-1.amazonaws.com/Todo/task/${task.id}`,data,{
            headers: {
                'Content-Type':'application/json',
            }})
            .then(res => {setTasks(tasks.map(task=> (task.id === editedTask.id ? res.data.Item: task)));
                setEditedTask({id:'', title:''});
            });
            
    };

    const handleInputChange = (evt) => {
        const value = evt.target.value
        const name = evt.target.name
        setEditedTask({...editedTask, [name]:value});
    };

  return (
    <div>
        <ul>
            
               {
                tasks.map(task => (<li key={task.id}> {task.title} 
                <button onClick={() => deleteTask(task.id)}>
                Delete</button>
                <button onClick={() => setEditedTask(task)}>
                Edit</button>
                </li>))
                
            }
                
            
        </ul>

       
        <h3>{selectedTask.title}{selectedTask.id}</h3>
        
        <input type="text" name="title" value={editedTask.title} onChange={(evt) => handleInputChange(evt)} placeholder="新しいタスク" required></input>
        {editedTask.id ?(
        <button onClick={() => editTask(editedTask)}>Update</button>) :
        (<button onClick={() => newTask(editedTask)}>Create</button>)}
    </div>
  )
}

export default Lambdady;