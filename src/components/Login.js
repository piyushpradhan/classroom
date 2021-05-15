import React, { useState, useContext, useEffect } from "react";
import firebase from "../firebase/firebase";
import { useAuthContext } from "../context/AuthContext";
import { LOGIN } from "../constants/actionTypes";
import { useHistory } from "react-router-dom";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();

  const { currentUser, setCurrentUser } = useAuthContext();

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
        });
      }
    });
  }

  const login = async (e) => {
    e.preventDefault();
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response.user);
        setCurrentUser(response.user);
        history.push("/dashboard");
      });
  };

  const loginWithGoogle = async (e) => {
    e.preventDefault();
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        let provider = new firebase.auth.GoogleAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            let credential = result.credential;
            let token = credential.accessToken;
            console.log(result.user);
            setCurrentUser(result.user);

            storeUserDetails(result.user);

            history.push("/dashboard");
          })
          .catch((err) => {
            var code = err.code;
            var errorMessgae = err.message;
          });
      });
  };

  return (
    <div className="flex flex-col h-screen justify-center">
      <form
        onSubmit={login}
        className="bg-white form rounded-xl border border-black px-8 pt-6 pb-10 w-5/12 max-w-lg min-w-min self-center"
      >
        <p className="font-bold text-4xl text-center mb-2">Classroom</p>
        <p className="text-md text-center mb-4">Please login to continue.</p>
        <div className="flex flex-col text-sm">
          <div className="flex flex-row justify-start">
            <label className="text-lg font-bold mb-2">Email</label>
          </div>
          <input
            className="border border-black rounded-md p-3 mb-4 focus:outline-none"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />

          <div className="flex flex-row justify-start">
            <label className="text-lg font-bold mb-2">Password</label>
          </div>
          <input
            className="border border-black rounded-md p-3 mb-6 focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className="relative w-full" role="button">
            <div className="absolute bg-grey-900 w-full h-full -right-1 -bottom-1"></div>
            <div className="relative bg-white space-y-7">
              <input
                type="submit"
                value="Login"
                className="w-full items-center justify-center uppercase border border-black p-2 text-md font-bold"
              />
            </div>
          </div>

          <div className="flex flex-row w-full bg-blue align-center mt-6">
            <div className="bg-white p-0 m-1">
              <img
                src="/images/google_logo.png"
                height={36}
                width={36}
                alt="Google Logo"
              />
            </div>
            <button
              type="button"
              value="Sign in with Google"
              onClick={loginWithGoogle}
              className="w-full bg-blue text-md font-bold text-white focus:outline-none"
            >
              Continue with Google
            </button>
          </div>
          {/* <div className="text-grey-900 text-md text-center font-semibold mt-2">
            Don't have an account?{" "}
            <a href="/auth/register">
              <span className="text-blue">Create one!</span>
            </a>
          </div> */}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
