const initialState = {
    userReg: null
};

export default (state = initialState, action) => {
    switch (action.type) {
        case "REGISTRATION_SUCCESSFUL":
            return {...state, userReg: action.payload};
        case "REGISTRATION_FAILED":
            return {...state, userReg: action.payload};
        case "FAILED_AUTH":
            return {...state, userReg: action.payload};
        case "FAILED_UPLOAD":
            return {...state, userReg: action.payload};
        default:
            return state;
    }
};