import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity
} from "react-native";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import {
  StyleProvider,
  Container,
  Card,
  CardItem,
  Title,
  Body,
  Icon,
  Button,
  InputGroup,
  Modal
} from "native-base";
import firebase from "react-native-firebase";

export default class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.fetchData = firebase.firestore().collection("users");
    this.unsubscribe = null;
    this.state = {
      userInfo: [],
      loading: true,
      uid: "",
      name: "",
      email: "",
      address: "",
      profileImage: ""
    };
  }

  onCollectionUpdate = querySnapshot => {
    const userInfo = [];
    querySnapshot.forEach(doc => {
      const { name, address, email, profileImage } = doc.data();
      userInfo.push({
        key: doc.id,
        doc, // DocumentSnapshot
        name,
        address,
        email,
        profileImage
      });
    });
    this.setState({
      userInfo,
      loading: false
    });
  };

  componentDidMount() {
    const { uid } = this.props;
    this.unsubscribe = this.fetchData.onSnapshot(this.onCollectionUpdate);

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
        console.log(
          "==============================UserInfo============================="
        );
        console.log(userInfo);
      } else {
        console.log("No Document");
      }
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 150 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <TouchableOpacity style={{ flexDirection: "row", padding: 20 }}>
            <Image
              source={{ uri: this.state.profileImage }}
              style={{ height: 50, width: 50, borderRadius: 100 }}
            />

            <Title style={{ marginTop: 20, marginLeft: 20 }}>
              {" "}
              Post Something ....
            </Title>
          </TouchableOpacity>

          <FlatList
            data={this.state.userInfo}
            renderItem={({ item, index }) => {
              return (
                <Card>
                  <CardItem header>
                    <Image
                      source={{ uri: item.profileImage }}
                      style={{ width: 40, height: 40, borderRadius: 100 }}
                    />
                    <Text style={{ marginLeft: 10 }}>{item.name}</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>//Your text here</Text>
                    </Body>
                  </CardItem>
                  <CardItem footer>
                    <Text>GeekyAnts</Text>
                  </CardItem>
                </Card>
              );
            }}
          />
        </Container>
      </StyleProvider>
    );
  }
}
