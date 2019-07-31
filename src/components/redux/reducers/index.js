import {combineReducers} from 'redux';
import LoginReducer from './LoginReducer';
export default combineReducers({
   login: LoginReducer
});


//console.log(store.getState());
//{login: []}