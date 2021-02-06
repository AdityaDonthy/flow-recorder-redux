import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectStartDate,
  StartRecorder,
  StopRecorder,
} from "./../../redux/recorder";
import cx from "classnames";
import "./Recorder.css";

const addZero = (num: number) => {
  if (num < 10) return `0${num}`;
  return num;
};
function Recorder() {
  const dispatch = useDispatch();
  //huge -> I'm accessing a selector function written in my redux duck and passing it to the redux's useSelector
  // Redux's useSelector will inturn call the passed in selector with the global state and the selector selects the specific state object from the state tree
  // It's used to read/select the specific part of the state tree
  // useSelector() will also subscribe to the Redux store, and run your selector whenever an action is dispatched.
  // So I dispatch an action , state changes, useSelector is subscribed to the store, so it's run again and the component is
  //re rendered. This is exactly like the connect HOC. Every click essentially re renders, the component.
  const startDate = useSelector(selectStartDate);
  const started = startDate !== "";

  //hold the handle for async operation and this should not change between renders. We should preserve the value once assigned
  let interval = useRef<number>(0);

  //We don't need to maintain the counter state but, to just re render the component each second
  const [, setCount] = useState(0);

  const handleClick = () => {
    if (started) {
      window.clearInterval(interval.current);
      dispatch(StopRecorder());
    } else {
      dispatch(StartRecorder());
      interval.current = window.setInterval(() => {
        setCount((prevCount) => prevCount + 1);
      }, 1000);
    }
  };

  //runs only once which sets up a listener to unmount event
  useEffect(() => {
    return () => {
      window.clearInterval(interval.current);
    };
  }, []);

  //Get the time difference in seconds for the current render
  let totalSeconds = started
    ? Math.floor(Date.now() - new Date(startDate).getTime()) / 1000
    : 0;
  let hours = totalSeconds ? Math.floor(totalSeconds / 60 / 60) : 0;

  //update the number of seconds factored in the hours
  let seconds = Math.floor(totalSeconds - hours * 60 * 60);
  const minutes = seconds ? Math.floor(seconds / 60) : 0;
  //update the number of seconds factored in the minutes
  seconds = seconds - minutes * 60;

  return (
    <div className={cx("recorder", { "recorder-started": started })}>
      <button className="record-button" onClick={handleClick}>
        <span></span>
      </button>
      <div className="recorder-counter">
        {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
    </div>
  );
}

export default Recorder;
