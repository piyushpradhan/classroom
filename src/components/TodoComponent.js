import React, { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { RiAddCircleFill } from "react-icons/ri";
import { useHistory } from "react-router-dom";

import firebase from "../firebase/firebase";

function TodoComponent({ currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [classes, setClasses] = useState([]);

  const [isModalOpen, toggleModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const response = firebase
          .firestore()
          .collection("users")
          .doc(user.uid);

        response.get().then((snapshot) => {
          var temp = [];
          if (snapshot.data()) temp = snapshot.data().todos;
          setTasks(temp);
        });
      } else {
        history.replace("/");
      }
    });
  }, []);

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
        const response = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid);
        response.get().then((snapshot) => {
          const updated = snapshot.data().todos.map((todo) => {
            if (todo.text === id) {
              const updatedTask = todo;
              updatedTask.category = colId;
            }
            return todo;
          });
          response.update({
            todos: updated,
          });
        });
      }
      return task;
    });
    setTasks(list);
  };

  const addNewTask = () => {
    if (newTask.trim() !== "") {
      var nTask = {
        text: newTask,
        category: "todo",
      };
      var temp = tasks;
      temp.push(nTask);
      setTasks(temp);
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        response.update({
          todos: tasks,
        });
        console.log(typeof tasks);
      });
      setNewTask("");
    }
  };

  const deleteTask = (currentTask) => {
    var taskList = tasks.filter((task) => task.text !== currentTask);

    setTasks(taskList);
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.update({
      todos: taskList,
    });
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex flex-col w-full">
          <div className="text-xl font-bold mt-10 mb-4">Assignments</div>
          <div className="flex flex-col md:flex-row w-full justify-between">
            <div
              className="droppable w-full border-2 border-grey-900 py-2 px-4 mr-2 sm:mr-10 flex flex-col justify-between"
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "todo")}
            >
              <div className="flex flex-col">
                <div className="text-lg font-semibold mb-4">ToDo</div>
                {tempTask.todo.length === 0 ? (
                  <div className="border-t border-b border-dashed border-grey-900 py-1 self-center text-grey-500">
                    Your tasks will appear here
                  </div>
                ) : (
                  tempTask.todo
                )}
              </div>
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
              className="w-full mt-4 md:mt-0 border-2 border-grey-900 py-2 px-4 flex flex-col"
              onDragOver={(e) => onDragOver(e)}
              onDrop={(e) => onDrop(e, "done")}
            >
              <div className="text-lg font-semibold mb-4">Done!</div>
              {tempTask.done}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoComponent;
