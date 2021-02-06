import React from 'react';
import './App.css';
import Calendar from './Calendar';
import Recorder from './Recorder/Recorder';

function App() {
  return (
    <div className="App">
      <Recorder />
      <Calendar />
    </div>
  );
}

export default App;
