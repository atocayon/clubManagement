import firebase from 'react-native-firebase';
import React from "react";
import {Alert} from 'react-native';
import Reactotron from 'reactotron-react-native';
export const login = (email, password) => async dispatch => {

    firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            dispatch({type: "SUCCESS_LOGIN", payload: email});
        })
        .catch(err => {
            dispatch({type: "FAILED_LOGIN", payload: false});
        });
};