import React, { Component } from "react";
import Reactotron from "reactotron-react-native";
import { connect } from "react-redux";
import * as yup from "yup";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  PermissionsAndroid, BackHandler,
} from 'react-native';
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
import { registration } from "../redux/actions/registration";
import HeaderComponent from "../common/header/HeaderComponent";

class Registration extends Component {
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

  componentDidMount() {
    this.backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });

  }

  componentWillUnmount() {
    this.backhandler.remove();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loading: false
    });
    if (nextProps.userReg === false){
      Alert.alert(
          "Sorry, Were having some issue right now.Please try again later...",
          "",
          [{ text: "OK" }],
          { cancelable: false }
      );
    }else{
      Alert.alert(
          "You have successfully created your account, login now and enjoy!",
          "",
          [{ text: "Got it" }],
          { cancelable: false }
      );
    }
  }

  async requestGalleryPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Club Management App Gallery Permission",
          message:
            "Club Management App needs access to your gallery " +
            "so you can upload awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.getGallery();
      } else {
        console.log("Gallery permission denied");
        Reactotron.log("Gallery permission denied");
      }
    } catch (err) {
      console.warn(err);
      Reactotron.log(err);
    }
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
      Reactotron.log("Get Gallery: " + image);
    });
  }

  registration() {
    this.props.userRegistration(
      this.state.name,
      this.state.address,
      this.state.email,
      this.state.password,
      this.state.profileImage
    );
  }

  render() {
    return (
      <Container>
        <HeaderComponent
          headerText={"Create Account"}
          routeNavigation={"loginRoute"}
        />
        <Content style={{marginTop: 20}}>
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
              this.registration();
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
                  <CardItem
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
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
                          {this.state.profileImage ? (
                            <Image
                              source={{ uri: this.state.profileImage.path }}
                              style={{
                                height: 100,
                                width: 100,
                                borderRadius: 100
                              }}
                            />
                          ) : (
                            <View>
                              <Text>
                                <Icon
                                  type={"FontAwesome"}
                                  name={"user-circle"}
                                  style={{ fontSize: 100, color: "#000" }}
                                />
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          <Text>
                            <Icon
                              type={"FontAwesome"}
                              name={"user-circle"}
                              style={{ fontSize: 100, color: "#000" }}
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
                  <Label>Email</Label>
                  {/*<Field*/}
                  {/*  name="name"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Full Name"*/}
                  {/*/>*/}
                  {errors.name && touched.name ? (
                    <View>
                      <Item error rounded>
                        <Icon active name="person" />
                        <Input
                          name="name"
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
                          value={values.name}
                          placeholder="Your full name ..."
                        />
                      </Item>
                      <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                        {errors.name}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Item rounded>
                        <Icon active name="person" />
                        <Input
                          name="name"
                          onChangeText={handleChange("name")}
                          onBlur={handleBlur("name")}
                          value={values.name}
                          placeholder="Your full name ..."
                        />
                      </Item>
                    </View>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label>Address</Label>
                  {/*<Field*/}
                  {/*  name="address"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Address"*/}
                  {/*/>*/}

                  {errors.address && touched.address ? (
                    <View>
                      <Item error rounded>
                        <Icon active name="pin" />
                        <Input
                          name="address"
                          onChangeText={handleChange("address")}
                          onBlur={handleBlur("address")}
                          value={values.address}
                          placeholder="Your address ..."
                        />
                      </Item>
                      <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                        {errors.address}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Item rounded>
                        <Icon active name="pin" />
                        <Input
                          name="address"
                          onChangeText={handleChange("address")}
                          onBlur={handleBlur("address")}
                          value={values.address}
                          placeholder="Your address ..."
                        />
                      </Item>
                    </View>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label>Email</Label>
                  {/*<Field*/}
                  {/*  name="email"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="email@gmail.com"*/}
                  {/*/>*/}
                  {errors.email && touched.email ? (
                    <View>
                      <Item error rounded>
                        <Icon active name="mail" />
                        <Input
                          name="email"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          placeholder="email@email.com"
                        />
                      </Item>
                      <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                        {errors.email}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Item rounded>
                        <Icon active name="mail" />
                        <Input
                          name="email"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          placeholder="email@email.com"
                        />
                      </Item>
                    </View>
                  )}
                </View>
                <View style={{ marginTop: 10 }}>
                  <Label>Password</Label>
                  {/*<Field*/}
                  {/*  name="password"*/}
                  {/*  component={InputFields}*/}
                  {/*  placeholder="Your Password"*/}
                  {/*  secureTextEntry={true}*/}
                  {/*/>*/}
                  {errors.password && touched.password ? (
                    <View>
                      <Item error rounded>
                        <Icon active name="key" />
                        <Input
                          name="password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="Your password ..."
                          secureTextEntry={true}
                        />
                      </Item>
                      <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                        {errors.password}
                      </Text>
                    </View>
                  ) : (
                    <View>
                      <Item rounded>
                        <Icon active name="key" />
                        <Input
                          name="password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="Your password ..."
                          secureTextEntry={true}
                        />
                      </Item>
                    </View>
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

const mapStateToProps = state => {
  return {
    userReg: state.reg.userReg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    userRegistration: (name, address, email, password, profileImage) => {
      dispatch(registration(name, address, email, password, profileImage));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Registration);
