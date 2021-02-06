import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "./store";
import {firestore} from './../firestore';

const LOAD_REQUEST = "userEvents/load-request";
const LOAD_SUCCESS = 'userEvents/load-success';
export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}

interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
    payload: {
        events: UserEvent[];
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
  action: LoadSuccessAction
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
    default:
      return state;
  }
};

export default userEventsReducer;
