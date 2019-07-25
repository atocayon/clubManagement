import React, { Component } from "react";
import { View, Text, Image } from "react-native";
import firebase from "react-native-firebase";
import getTheme from "../../../native-base-theme/components";
import material from "../../../native-base-theme/variables/material";
import NewsFeed from "./NewsFeed";
import MenuOptions from "./MenuOptions";
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
  StyleProvider
} from "native-base";
export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  menuOptions() {
    const user = firebase.auth().currentUser;
    return <MenuOptions uid={user.uid} />;
  }

  newsFeedOptions() {
    const user = firebase.auth().currentUser;
    return <NewsFeed uid={user.uid} />;
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header style={{ backgroundColor: "#fff" }}>
            <Left>
              <Image
                source={require("../common/img/icon.png")}
                style={{ width: 30, height: 30 }}
              />
            </Left>
            <Body>
              <Title style={{ color: "#000" }}>Club Management</Title>
            </Body>

            <Right />
          </Header>
          <Tabs>
            <Tab
              heading={
                <TabHeading>
                  <Icon name={"browsers"} />
                </TabHeading>
              }
            >
              {this.newsFeedOptions()}
            </Tab>
            <Tab
              heading={
                <TabHeading>
                  <Icon name={"chatbubbles"} />
                </TabHeading>
              }
            />
            <Tab
              heading={
                <TabHeading>
                  <Icon name={"contacts"} />
                </TabHeading>
              }
            />
            <Tab
              heading={
                <TabHeading>
                  <Icon name={"menu"} />
                </TabHeading>
              }
            >
              {this.menuOptions()}
            </Tab>
          </Tabs>
        </Container>
      </StyleProvider>
    );
  }
}
