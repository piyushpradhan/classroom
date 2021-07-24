import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import firebase from "../firebase/firebase";
import "../public/css/login.css";

function LoginForm() {
  const history = useHistory();

  const { setCurrentUser } = useAuthContext();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return unsubscribe();
  }, []);

  function storeUserDetails(user) {
    const firestore = firebase.firestore();
    const docRef = firestore.collection("users").doc(user.uid);
    docRef.get().then((snapshot) => {
      if (!snapshot.exists) {
        docRef.set({
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          attendanceData: {},
          events: [],
          todos: [],
          teachers: [user.email],
          assignments: [],
          announcements: [],
          isTeacher: false,
        });
      }
    });
  }

  const loginWithGoogle = (e) => {
    e.preventDefault();
    firebase
      .auth()
      .setPersistence("session")
      .then(() => {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            setCurrentUser(result.user);

            storeUserDetails(result.user);
            // localStorage.setItem(
            //   "authenticatedUser",
            //   JSON.stringify(result.user)
            // );
            history.push("/dashboard");
          })
          .catch((err) => {
            var code = err.code;
            var errorMessage = err.message;
            console.log(code + errorMessage);
          });
      });
  };

  return (
    <div className="parent-login-container flex flex-col h-screen w-screen justify-center items-center">
      <div className="w-screen h-screen bg-white opacity-70 absolute z=0"></div>
      <div className="bg-white rounded-xl border-2 border-black p-8 flex flex-col z-10">
        <p className="font-bold text-4xl text-center mb-2">Classroom</p>
        <p className="text-md text-center mb-4">Please login to continue.</p>
        <button
          onClick={loginWithGoogle}
          className="flex flex-row max-w-max border border-black rounded rounded-full justify-start items-center mt-6 focus:outline-none"
        >
          <img
            className="m-1 max-w-max"
            src="/images/google-login.png"
            alt="Google Logo"
          />
          <div className="flex-grow-1 flex flex=row justify-center">
            <div className="w-full px-4 text-md font-bold focus:outline-none">
              Continue with Google
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
