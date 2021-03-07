import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserEvent, updateUserEvent, UserEvent } from '../../redux/user-events';
import moment from "moment";

interface Props{
  event: UserEvent
}

const EventItem: React.FC<Props> = ({event}) => {
  const dispatch = useDispatch();
    //We need to maintain a local state to check if ween to show a textvox instead of a div
    const [editable, setEditable] = useState(false)

    //To get the focus on the text element when user clicks the event title, we need to retain the reference of the element
    //we use the useRef hook provided by React to store the reference to the input element
  
    const inputRef = useRef<HTMLInputElement>(null);
  
    //Since onFocus is a side effect , we need to change that in a side effect. 
    //If editable is true, then we set the focus on the input element in the side effect.
    useEffect(()=>{
        if(editable){
            inputRef.current?.focus()
        }
    }, [editable]);

  const handleDeleteClick = () => {
    dispatch(deleteUserEvent(event.id))
  }

  const [title, setTitle] = useState(event.title)
  const handleTitleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }
 
  const handleTitleClick = () => {
    setEditable(!editable); 
  }
  
  const handleTitleBlur = (e:React.FocusEvent<HTMLInputElement>) => {
    setEditable(false)
    if(title !== event.title)
        dispatch(updateUserEvent({
            ...event,
            title
        }))
  }

  const startTime: moment.Moment = moment.utc(event.startDate);
  const endTime: moment.Moment = moment.utc(event.endDate);

  return (
    <div key={event.id} className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">
          {startTime.format("HH:mm")} -{" "}
          {startTime.format("HH:mm")}
        </div>
        <div className="calendar-event-total-time">
          {`${moment.duration(endTime.diff(startTime)).asMinutes().toString().substring(0,4)} minutes`}
        </div>
        <div className="calendar-event-title">
        {editable ? (<input type="text" 
                            value={title} 
                            ref={inputRef} 
                            onChange={handleTitleChange}
                            onBlur={handleTitleBlur}
                            className="calendar-title-input"/>)
                      :(<span onClick={handleTitleClick}>{title}</span>)
            }
        </div>
      </div>
      <button className="calendar-event-delete-button" onClick={handleDeleteClick}>
        &times;
      </button>
    </div>
  );
};

export default EventItem;
