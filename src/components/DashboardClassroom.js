import React, { useEffect, useState } from "react";
import AnnouncementTile from "./AnnouncementTile";
import firebase from "../firebase/firebase";
import { useAuthContext } from "../context/AuthContext";
import { useClassroomContext } from "../context/ClassroomContext";
import AssignmentTile from "./AssignmentTile";

const DashboardClassroom = () => {
  const [question, setQuestion] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncementText, setNewAnnouncementText] = useState("");

  const { currentUser } = useAuthContext();
  const { classroomState, updateAssignmentList } = useClassroomContext();

  useEffect(() => {
    const response = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);
    response.get().then((snapshot) => {
      var questions = [];
      var teachersList = [];
      if (snapshot.data() !== undefined)
        teachersList = snapshot.data().teachers;
      // if (snapshot.data() !== undefined)
      //   questions = snapshot.data().assignments;
      // updateAssignmentList(questions);

      var teacherMap = {};
      teachersList.forEach((t) => {
        teacherMap[t] = 1;
      });

      var announcementsList = [];

      const res = firebase.firestore().collection("users");

      res.get().then((snapshot) => {
        snapshot.forEach((user) => {
          if (teacherMap[user.data().email] === 1) {
            announcementsList.push(...user.data().announcements);
            questions.push(...user.data().assignments);
          }
        });
        announcementsList = [
          ...new Map(
            announcementsList.map((item) => [item["text"], item])
          ).values(),
        ];
        questions = [...new Map(questions.map((q) => [q["text"], q])).values()];
        console.log(questions);
        setAnnouncements(announcementsList);
        updateAssignmentList(questions);
      });
    });
  }, []);

  function addAnnouncement() {
    if (newAnnouncementText.trim() !== "") {
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        var newAnnouncement = {
          text: newAnnouncementText,
          author: currentUser.displayName,
          date: getToday(),
        };

        var temp = announcements;
        temp.push(newAnnouncement);
        setAnnouncements(temp);
        response.update({
          announcements: temp,
        });
      });
      setNewAnnouncementText("");
    } else {
      window.alert("An announcement can't be blank!");
    }
  }

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function onQuestionSubmit() {
    if (question.trim() !== "") {
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        const newQuestion = {
          text: question,
          link: driveLink,
          author: currentUser.displayName,
          due: dueDate,
          answers: [],
        };
        var questions = [];
        if (snapshot.data() !== undefined)
          questions = snapshot.data().assignments;
        questions.push(newQuestion);
        response.update({
          assignments: questions,
        });
        updateAssignmentList(questions);
      });
    } else {
      window.alert("You can't send a blank question!");
    }
  }

  return (
    <>
      <div className="flex md:flex-row flex-col-reverse">
        <div className="flex flex-col w-full md:mt-0 mt-4">
          {classroomState.isTeacher === true ? (
            <div>
              <div className="font-bold text-xl">Make a question</div>
              <div className="relative mt-4 mr-0 md:mr-8">
                <div className="absolute bg-grey-900 w-full h-full -right-2 -bottom-2"></div>
                <div className="relative flex flex-col bg-white border-2 border-grey-900 space-y-2 px-4 py-4 h-full">
                  <label className="font-bold text-xl">Q.</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="focus:outline-none max-h-max text-lg overflow-hidden"
                    placeholder="Type your question here"
                  ></textarea>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="text-sm max-w-max"
                  />
                  <input
                    type="text"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    className="focus:outline-none text-sm font-bold"
                    placeholder="Add a google drive link (optional)"
                  />
                  <div className="flex flex-row w-full justify-end">
                    <button
                      onClick={onQuestionSubmit}
                      className="bg-grey-900 text-white font-bold px-4 py-2 rounded-md focus:outline-none"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className="font-bold text-xl mt-8">Assignments</div>
          {classroomState.assignments.length === 0 ? (
            <div className="flex flex-col justify-start items-center">
              <img
                className="mt-16 w-96 opacity-70"
                src="/images/assignments_image.svg"
                alt="No assignments for you"
              />
              <div className="md:text-lg font-bold text-grey-400 mt-16 md:mr-40 self-center">
                No assignments
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {classroomState.assignments.map((assignment, index) => {
                return (
                  <AssignmentTile
                    assignment={assignment}
                    index={index}
                    assignmentList={classroomState.assignments}
                  />
                );
              })}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full max-w-max md:mt-0 mt-4">
          <div className="text-lg font-bold">Announcements</div>
          <div className="flex flex-col md:mt-4 mt-2 py-2 max-h-max md:w-80 lg:w-96 border-2 border-grey-900">
            {announcements.length !== 0 ? (
              <div className="flex flex-col">
                {announcements.map((ann) => {
                  return <AnnouncementTile announcement={ann} />;
                })}
              </div>
            ) : (
              <div className="flex flex-row w-full my-2 text-grey-400 justify-center items-center">
                No announcements
              </div>
            )}
            {classroomState.isTeacher === true ? (
              <div className="flex flex-row justify-between px-2">
                <input
                  type="text"
                  value={newAnnouncementText}
                  onChange={(e) => setNewAnnouncementText(e.target.value)}
                  placeholder="Type here..."
                  className="w-full text-sm focus:outline-none"
                />
                <button
                  onClick={addAnnouncement}
                  className="text-sm bg-grey-200 py-1 px-2"
                >
                  Send
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardClassroom;
