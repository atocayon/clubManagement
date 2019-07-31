import React, { Component } from "react";
import Reactotron from 'reactotron-react-native'
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  PermissionsAndroid,
} from "react-native";
import Emoji from "react-native-emoji";
import firebase from "react-native-firebase";
import { withNavigation } from "react-navigation";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { Formik, Field } from "formik";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoder";
import RNGooglePlaces from 'react-native-google-places';
import HeaderComponent from "../common/header/HeaderComponent";

import {
  Container,
  Content,
  Icon,
  Title,
  Button,
  CardItem,
  StyleProvider,
  Textarea,
  Grid,
  Col,
  InputGroup,

} from "native-base";
import * as yup from "yup";

import ImagePicker from "react-native-image-crop-picker";
import moment from "moment";

class PostUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      name: "",
      uid: "",
      profileImage: "",
      members: {},
      membersID: "",

      //For NewsFeed Data
      curTime: moment().format("MMMM Do YYYY, h:mm:ss a"),
      userTextPost: "",
      uploadFile: "",
      tagPeople: [],
      addFeelings: "",
      addLocation: "",
      rowSpan: 10,
      modalVisible: false,

      //    Dialog
      dialogFeelings: false
    };
  }

  async requestLocationPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Club Management App Gallery Permission",
          message:
            "Club Management App needs access to your location " +
            "so you can post current location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.findCoordinates();
      } else {
        Reactotron.log("Location permission denied");
      }
    } catch (err) {
      Reactotron.log(err);
    }
  }



  componentDidMount() {
    Reactotron.log("This is the current system time: " + this.state.curTime);
    const user = firebase.auth().currentUser;
    const { navigation } = this.props;
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(user.uid);
    ref.get().then(doc => {
      if (doc.exists) {
        const currentUser = doc.data();
        this.setState({
          name: currentUser.name,
          profileImage: currentUser.profileImage,
          uid: doc.id,
          loading: false
        });
      } else {
        console.log("No such Document...");
      }
    });
  }

  // openSearchModal() {
  //   RNGooglePlaces.openAutocompleteModal({type: 'address'})
  //       .then((place) => {
  //         console.log(place);
  //         // place represents user's selection from the
  //         // suggestions and it is a simplified Google Place object.
  //         this.setState({addLocation: place});
  //       })
  //       .catch(error => console.log(error.message));  // error is a Javascript Error object
  // }


  findCoordinates() {
    console.log("Getting Location");
    Geolocation.getCurrentPosition(
        position => {
          console.log("Latitude: " + position.coords.latitude);
          console.log("Longitude: " + position.coords.longitude);

          const pos = {lat: position.coords.latitude, lng: position.coords.longitude};
          Geocoder.geocodePosition(pos)
              .then(res => {
                console.log(res[0].subAdminArea+","+res[0].country);
                this.setState({addLocation: res[0].subAdminArea+", "+res[0].country});
              })
              .catch(error => console.log(error));
        },
        err => console.log(err),
        {}
    );
  }

  // After File Upload
  preparedData = (param = false) => {
    let data = {
      idUserPosted: this.state.uid,
      nameUserPosted: this.state.name,
      profileUserPosted: this.state.profileImage,
      postedText: this.state.userTextPost,
      addedFile: param.downloadURL,
      tagPeople: this.state.tagPeople,
      addedFeelings: this.state.addFeelings,
      addedLocation: this.state.addLocation,
      timePosted: this.state.curTime
    };

    this.createPost(data);
  };

  createPost = data => {
    firebase
      .firestore()
      .collection("newsFeed")
      .add(data)
      .then(data => {
        console.log("Successfully Posted");
        this.props.navigation.navigate("homeRoute");
      })
      .catch(err => {
        console.log(err);
      });
  };

  getFile() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      compressImageQuality: 1
    }).then(image => {
      this.setState({ uploadFile: image });
    }).catch((err)=>{console.log(err)});
  }

  //File Upload
  uploadFile() {
    let param = this.state.uploadFile;
    console.log(
      "=======================>" + param + "<==============================="
    );
    if (param) {
      const sessionId = new Date().getTime();
      let file = param.path;
      firebase
        .storage()
        .ref("newsFeedPostedFile", file)
        .child(`${sessionId}.${param.mime}`)
        .putFile(file)
        .then(url => {
          this.preparedData(url);
        });
    } else {
      this.preparedData();
    }
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
          <HeaderComponent
            routeNavigation={"homeRoute"}
            headerText={"Create Post"}
          />
          <Content style={{ marginTop: 10 }}>
            {/*Dialog Feelings*/}
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.dialogFeelings}
              onRequestClose={() => {
                console.log("Modal has been closed.");
              }}
            >
              <View style={{ marginTop: 22 }}>
                <View>
                  <CardItem bordered>
                    <Emoji name="blush" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Joyful"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Joyful
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="fearful" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Fearful"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Fearful
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="hushed" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Surprise"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Surprise
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="worried" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Sad"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Sad
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="triumph" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Disgust"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Disgust
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="angry" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Angry"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Angry
                      </Title>
                    </Button>
                  </CardItem>

                  <CardItem bordered>
                    <Emoji name="grinning" style={{ fontSize: 50 }} />
                    <Button
                      block
                      transparent
                      onPress={() => {
                        this.setState({
                          dialogFeelings: false,
                          addFeelings: "Feeling Happy"
                        });
                      }}
                    >
                      <Title style={{ marginLeft: 10, marginTop: 10 }}>
                        Feeling Happy
                      </Title>
                    </Button>
                  </CardItem>
                </View>
              </View>
            </Modal>
            {/*End Dialog Feelings*/}

            {/*Body*/}
            <CardItem header bordered>
              {/*User Profile*/}
              <Image
                source={{ uri: this.state.profileImage }}
                style={{ height: 80, width: 80, borderRadius: 100 }}
              />
              <View style={{marginLeft: 20}}>
                <Text style={{fontWeight: "bold",fontSize: 20 }}>
                  {this.state.name}
                </Text>

              {/*End User Profile*/}

              {/*Human Basic Emotions*/}
              {this.state.addFeelings === "Feeling Joyful" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="blush" /> Feeling joyful
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Fearful" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="fearful" /> Feeling Fearful
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Surprise" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="hushed" /> Feeling Surprise
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Sad" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="worried" /> Feeling Sad
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Disgust" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="triumph" /> Feeling Disgust
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Angry" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="angry" /> Feeling Angry
                </Text>
              ) : null}
              {this.state.addFeelings === "Feeling Happy" ? (
                <Text style={{fontSize: 12}}>
                  {" "}
                  is <Emoji name="grinning" /> Feeling Happy
                </Text>
              ) : null}

              {this.state.addLocation ? (<Text style={{fontSize: 12}}>in {this.state.addLocation}</Text>) : null}
              </View>
            </CardItem>

            {/*Posting Section*/}
            <Formik
              initialValues={{ textPost: "" }}
              onSubmit={values => {
                this.setState({
                  loading: true,
                  userTextPost: values.textPost
                });
                this.uploadFile();
              }}
              validationSchema={yup.object().shape({
                textPost: yup
                  .string()
                  .required("Ops, you need to write something...")
              })}
            >
              {({
                values,
                handleChange,
                touched,
                errors,
                handleSubmit,
                setFieldTouched,
                handleBlur
              }) => (
                <View>
                  <View>
                    {this.state.uploadFile ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center"
                          }}
                        >
                          <Image
                            source={{ uri: this.state.uploadFile.path }}
                            style={{ height: 300, width: "100%" }}
                          />
                        </View>
                        <Textarea
                          rowSpan={3}
                          bordered
                          placeholder="Say Something..."
                          name="textPost"
                          value={values.textPost}
                          onChangeText={handleChange("textPost")}
                          onBlue={handleBlur("textPost")}
                        />
                      </View>
                    ) : (
                      <View>
                        <Textarea
                          rowSpan={this.state.rowSpan}
                          bordered
                          placeholder="Say Something..."
                          name="textPost"
                          value={values.textPost}
                          onChangeText={handleChange("textPost")}
                          onBlue={handleBlur("textPost")}
                        />
                      </View>
                    )}

                    {errors.textPost ? (
                      <Text style={{ color: "#ff0000", marginLeft: 10 }}>
                        {errors.textPost}
                      </Text>
                    ) : null}
                  </View>
                  <Button
                    block
                    rounded
                    onPress={handleSubmit}
                    style={{ marginLeft: 20, marginRight: 20 }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      Post
                    </Text>
                  </Button>
                </View>
              )}
            </Formik>

            <Grid>
              <Col>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button
                      transparent
                      onPress={() => {
                        this.getFile();
                      }}
                    >
                      <Icon name="photos" style={{ color: "#000" }} />
                      <Text style={{ marginLeft: 10 }}>Upload Image</Text>
                    </Button>
                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button
                      transparent
                      onPress={() => {
                        this.getFile();
                      }}
                    >
                      <Icon name="videocam" style={{ color: "#000" }} />
                      <Text style={{ marginLeft: 10 }}>Upload Video</Text>
                    </Button>
                  </InputGroup>
                </View>
              </Col>
              <Col>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button
                      transparent
                      onPress={() => {
                        this.setState({ dialogFeelings: true });
                      }}
                    >
                      <Icon name="happy" style={{ color: "#000" }} />
                      <Text style={{ marginLeft: 10 }}>Add Feelings</Text>
                    </Button>
                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button
                      transparent
                      onPress={() => {
                        this.requestLocationPermission();
                      }}
                    >
                      <Icon name="pin" style={{ color: "#000" }} />
                      <Text style={{ marginLeft: 10 }}>Add Location</Text>
                    </Button>
                  </InputGroup>
                </View>
              </Col>
            </Grid>
          </Content>
        </Container>
      </StyleProvider>
    );
  }
}

export default withNavigation(PostUpdate);
