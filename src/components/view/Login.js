import * as yup from "yup";
import React, { Component } from "react";
import {
  StackActions,
  NavigationActions,
  withNavigationFocus
} from "react-navigation";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  BackHandler
} from "react-native";
import { Formik, Field } from "formik";
import {
  Container,
  Content,
  Title,
  Form,
  Item,
  Label,
  Input,
  CardItem,
  Button,
  Spinner,
  Icon
} from "native-base";
import firebase from "react-native-firebase";

// import InputFields from "../common/forms/InputFields";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      email: "",
      password: ""
    };
  }

  componentDidMount() {
    firebase
        .auth()
        .onAuthStateChanged((user) => {
      if (user) {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: "homeRoute" })]
        });
        this.props.navigation.dispatch(resetAction);
      }
    });
    this.backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });

  }

  componentWillUnmount() {
    this.backhandler.remove();
  }

  login() {
    const { email, password } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.navigation.navigate("homeRoute");
      })
      .catch(err => {
        if (err.code == "auth/user-not-found") {
          let msg = "There is no user with an email of " + this.state.email;
          Alert.alert(msg, "", [{ text: "OK" }], { cancelable: false });
          this.setState({
            loading: false
          });
        } else if (err.code == "auth/wrong-password") {
          let msg = "Wrong password please try again";
          Alert.alert(msg, "", [{ text: "OK" }], { cancelable: false });
          this.setState({
            loading: false
          });
        }
      });
  }

  render() {
    return (
      <ScrollView>
        <View style={{ flex: 1, marginTop: 50 }}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Image
              source={require("../common/img/icon.png")}
              style={{ width: 100, height: 100 }}
            />
          </View>
          <View style={{ margin: 20 }}>
            <Formik
              initialValues={{ email: "", password: "" }}
              onSubmit={values => {
                this.setState({
                  loading: true,
                  email: values.email,
                  password: values.password
                });
                this.login();
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
                  .required("Password is required...")
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
                          <Icon name="close-circle" />
                        </Item>
                        <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                          {errors.email}
                        </Text>
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
                    {/*  secureTextEntry={true}*/}
                    {/*  placeholder="your password..."*/}
                    {/*/>*/}
                    {errors.password && touched.password ? (
                      <View>
                        <Item error rounded>
                          <Input
                            name="password"
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            secureTextEntry={true}
                            placeholder="your password..."
                          />
                          <Icon name="close-circle" />
                        </Item>
                        <Text style={{ color: "#ff0000", marginLeft: 30 }}>
                          {errors.password}
                        </Text>
                      </View>
                    ) : (
                      <Item rounded>
                        <Input
                          name="password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          secureTextEntry={true}
                          placeholder="your password..."
                        />
                      </Item>
                    )}
                  </View>
                  <View>
                    {this.state.loading ? (
                      <Button
                        rounded
                        style={style.buttonStyle}
                        onPress={handleSubmit}
                      >
                        <ActivityIndicator />
                      </Button>
                    ) : (
                      <Button
                        rounded
                        style={style.buttonStyle}
                        onPress={handleSubmit}
                      >
                        <Text style={{ fontWeight: "bold", color: "#fff" }}>
                          Login
                        </Text>
                      </Button>
                    )}
                  </View>
                </View>
              )}
            </Formik>

            <View
              style={{
                borderBottomColor: "black",
                borderBottomWidth: 1,
                marginTop: 20
              }}
            />

            <View>
              <Button
                bordered
                success
                rounded
                style={style.buttonStyle}
                onPress={() => {
                  this.props.navigation.navigate("registrationRoute");
                }}
              >
                <Text style={{ fontWeight: "bold", color: "#4CAF50" }}>
                  Create Account
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </ScrollView>
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
