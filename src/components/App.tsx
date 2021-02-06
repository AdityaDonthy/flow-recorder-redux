import React from 'react';
import './App.css';
import Calendar from './Calendar';
import Recorder from './Recorder/Recorder';
import firebase from './../firestore'

function App() {
  console.log(firebase)
  return (
    <div className="App">
      <Recorder />
      <Calendar />
    </div>
  );
}

export default App;
