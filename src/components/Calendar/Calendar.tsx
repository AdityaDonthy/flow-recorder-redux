import React, { useEffect } from "react";

import "./calendar.css";
import { connect } from "react-redux";
import { RootState } from "../../redux/store";

import {
  selectUserEventsArray,
  loadUserEvents,
  UserEvent,
} from "../../redux/user-events";
import EventItem from "./EventItem";

interface StateProps {
  events: UserEvent[];
  loadUserEvents: () => void;
}

//Extract the type of the props from the connector using the predefined ConnectedProps
//ConnectedProps - Infers the type of props that a connector will inject into a component.
//type StateProps = ConnectedProps<typeof connector>;

interface Props extends StateProps {}

//We have encapsulated the logic of selecting the part of the state required for this component in a selector 'selectUserEventsArray'

const mapStateToProps = (state: RootState) => {
  return {
    events: selectUserEventsArray(state),
  };
};

//This is the thunk action which has the logic of making an async request and then dispatchig the actual payload to the store
const mapDispatchToProps = {
  loadUserEvents,
};

const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const createDateKey = (date: Date) => {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  return `${year}-${addZero(month)}-${addZero(day)}`;
};

//Logic to group events by the day
const groupEventsByDay = (events: UserEvent[]) => {
  //A dictionary of string and object
  const groups: Record<string, UserEvent[]> = {};

  const addToGroup = (dateKey: string, event: UserEvent) => {
    if (groups[dateKey] === undefined) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(event);
  };

  events.forEach((event) => {
    const dateStartKey = createDateKey(new Date(event.startDate));
    const dateEndKey = createDateKey(new Date(event.endDate));

    addToGroup(dateStartKey, event);

    //ends on a different date
    if (dateEndKey !== dateStartKey) {
      addToGroup(dateEndKey, event);
    }
  });

  return groups;
};

// The connect function's split into 2 instead of the currying syntax
const connector = connect(mapStateToProps, mapDispatchToProps);

const Calendar: React.FC<Props> = ({ events, loadUserEvents }) => {
  //Call the thunk action on initial mount of component
  useEffect(() => {
    loadUserEvents();
  }, []);

  let groupedEvents: ReturnType<typeof groupEventsByDay> | undefined;
  let sortedGroupKeys: string[] | undefined;

  if (events.length) {
    groupedEvents = groupEventsByDay(events);
    sortedGroupKeys = Object.keys(groupedEvents).sort(
      (date1, date2) => +new Date(date2) - +new Date(date1)
    );
  }

  return groupedEvents && sortedGroupKeys ? (
    <div className="calendar-container">
      {sortedGroupKeys.map((dayKey) => {
        const events = groupedEvents ? groupedEvents[dayKey] : [];
        const groupDate = new Date(dayKey);
        const day = groupDate.getDate();
        const month = groupDate.toLocaleString(undefined, { month: "long" });

        return (
          <div className="calendar-day">
            <div className="calendar-day-label">
              <span>
                {day} {month}
              </span>
            </div>
            <div className="calendar-events">
              {events.map((event) => {
                return <EventItem key={event.id} event={event} />
              })}
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>Loading...</div>
  );
};

//The final export will be a component which is connected to the redux store with complete capability to read and write
export default connector(Calendar);
