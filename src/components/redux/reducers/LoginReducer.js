import Reactotron from 'reactotron-react-native';

const initialState = {
    loginSuccess: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "SUCCESS_LOGIN":
            Reactotron.log("Success Reducer");
           return {...state, loginSuccess: action.payload};
        case "FAILED_LOGIN":
            Reactotron.log("Failed Reducer");
            return {...state, loginSuccess: false};
        default:
            return state;
    }
} ;