import {combineReducers} from 'redux';
import LoginReducer from './LoginReducer';
import Reactotron from 'reactotron-react-native';
import RegistrationReducer from './RegistrationReducer';

export default combineReducers({
   login: LoginReducer,
   reg: RegistrationReducer
});
