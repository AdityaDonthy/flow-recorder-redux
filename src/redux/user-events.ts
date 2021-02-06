import { AnyAction } from "redux";

interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
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

const userEventsReducer = (
  state: UserEventsState = initialState,
  action: AnyAction
) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default userEventsReducer;
