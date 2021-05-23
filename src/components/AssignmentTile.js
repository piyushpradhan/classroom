import React, { useState } from "react";
import { RiArrowDropDownFill } from "react-icons/ri";
import { useAuthContext } from "../context/AuthContext";
import { useClassroomContext } from "../context/ClassroomContext";
import firebase from "../firebase/firebase";

const AssignmentTile = ({ assignment, index, assignmentList }) => {
  const [answer, setAnswer] = useState("");
  const [displayAnswers, toggleDisplayAnswers] = useState(false);
  const { currentUser } = useAuthContext();
  const { classroomState, updateAssignmentList } = useClassroomContext();

  var submissionListStyle =
    displayAnswers === false
      ? "bg-grey-200 transition-all duration-200 origin-top transform scale-y-0 max-h-0"
      : "bg-grey-200 transition-all duration-200 origin-top transform scale-y-1";

  function getToday() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0");
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function addAnswer() {
    if (answer.trim() !== "") {
      var newAnswer = {
        text: answer,
        answeredBy: currentUser.displayName,
        submissionDate: getToday(),
      };
      const response = firebase
        .firestore()
        .collection("users")
        .doc(currentUser.uid);
      response.get().then((snapshot) => {
        var submissions = [];
        var allAssignments = assignmentList;
        submissions = assignment.answers;
        submissions.push(newAnswer);
        var updatedAssignment = {
          text: assignment.text,
          link: assignment.link,
          author: assignment.author,
          due: assignment.due,
          answers: submissions,
        };

        allAssignments = allAssignments.map((a) => {
          if (a.text === assignment.text) {
            return updatedAssignment;
          }
          return a;
        });

        updateAssignmentList(allAssignments);

        response.update({
          assignments: allAssignments,
        });

        const res = firebase
          .firestore()
          .collection("users")
          .where("displayName", "==", assignment.author);
        res.get().then((snapshot) => {
          snapshot.docs.forEach((doc) => {
            doc.ref.update({
              assignments: allAssignments,
            });
          });
        });

        setAnswer("");
      });
    } else {
      window.alert("You have to write something in the answer field");
    }
  }

  return (
    <div className="flex flex-col overflow-auto border border-grey-900 md:mr-8 mr-0 mt-2 p-4">
      <div className="flex md:flex-row flex-col justify-between md:items-center items-start">
        <div className="font-bold text-lg">{assignment.text}</div>
        <div className="font-bold text-xs">Due date: {assignment.due}</div>
      </div>
      <div className="text-xs">by: {assignment.author}</div>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="mt-4 text-sm focus:outline-none"
        placeholder="Type your answer here..."
      ></textarea>
      <div className="flex flex-row justify-end mt-2">
        <button
          onClick={addAnswer}
          className="bg-grey-900 px-4 py-2 text-white font-bold"
        >
          Submit
        </button>
      </div>

      {classroomState.isTeacher ? (
        <div className="flex flex-col mt-4 overflow-y-hidden">
          <button
            onClick={(e) => toggleDisplayAnswers(!displayAnswers)}
            className="flex flex-row justify-between items-center focus:outline-none"
          >
            <div className="">Submissions</div>
            <button
              onClick={(e) => toggleDisplayAnswers(!displayAnswers)}
              className="text-xl"
            >
              <RiArrowDropDownFill />
            </button>
          </button>
          <div className={submissionListStyle}>
            {assignment.answers.map((answer) => {
              return (
                <div className="flex flex-col my-2 mx-2">
                  <div className="flex flex-row justify-between items-center">
                    <div className="">{answer.text}</div>
                    <div className="text-xs font-semibold">
                      {answer.submissionDate}
                    </div>
                  </div>
                  <div className="text-xs font-semibold">
                    {answer.answeredBy}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default AssignmentTile;
