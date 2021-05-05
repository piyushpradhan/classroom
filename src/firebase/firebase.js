import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const clientCredentials = {
  apiKey: "AIzaSyBAbQTcnfmXZXpnsgsuPaVltchNYUEZWEg",
  authDomain: "classroom-3b721.firebaseapp.com",
  projectId: "classroom-3b721",
  storageBucket: "classroom-3b721.appspot.com",
  messagingSenderId: "525321947242",
  appId: "1:525321947242:web:60b0fd6c50912179eda213",
  measurementId: "G-N62F5VNJLW",
};

if (!firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
  // firebase.analytics();
}

export default firebase;
