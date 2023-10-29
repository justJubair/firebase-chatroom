import "./App.css";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import auth from "./firebase/firebase.config";
import { useEffect } from "react";
import { useState } from "react";
function App() {
  const [user, setUser] = useState({});
  //  sign in with google
  const googleProvider = new GoogleAuthProvider();
  const handleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // sign out
  const handleSignOut = () => {
    signOut(auth)
      .then()
      .catch((error) => {
        console.log(error);
      });
  };

  // setup a observer for user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      return () => {
        unsubscribe();
      };
    });
  }, []);


  // ChatRoom component
  const ChatRoom = () => {
    return(
      <div>
         <p> HELLO I Am App </p>
      </div>
    )}
 
    //Sign in component
    const SignIn = () => {
      return(
        <>
          
            <button className="sign-in" onClick={handleSignIn}>Sign in</button>
        </>
      )}
   
  return (
    <>
      <div className="App">
        <header>
          <h1>Chity-Chat</h1>
          {
            user &&  <button className="sign-out" onClick={handleSignOut}>Sign out</button>
          }
        </header>
        

       <section>
        {user ? <ChatRoom/> : <SignIn/>}
       </section>
      </div>
    </>
  );
}

export default App;
