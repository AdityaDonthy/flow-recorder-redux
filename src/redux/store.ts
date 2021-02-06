import {applyMiddleware, combineReducers, createStore} from 'redux';
import recorderReducer from './recorder';
import userEventsReducer from './user-events';
import thunk from 'redux-thunk';

//For each part of the state, calls the relevant reducers.
const rootReducer = combineReducers({
    userEvents: userEventsReducer,
    recorder: recorderReducer
})

//get the type of the rootReducer
export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;