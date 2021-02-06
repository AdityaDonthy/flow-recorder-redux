import { Action, AnyAction } from "redux";
import { RootState } from "./store";

/* According to the Ducks proposal, A module…
1. MUST export default a function called reducer()
2. MUST export its action creators as functions
3. MUST have action types in the form npm-module-or-app/reducer/ACTION_TYPE
4. MAY export its action types as UPPER_SNAKE_CASE, if an external reducer needs to listen for them, or if it is a published reusable library
*/

interface RecorderState{
    dateStart: string
}

const START = 'Start-Recorder'
const STOP = 'Stop-Recorder'

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

//An action creator which creates an action object and returns it. Usually an action creator accepts a payload and uses it in construction
export const StartRecorder = (): StartAction => {
    return {
        type: 'Start-Recorder' 
    }
}

export const StopRecorder = (): StopAction => {
    return {
        type: 'Stop-Recorder'
    };
}

const initialState: RecorderState = {
    //Empty indicates Stopped state
    dateStart: ''
}

//Selectors 
//useSelector hook Signature: const result: any = useSelector(selector: Function, equalityFn?: Function)
//useSelector takes a function as an argument and the signature of function is (state: TState) => TSelected . 
//It takes in the state(passed by useSelector) and returns the specific piece of state.So it's very similar to the mapStateToProps(). 
//The return value of this selector will be used as the return value of the useSelector() hook in a component.

export const selectStartDate = (rootState: RootState) => {
    return rootState.recorder.dateStart
}

//Another selector to select the whole recorder piece/object of the state tree
export const selectRecorder = (rootState: RootState) => {
    return rootState.recorder
}

//reducer
const recorderReducer = (state: RecorderState = initialState, action: StartAction | StopAction) => {
    switch(action.type){
        case START:
            return {...state, dateStart: new Date().toISOString()}
        case STOP:
        return {...state, dateStart: ''}
        default: 
            return state;
    }
}

export default recorderReducer;