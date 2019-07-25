import Login from "./src/components/view/Login";
import Home from "./src/components/view/Home";
import Registration from "./src/components/view/Registration";
import MenuOptions from "./src/components/view/MenuOptions";
import NewsFeed from "./src/components/view/NewsFeed";
import { createStackNavigator, createAppContainer } from "react-navigation";

const App = createStackNavigator(
  {
    loginRoute: { screen: Login },
    homeRoute: { screen: Home },
    registrationRoute: { screen: Registration },
  },
  {
    initialRouteName: "loginRoute",
    headerMode: "none"
  }
);
console.disableYellowBox = true;
export default createAppContainer(App);
