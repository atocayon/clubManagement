import firebase from "react-native-firebase";
import Reactotron from 'reactotron-react-native';

export const registration = (name, address, email, password, profileImage) => async (dispatch, getState) => {
    const sessionId = new Date().getTime();
    let file = profileImage.path;
    let userData = {
      name: name,
      address: address,
      email: email,
      password: password
    };
    firebase
        .storage()
        .ref("user", file)
        .child(`${sessionId}.${profileImage.mime}`)
        .putFile(file)
        .then(url => {
            userData.profileImage = url;
            firebase
                .auth()
                .createUserWithEmailAndPassword(email, password)
                .then(userKey => {
                    userData.userID = userKey.user.uid;
                    firebase
                        .firestore()
                        .collection("users")
                        .doc(userData.userID)
                        .set(userData)
                        .then((data) => {
                            dispatch({type: "REGISTRATION_SUCCESSFUL", payload: true});
                        }).catch((err)=>{
                            dispatch({type: "REGISTRATION_FAILED", payload: false});
                    });
                }).catch((err)=>{
                    dispatch({type: "FAILED_AUTH", payload: false});
            });
        }).catch(()=>{
            dispatch({type: "FAILED_UPLOAD", payload: false});
        }
    );
};