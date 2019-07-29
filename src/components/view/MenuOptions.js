import React, { Component } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import {
  StyleProvider,
  Container,
  Card,
  CardItem,
  Title,
  Body,
    Subtitle
} from "native-base";
import firebase from "react-native-firebase";
import { withNavigation } from "react-navigation";

class MenuOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uid: "",
      name: "",
      email: "",
      address: "",
      profileImage: "",
      loading: false
    };
  }

  componentDidMount() {
    const { uid } = this.props;
    this.setState({ loading: true });
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(uid);
    console.log("Database Check: >>>>>" + ref);
    ref.get().then(doc => {
      if (doc.exists) {
        const userInfo = doc.data();
        this.setState({
          uid: userInfo.userID,
          name: userInfo.name,
          email: userInfo.email,
          address: userInfo.address,
          profileImage: userInfo.profileImage,
          loading: false
        });
      } else {
        console.log("No Document");
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 100 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <CardItem bordered>
            <Image
              source={{ uri: this.state.profileImage }}
              style={{ height: 50, width: 50, borderRadius: 100 }}
            />
            <View>
              <Title style={{ marginLeft: 30 }}>{this.state.name}</Title>
              <Subtitle>View Profile</Subtitle>
            </View>


          </CardItem>

          <CardItem bordered>
            <Subtitle
              onPress={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(() => {
                    this.props.navigation.navigate("loginRoute");
                  });
              }}
            >
              Logout
            </Subtitle>
          </CardItem>
        </Container>
      </StyleProvider>
    );
  }
}

export default withNavigation(MenuOptions);
