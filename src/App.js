import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);


function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email} = res.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
    })
    .catch(error => {
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignedOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: ''
      }
      setUser(signedOutUser);
    })
  }

  const handleSubmit = () => {

  }
  const handleBlur = (e) =>{
    console.log(e.target.name, e.target.value);
  }
  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick ={handleSignedOut}>Sign out</button> : 
        <button onClick ={handleSignIn}>Sign in</button>
      }
      {
        user.isSignedIn && 
        <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our Own Authentication</h1>
      <form onSubmit = {handleSubmit}>
        <input type="text" name = "email" placeholder = "Email Address" onBlur= {handleBlur}/>
        <br/>
        <input type="password" name="password" placeholder = "Password" onBlur = {handleBlur}/>
        <br/>
        <input type="submit" value="submit"/>
      </form>

    </div>
  );
}

export default App;
