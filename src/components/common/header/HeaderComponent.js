import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon, Right, Title, Header } from "native-base";
import { withNavigation } from "react-navigation";

class HeaderComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { headerText, routeNavigation } = this.props;
    return (
      <Header
        style={{ paddingTop: 15, paddingLeft: 20, backgroundColor: "#fff" }}
      >
        <Icon
          style={{ color: "#000" }}
          name="arrow-back"
          onPress={() => {
            this.props.navigation.navigate(routeNavigation);
          }}
        />
        <Title style={{ marginLeft: 20, color: "#000" }}>{headerText}</Title>
        <Right />
      </Header>
    );
  }
}

export default withNavigation(HeaderComponent);
