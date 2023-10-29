import "./App.css";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import PropTypes from "prop-types";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useEffect, useRef } from "react";
import { useState } from "react";
import auth, { app } from "./firebase/firebase.config";
import { addDoc, collection, getFirestore, limit, orderBy, query, serverTimestamp } from "firebase/firestore";
import logo from "./assets/logo.png"

const firestore = getFirestore(app)
// const analytics = getAnalytics(app)
function App() {
  const [user, setUser] = useState({});
  //  sign in with google
  const googleProvider = new GoogleAuthProvider();
  const handleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(() => {
        
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
    const dummy = useRef()
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, orderBy('createdAt'), limit(25));
  
    const [messages] = useCollectionData(q, { idField: 'id' });
    const [formValue, setFormValue] = useState('')

    const sendMessage = async(e)=>{
      e.preventDefault()
      const {uid, photoURL} = auth.currentUser;
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL
      })
      setFormValue("")
      dummy.current.scrollIntoView({behavior: "smooth"})
    }

    return(
      <div>
       <main>
       {messages && messages.map((msg, index)=> <ChatMessage key={index} message={msg}/>)}
       <span ref={dummy} ></span>
       </main>

         <form onSubmit={sendMessage}>
          <input value={formValue} onChange={e=> setFormValue(e.target.value)} type="text" name="message" id="message" />
          <button type="submit">Send</button>
         </form>
      </div>
    )}

    // ChatMessage Component
    const ChatMessage = ({message}) => {
        const {text, uid, photoURL}  = message
     const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

      return(
       <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="" />
        <p>{text}</p>
       </div>
      )}
      ChatMessage.propTypes={
        message:PropTypes.object
      }
 
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
         <div className="logo-title">
          <img className="logo" src={logo} alt="" />
         <h3 className="brand-title">Thought Bite</h3>
         </div>
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
