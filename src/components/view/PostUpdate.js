import React, { Component } from "react";
import { View, Text, Image, ActivityIndicator, Modal, TouchableHighlight, FlatList } from "react-native";
import firebase from "react-native-firebase";
import { withNavigation } from "react-navigation";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import { Formik, Field } from "formik";

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
    CheckBox
} from "native-base";
import * as yup from "yup";
import DocumentPicker from 'react-native-document-picker';

class PostUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentUser: {},
      uid: "",
      members: {},
      membersID: "",

      //For NewsFeed Data
      userTextPost: "",
      uploadFile: "",
      tagPeopleID: [],
      tagPeopleName: [],
      addFeelings: "",
      location: "",
      rowSpan: 10,
      modalVisible: false,
    };

  }

  componentDidMount() {
    const user = firebase.auth().currentUser;
    const { navigation } = this.props;
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(user.uid);
    ref.get().then(doc => {
      if (doc.exists) {
        this.setState({
          currentUser: doc.data(),
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
      idUserPosted: this.state.currentUser.uid,
      nameUserPosted: this.state.currentUser.name,
      postedText: this.state.userTextPost,
      addedFile: param.downloadURL,
      tagPeopleID: this.state.tagPeopleID,
      tagPeopleName: this.state.tagPeopleName,
      addedFeelings: this.state.addedFeelings,
      addedLocation: this.state.addedLocation
    };

    this.createPost(data);
 };

  createPost = (data) => {
    firebase
        .firestore()
        .collection("newsFeed")
        .doc(data.idUserPosted)
        .set(data)
        .then((data) => {
          this.props.navigation.navigate('homeRoute');
        }).catch((err)=>{
      console.log(err);
    });

  };

  async getFile() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });

      for (const res of results) {
        console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
        );
      }

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  //File Upload
  uploadFile() {
    let param = this.state.uploadFile;
    console.log("=======================>"+param+"<===============================");
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
            <CardItem header bordered>
              <Image
                source={{ uri: this.state.currentUser.profileImage }}
                style={{ height: 50, width: 50, borderRadius: 100 }}
              />
              <Title style={{ marginLeft: 20 }}>
                {this.state.currentUser.name}
              </Title>
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
                          <View style={{flexDirection: 'row',justifyContent: 'center'}}>
                            <Image source={{uri: this.state.uploadFile.path}} style={{ height: 300, width: '100%'}} />

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

                        ) :
                        (
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
                  <Button block onPress={handleSubmit}>
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
                    <Button transparent onPress={()=>{this.getFile()}}>
                      <Icon name="photos" />
                      <Text  style={{ marginLeft: 10 }}>Upload Image</Text>
                    </Button>

                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button transparent onPress={()=>{this.getFile()}}>
                      <Icon name="videocam" />
                      <Text style={{ marginLeft: 10 }}>Upload Video</Text>
                    </Button>
                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button transparent>
                      <Icon name="attach" />
                      <Text style={{ marginLeft: 10 }}>Attach File</Text>
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
                    <Button transparent>
                      <Icon name="pricetags" />
                      <Text style={{ marginLeft: 10 }}>Tag People</Text>
                    </Button>

                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button transparent>
                      <Icon name="happy" />
                      <Text style={{ marginLeft: 10 }}>Add Feelings</Text>
                    </Button>

                  </InputGroup>

                  <InputGroup
                    style={{ padding: 10, marginLeft: 20, marginRight: 20 }}
                  >
                    <Button transparent>
                      <Icon name="pin" />
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
