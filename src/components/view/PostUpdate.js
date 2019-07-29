import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  TouchableHighlight,
  FlatList
} from "react-native";
import Emoji from "react-native-emoji";
import firebase from "react-native-firebase";
import { withNavigation } from "react-navigation";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { Formik, Field } from "formik";
import Moment from 'react-moment';
import HeaderComponent from "../common/header/HeaderComponent";

import {
  Container,
  Content,
  Item,
  Input,
  Icon,
  Right,
  Title,
  Label,
  Button,
  Header,
  Left,
  Body,
  CardItem,
  Footer,
  FooterTab,
  Tabs,
  Tab,
  TabHeading,
  StyleProvider,
  Textarea,
  Card,
  Grid,
  Col,
  Row,
  InputGroup,
  Toast,
  CheckBox,
  Subtitle
} from "native-base";
import * as yup from "yup";

import ImagePicker from "react-native-image-crop-picker";
import moment from 'moment';

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
      curTime: moment().format('MMMM Do YYYY, h:mm:ss a'),
      userTextPost: "",
      uploadFile: "",
      tagPeople: [],
      addFeelings: "",
      location: "",
      rowSpan: 10,
      modalVisible: false,

      //    Dialog
      dialogFeelings: false
    };
  }

  componentDidMount() {
    console.log("This is the current system time: "+this.state.curTime);
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
      addedLocation: this.state.location
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
    });
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
          <HeaderComponent routeNavigation={"homeRoute"} />
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

            <CardItem header bordered>
              <Image
                source={{ uri: this.state.profileImage }}
                style={{ height: 50, width: 50, borderRadius: 100 }}
              />
              <Title style={{ marginLeft: 20 }}>{this.state.name}</Title>
              {/*Human Basic Emotions*/}
              {this.state.addFeelings === "Feeling Joyful" ? (
                <Subtitle>  is <Emoji name="blush" /> Feeling joyful
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Fearful" ? (
                <Subtitle>  is <Emoji name="fearful" /> Feeling Fearful
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Surprise" ? (
                <Subtitle>  is <Emoji name="hushed" /> Feeling Surprise
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Sad" ? (
                <Subtitle>  is <Emoji name="worried" /> Feeling Sad
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Disgust" ? (
                <Subtitle>  is <Emoji name="triumph" /> Feeling Disgust
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Angry" ? (
                <Subtitle>  is <Emoji name="angry" /> Feeling Angry
                </Subtitle>
              ) : null}
              {this.state.addFeelings === "Feeling Happy" ? (
                <Subtitle>  is <Emoji name="grinning" /> Feeling Happy
                </Subtitle>
              ) : null}
            </CardItem>
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
                    <Button transparent>
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
