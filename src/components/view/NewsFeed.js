import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
    TextInput
} from "react-native";
import { withNavigation } from "react-navigation";
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
  Modal,
    Badge,
    Input,
    Item,
    Subtitle
} from "native-base";
import firebase from "react-native-firebase";

class NewsFeed extends Component {
  constructor(props) {
    super(props);
    this.fetchData = firebase.firestore().collection("newsFeed");
    this.unsubscribe = null;
    this.state = {
      userInfo: [],
      loading: true,
      uid: "",
      name: "",
      email: "",
      address: ""
    };
  }

  //Fetch Data for the News Feed
  onCollectionUpdate = querySnapshot => {
    const userInfo = [];
    querySnapshot.forEach(doc => {
      const {
        idUserPosted,
        nameUserPosted,
        profileUserPosted,
        addedFile,
        addedFeelings,
        addedLocation,
        postedText,
        tagPeopleID,
        tagPeopleName
      } = doc.data();
      userInfo.push({
        key: doc.id,
        doc, // DocumentSnapshot
        idUserPosted,
        nameUserPosted,
        profileUserPosted,
        addedFile,
        addedFeelings,
        addedLocation,
        postedText,
        tagPeopleID,
        tagPeopleName
      });
    });
    this.setState({
      userInfo,
      loading: true
    });
  };

  //Fetch the data of Current User
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
        <Container style={{ padding: 10 }}>
          <TouchableOpacity
            style={{ flexDirection: "row", padding: 20 }}
            onPress={() => {
              this.props.navigation.navigate("postUpdateRoute");
            }}
          >
            <Image
              source={{ uri: this.state.profileImage }}
              style={{ height: 50, width: 50, borderRadius: 100 }}
            />

            <Subtitle style={{ marginTop: 15, marginLeft: 20 }}>
              Post some update ....
            </Subtitle>
          </TouchableOpacity>

          <FlatList
            data={this.state.userInfo}
            renderItem={({ item, index }) => {
              return (
                <Card style={{ marginTop: 10 }}>
                  <CardItem header bordered>
                    <Image
                      source={{ uri: item.profileUserPosted }}
                      style={{ width: 40, height: 40, borderRadius: 100 }}
                    />
                    <Text style={{ marginLeft: 10 }}>
                      {item.nameUserPosted}
                    </Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Image
                        source={{ uri: item.addedFile }}
                        style={{ height: 250, width: "100%" }}
                      />
                      <Text>{item.postedText}</Text>
                    </Body>
                  </CardItem>
                  <CardItem style={{flexDirection: 'row'}}>

                      <Button iconLeft transparent>
                        <Icon name={'thumbs-up'} style={{color: "#000"}} />
                        <Badge style={{backgroundColor: '#fff'}}>
                          <Text>2</Text>
                        </Badge>
                      </Button>

                    <Button iconLeft transparent>
                      <Icon name={'thumbs-down'} style={{color: "#000"}}/>
                      <Badge style={{backgroundColor: '#fff'}}>
                        <Text>5</Text>
                      </Badge>
                    </Button>

                    <Button iconLeft transparent>
                      <Icon name={'text'} style={{color: "#000"}}/>
                      <Badge style={{backgroundColor: '#fff'}}>
                        <Text>7</Text>
                      </Badge>
                    </Button>

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

export default withNavigation(NewsFeed);
