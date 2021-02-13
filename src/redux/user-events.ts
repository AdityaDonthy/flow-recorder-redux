import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import {firestore} from './../firestore';
import { selectStartDate } from "./recorder";

const LOAD_REQUEST = "userEvents/load-request";
const LOAD_SUCCESS = 'userEvents/load-success';

const CREATE_EVENT_REQUEST = 'userEvents/create-event'
const CREATE_EVENT_SUCCESS = 'userEvents/create-success'
const CREATE_EVENT_FAILURE = 'userEvents/create-failure'

function getRandomNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
export interface UserEvent {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[];
    }
}

interface CreateEventRequestAction extends Action<typeof CREATE_EVENT_REQUEST>{
}

interface CreateEventFailureAction extends Action<typeof CREATE_EVENT_FAILURE>{
    payload: {
        error: string
    }
}
interface CreateEventSuccessAction extends Action<typeof CREATE_EVENT_SUCCESS> {
    payload: {
        event: UserEvent
    } 
}

export const loadUserEvents = (): ThunkAction<
  void,
  RootState,
  undefined,
  LoadRequestAction | LoadSuccessAction
> => (dispatch, getState) => {
    dispatch({
        type: LOAD_REQUEST
    })
    console.log('state:', getState());
    const events: UserEvent[] = [];
    firestore.collection("events").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log(`state:`, getState());
            console.log(doc.data())
            events.push(doc.data() as UserEvent)
        });

        dispatch({
            type: LOAD_SUCCESS,
            payload: {events}
        })
    });
};

export const createUserEvent = (): ThunkAction<
Promise<void>,
RootState,
undefined,
CreateEventRequestAction | CreateEventSuccessAction | CreateEventFailureAction
> => async (dispatch , getState) => {
    dispatch({
        type: CREATE_EVENT_REQUEST
    })
    console.log(getState);

    try {
            //We first need to fetch the startDate value to create an event. Remember this is in the different part of the state
            //Now this part of the state tree should get a value from that part of the state tree. So we use a selector function defined in the other duck
            //Because of the fact that a connected component is always in sync with the redux store, we can fetch this value directly from the store and be 
            //assured that the timeStamp fetched is accurate.
        
            const startDate = selectStartDate(getState());
            //Construct the event object and define it's type
            //I need a a type which is a transformation of type UserEvent but omitting the id property. I don't ant to take the responsibility 
            //of creating an id. A Higher Order Type ?
            const event: UserEvent = {
              id: getRandomNumber(1, 10000),
              title: 'Edit me ..',
              startDate,
              endDate: new Date().toISOString()
            };
            
            var eventsRef = firestore.collection("events");
            var doc = await eventsRef.add(event);

            //Dispatch the action to the store and pass the action object in the payload
            //reducer will add it and notify the subscribers, so the UI can render it
            dispatch({
              type: CREATE_EVENT_SUCCESS, // add this ti signature else the compiler yells
              payload: {event}
            })
            }catch(e){
              dispatch(
                  {
                    type: CREATE_EVENT_FAILURE,
                    payload: { error: 'Unable to create, Try again' }
                  }
              )
          }
}

interface UserEventsState {
  //maintain  a dictionary of the id from the UserEvent object and the actual UserEvent Object
  // Another way of wriring this is Record<number, UserEvent>; The advantage is if the type of id changed , TS will infer this !
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: number[];
  //allIds: UserEvent['id'][]
}

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

//These are the 2 selectors which return the specific parts of the state. 
//These are called fron the mapStateToProps which passes in the Root state
//This selector returns the Events part of the State
const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

//This selector returns the Events array in the Events part of the state
export const selectUserEventsArray = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map(id => state.byIds[id]);
};

const userEventsReducer = (
  state: UserEventsState = initialState,
  action: LoadSuccessAction | CreateEventSuccessAction 
) => {
  switch (action.type) {
    case LOAD_SUCCESS: 
    const {events} = action.payload
    console.log(events)
    return {
        ...state,
        allIds: events.map( e => e.id ),
        byIds: events.reduce<UserEventsState['byIds']>((byIds, event) => {
            byIds[event.id] = event;
            return byIds;
        },{})
    }
    case CREATE_EVENT_SUCCESS: 
    const {event} = action.payload
    // return the new state by adding the event created to the global state by doing an immutable update
    return {
            ...state,
            allIds: [...state.allIds, event.id],
            byIds: {...state.byIds, [event.id]: event}
        }
    // case DELETE_SUCCESS:
    //     const { id } = action.payload;
    //     //A bit of a circus to delete the event
    //     const newState = {
    //         ...state,
    //         byIds: { ...state.byIds },
    //         allIds: state.allIds.filter(storedId => storedId !== id)
    //     };
    //     delete newState.byIds[id];
    default:
      return state;
  }
};

export default userEventsReducer;
