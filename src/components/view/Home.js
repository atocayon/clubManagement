import React, { Component } from "react";
import Reactotron from 'reactotron-react-native'
import {View, Text, Image, ActivityIndicator, BackHandler} from 'react-native';
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
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      menuOptionsVisibility: false,
      newsFeedOptionsVisibility: false
    };
  }

  componentDidMount(){
    this.setState({
        loading: false,
      menuOptionsVisibility: true,
      newsFeedOptionsVisibility: true
    });

    this.backhandler = BackHandler.addEventListener("hardwareBackPress", () => {
      BackHandler.exitApp();
      return true;
    });
  }

  componentWillUnmount() {
    this.backhandler.remove();
  }

  menuOptions() {
    return <MenuOptions />;
  }

  newsFeedOptions() {
    return <NewsFeed />;
  }

  render() {
    return (
      <StyleProvider style={getTheme(material)}>
        <Container>
          <Header style={{ backgroundColor: "#fff" }}>
            <Left>
              {this.state.loading ? <ActivityIndicator /> : <Image
                  source={require("../common/img/icon.png")}
                  style={{ width: 30, height: 30 }}
              />}

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
              {this.state.newsFeedOptionsVisibility ? this.newsFeedOptions():null}
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
                    <Icon name={"notifications"} />
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
              {this.state.menuOptionsVisibility ? this.menuOptions():null}
            </Tab>
          </Tabs>
        </Container>
      </StyleProvider>
    );
  }
}



export default Home;
