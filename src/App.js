import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

firebase.initializeApp(firebaseConfig);


function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
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
        error: '',
        success: '',
        photo: ''
      }
      setUser(signedOutUser);
    })
  }

  
  const handleBlur = (e) =>{
    //console.log(e.target.name, e.target.value);
    let isFieldValid = true ;
    if (e.target.name === 'email'){
      isFieldValid = /\S+@\S+\.\S+/ .test(e.target.value);
      
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHasNumber;
    }
    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo [e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  function success(){
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
  }
  function error() {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success = false;
    setUser(newUserInfo);
  }
  const handleSubmit = (e) => {
    //console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        success();
      })
      .catch(error => {
        // Handle Errors here.
        error();
        // ...
      });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        success();
      })
      .catch(function(error) {
        error();
      });
    }
    e.preventDefault();
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
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User? Sign Up</label>
      <form onSubmit = {handleSubmit}>
        {newUser && <input type="text" name="name" onBlur = {handleBlur} placeholder = "Your Name" />}
        <br/>
        <input type="text" name = "email" placeholder = "Email Address" onBlur = {handleBlur} required/>
        <br/>
        <input type="password" name="password" placeholder = "Password" onBlur = {handleBlur} required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'}/>
      </form>
      <p style = {{color: 'red'}}>{user.error}</p>
      {user.success && <p style = {{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}

export default App;
