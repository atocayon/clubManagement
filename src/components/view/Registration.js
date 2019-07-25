import React, { Component } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, TouchableOpacity,Image, PermissionsAndroid } from "react-native";
import { Formik, Field } from "formik";
import ImagePicker from "react-native-image-crop-picker";
import firebase from "react-native-firebase";
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
    CardItem,
    Card
} from "native-base";
// import InputFields from "../common/forms/InputFields";
import * as yup from "yup";

import HeaderComponent from '../common/header/HeaderComponent';

export default class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      address: "",
      email: "",
      password: "",
      profileImage: "",
      loading: false
    };


  }

    async requestGalleryPermission(){
    try {
      const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Club Management App Gallery Permission',
            message:
                'Club Management App needs access to your gallery ' +
                'so you can upload awesome pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getGallery();
      } else {
        console.log('Gallery permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }


  preparedStatement(param = false) {
    let data = {
      name: this.state.name,
      address: this.state.address,
      email: this.state.email,
      password: this.state.password,
      profileImage: param.downloadURL
    };
    this.createAccount(data);
  }

  createAccount(data) {
    console.log(
      "=========================>Create Account<========================"
    );
    console.log("==============================>"+data.primaryImage+"<=======================================");
    let credentials = {
      email: data.email,
      password: data.password
    };
    firebase
      .auth()
      .createUserWithEmailAndPassword(credentials.email, credentials.password)
      .then(userKey => {
          data.userID = userKey.user.uid;
          console.log("================================>"+data.userID+"<=====================================");
        this.fillUserInfo(data);
      }).catch((err)=>{
        console.log(err);
       Alert.alert("Error...","Email/Password is already in use...Please try again");
       this.setState({
         name: "",
         address: "",
         email: "",
         password: "",
         profileImage: "",
         loading: false

       });
    });
  }

  fillUserInfo(data) {
    console.log(
      "===================>Filled User Info<============================"
    );
    firebase
      .firestore()
      .collection("users")
      .doc(data.userID)
      .set(data)
      .then((data) => {
        console.log(
          "================>New User has been added<==================="
        );
        this.props.navigation.navigate("loginRoute");
      }).catch((err)=>{
        console.log(err);
    });
  }

  getImage() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      useFrontCamera: true,
      compressImageQuality: 0.2
    }).then(image => {
      this.setState({ profileImage: image });
    });
  }

  getGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      compressImageQuality: 0.2
    }).then(image => {
      this.setState({ profileImage: image });
      console.log(" ======================>"+ image+"<================================");
    });
  }

  upload() {
    let param = this.state.profileImage;
    console.log("=======================>"+param+"<===============================");
    if (param) {
      const sessionId = new Date().getTime();
      let file = param.path;
      firebase
          .storage()
          .ref("user", file)
          .child(`${sessionId}.${param.mime}`)
          .putFile(file)
          .then(url => {
            this.preparedStatement(url);
          });
    } else {
      this.preparedStatement();
    }
  }

  render() {
    return (
      <Container>
        <HeaderComponent
         headerText={'Create Account'}
         routeNavigation={'loginRoute'}
        />
        <Content>
          <Formik
            initialValues={{ name: "", address: "", email: "", password: "" }}
            onSubmit={values => {
              this.setState({
                loading: true,
                name: values.name,
                address: values.address,
                email: values.email,
                password: values.password
              });
              this.upload();
            }}
            validationSchema={yup.object().shape({
              email: yup
                .string()
                .email("Invalid email...Try another one")
                .required("Email is required..."),
              password: yup
                .string()
                .min(5, "Password length is too short!")
                .max(50, "Wow, That password is too long!")
                .required("Password is required..."),
              name: yup.string().required("Your Name is required"),
              address: yup.string().required("Your Address is required")
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
              <View style={{ padding: 20 }}>
                <View style={{ marginTop: 5 }}>
                  <CardItem style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                              "Capture Image",
                              "",
                              [
                                {
                                  text: "Cancel",

                                  style: "cancel"
                                },
                                {
                                  text: "Camera",
                                  onPress: () => {
                                    this.getImage();
                                  }
                                },

                                {
                                  text: "Gallery",
                                  onPress: () => {
                                    this.requestGalleryPermission();
                                  }
                                }
                              ],
                              { cancelable: false }
                          );
                          //this.getImage();
                        }}
                    >
                      {this.state.profileImage != "" ? (
                          <View>
                            <Image
                                source={{ uri: this.state.profileImage.path }}
                                style={{ height: 100, width: 100, borderRadius: 100 }}
                            />
                          </View>
                      ) : (
                          <View>
                            <Text>
                              <Icon
                                  type={"FontAwesome"}
                                  name={"user-circle"}
                                  style={{ fontSize: 100, color: "#E2E2E2" }}
                              />
                            </Text>
                          </View>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                              "Capture Image",
                              "",
                              [
                                {
                                  text: "Cancel",

                                  style: "cancel"
                                },
                                {
                                  text: "Camera",
                                  onPress: () => {
                                    this.getImage();
                                  }
                                },

                                {
                                  text: "Gallery",
                                  onPress: () => {
                                    this.requestGalleryPermission();
                                  }
                                }
                              ],
                              { cancelable: false }
                          );
                          //this.getImage();
                        }}
                    >
                      <View style={{ marginTop: 70 }}>
                        <Icon type={"Entypo"} name={"camera"} />
                      </View>
                    </TouchableOpacity>
                  </CardItem>
                  <Label style={{ fontWeight: "bold" }}>Name</Label>
                  {/*<Field*/}
                  {/*  name="name"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Full Name"*/}
                  {/*/>*/}
                  {errors.name && touched.name ? (
                      <View>
                        <Item error rounded>
                          <Input
                              name="name"
                              onChangeText={handleChange("name")}
                              onBlur={handleBlur("name")}
                              value={values.name}
                              placeholder="Your full name ..."
                          />
                        </Item>
                        <Text style={{color: '#ff0000', marginLeft: 30}}>{errors.name}</Text>
                      </View>
                  ) : (
                      <Item rounded>
                        <Input
                            name="name"
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            value={values.name}
                            placeholder="Your full name ..."
                        />
                      </Item>
                  )}

                </View>
                <View style={{ marginTop: 10 }}>
                  <Label style={{ fontWeight: "bold" }}>Address</Label>
                  {/*<Field*/}
                  {/*  name="address"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Address"*/}
                  {/*/>*/}

                  {errors.address && touched.address ? (
                      <View>
                        <Item error rounded>
                          <Input
                              name="address"
                              onChangeText={handleChange("address")}
                              onBlur={handleBlur("address")}
                              value={values.address}
                              placeholder="Your address ..."
                          />
                        </Item>
                        <Text style={{color: '#ff0000', marginLeft: 30}}>{errors.address}</Text>
                      </View>
                  ) : (
                      <Item rounded>
                        <Input
                            name="address"
                            onChangeText={handleChange("address")}
                            onBlur={handleBlur("address")}
                            value={values.address}
                            placeholder="Your Address ..."
                        />
                      </Item>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label style={{ fontWeight: "bold" }}>Email</Label>
                  {/*<Field*/}
                  {/*  name="email"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="email@gmail.com"*/}
                  {/*/>*/}
                  {errors.email && touched.email ? (
                      <View>
                        <Item error rounded>
                          <Input
                              name="email"
                              onChangeText={handleChange("email")}
                              onBlur={handleBlur("email")}
                              value={values.email}
                              placeholder="email@gmail.com"
                          />
                        </Item>
                        <Text style={{color: '#ff0000', marginLeft: 30}}>{errors.email}</Text>
                      </View>
                  ) : (
                      <Item rounded>
                        <Input
                            name="email"
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            value={values.email}
                            placeholder="email@gmail.com"
                        />
                      </Item>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label style={{ fontWeight: "bold" }}>Password</Label>
                  {/*<Field*/}
                  {/*  name="password"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Password"*/}
                  {/*  secureTextEntry={true}*/}
                  {/*/>*/}
                  {errors.password && touched.password ? (
                      <View>
                        <Item error rounded>
                          <Input
                              name="password"
                              onChangeText={handleChange("password")}
                              onBlur={handleBlur("password")}
                              value={values.password}
                              placeholder="Your Password ..."
                              secureTextEntry={true}
                          />
                        </Item>
                        <Text style={{color: '#ff0000', marginLeft: 30}}>{errors.password}</Text>
                      </View>
                  ) : (
                      <Item  rounded>
                        <Input
                            name="password"
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            placeholder="Your Password ..."
                            secureTextEntry={true}
                        />
                      </Item>
                  )}
                </View>

                <View>
                  {this.state.loading ? (
                    <Button
                        success
                      rounded
                      style={style.buttonStyle}
                      onPress={handleSubmit}
                    >
                      <ActivityIndicator />
                    </Button>
                  ) : (
                    <Button
                      success
                      rounded
                      style={style.buttonStyle}
                      onPress={handleSubmit}
                    >
                      <Text style={{ fontWeight: "bold", color: "#fff" }}>
                        Create
                      </Text>
                    </Button>
                  )}
                </View>
              </View>
            )}
          </Formik>
        </Content>
      </Container>
    );
  }
}

const style = StyleSheet.create({
  buttonStyle: {
    justifyContent: "center",
    alignSelf: "stretch",
    textAlignVertical: "center",
    marginTop: 30
  }
});
