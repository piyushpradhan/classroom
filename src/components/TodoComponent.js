import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { IconContext } from "react-icons";

function TodoComponent() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  var tempTask = {
    todo: [],
    done: [],
  };

  tasks.forEach((task) => {
    tempTask[task.category].push(
      <div
        key={task.text}
        draggable
        onDragStart={(e) => onDragStart(e, task.text)}
        className="todoItems text-md bg-grey-200 py-1 px-2 mt-2 flex flex-row justify-between items-center"
      >
        <p>{task.text}</p>
        <button
          onClick={() => {
            deleteTask(task.text);
          }}
        >
          <FaRegTrashAlt />
        </button>
      </div>
    );
  });

  const deleteTask = (currentTask) => {
    var taskList = tasks.filter((task) => {
      if (task.text !== currentTask) return task;
    });

    setTasks(taskList);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDragStart = (e, taskId) => {
    e.dataTransfer.setData("id", taskId);
  };

  const onDrop = (e, colId) => {
    var id = e.dataTransfer.getData("id");
    var list = tasks.filter((task) => {
      if (task.text === id) {
        task.category = colId;
      }
      return task;
    });
    setTasks(list);
  };

  const addNewTask = () => {
    if (newTask.trim() !== "") {
      var nTask = {
        id: Math.floor(Math.random() * 100),
        text: newTask,
        category: "todo",
      };

      setTasks([...tasks, nTask]);
      setNewTask("");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col md:w-2/3 w-full">
          <div className="text-xl font-bold mt-10 mb-4">Assignments</div>
          <div className="flex flex-row w-full justify-between">
            <div
              className="droppable w-3/5 sm:w-full border-2 border-grey-900 py-2 px-4 mr-2 sm:mr-10 flex flex-col"
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "todo")}
            >
              <div className="text-lg font-semibold mb-4">ToDo</div>
              {tempTask.todo}
              <div className="inline-flex mt-4">
                <input
                  type="text"
                  onSubmit={addNewTask}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  className="w-full focus:outline-none border-b-2 px-1 font-light text-sm"
                  placeholder="Enter your task here..."
                />
                <button
                  onClick={addNewTask}
                  className="bg-grey-900 ml-4 p-2 text-white rounded-md"
                >
                  ADD
                </button>
              </div>
            </div>
            <div
              className="w-2/5 sm:w-full border-2 border-grey-900 py-2 px-4 mr-10 flex flex-col"
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "done")}
            >
              <div className="text-lg font-semibold mb-4">Done!</div>
              {tempTask.done}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start md:w-1/3 w-full">
          <div className="text-xl font-bold mt-10 mb-4">Ongoing Classes</div>
          <div className="border-2 border-grey-900 rounded-md py-2 px-4 mr-10 w-full flex flex-col">
            <div className="text-md  border-grey-900 rounded-md p-4">
              No classes are scheduled for now. Enjoy 🎉
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoComponent;
