import React, { useEffect } from 'react'
import './calendar.css';
import {connect} from 'react-redux'
import { RootState } from '../../redux/store';

import { selectUserEventsArray, loadUserEvents, UserEvent } from '../../redux/user-events';

interface StateProps {
  events: UserEvent[];
  loadUserEvents: () => void;
}

//Extract the type of the props from the connector using the predefined ConnectedProps
//ConnectedProps - Infers the type of props that a connector will inject into a component.
//type StateProps = ConnectedProps<typeof connector>;

interface Props extends StateProps {

}

//We have encapsulated the logic of selecting the part of the state required for this component in a selector 'selectUserEventsArray'

const mapStateToProps = (state: RootState) => {
  return {
    events: selectUserEventsArray(state)
  }
}

//This is the thunk action which has the logic of making an async request and then dispatchig the actual payload to the store
const mapDispatchToProps = {
  loadUserEvents
}

// The connect function's split into 2 instead of the currying syntax
const connector = connect(mapStateToProps, mapDispatchToProps);

  const Calendar: React.FC<Props> = ({events, loadUserEvents}) => {

    //Call the thunk action on initial mount of component
    useEffect(()=>{
      loadUserEvents();
    },[]);
    console.log('events:', events)    
    return (
      <div className="calendar">
        <div className="calendar-day">
          <div className="calendar-day-label">
            <span>1 February</span>
          </div>
          <div className="calendar-events">
            <div className="calendar-event">
              <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">Learning TypeScript</div>
              </div>
              <button className="calendar-event-delete-button">&times;</button>
            </div>
          </div>
        </div>
        <div className="calendar-day">
          <div className="calendar-day-label">
            <span>2 February</span>
          </div>
          <div className="calendar-events">
            <div className="calendar-event">
              <div className="calendar-event-info">
                <div className="calendar-event-time">10:00 - 12:00</div>
                <div className="calendar-event-title">Learning TypeScript</div>
              </div>
              <button className="calendar-event-delete-button">&times;</button>
            </div>
          </div>
        </div>
      </div>
    );
}

//The final export will be a component which is connected to the redux store with complete capability to read and write
export default connector(Calendar);