import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { deleteUserEvent, UserEvent } from '../../redux/user-events';
import moment from "moment";

interface Props{
  event: UserEvent
}

const EventItem: React.FC<Props> = ({event}) => {
  const dispatch = useDispatch();
  const handleDeleteClick = () => {
    dispatch(deleteUserEvent(event.id))
  }
  return (
    <div key={event.id} className="calendar-event">
      <div className="calendar-event-info">
        <div className="calendar-event-time">
          {moment.utc(event.startDate).format("HH:mm:ss")} -{" "}
          {moment.utc(event.endDate).format("HH:mm:ss")}
        </div>
        <div className="calendar-event-title">{event.title}</div>
      </div>
      <button className="calendar-event-delete-button" onClick={handleDeleteClick}>
        &times;
      </button>
    </div>
  );
};

export default EventItem;
