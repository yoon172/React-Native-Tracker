import React from 'react';
import {  createAppContainer, createSwitchNavigator} from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Provider as PaperProvider } from 'react-native-paper';
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import User from "./Components/User";
import Dashboard from "./Components/Dashboard";
import Fitness from "./Components/Fitness";
import AddActivity from "./Components/AddActivity";
import EditActivity from "./Components/EditActivity";

class App extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         loginSuccessful: false
      }
   }

   render() {
      return (
         <>
            <PaperProvider>
            <AppContainer/>
            </PaperProvider>
         </>
      );
   }
}

const AppDrawerNavigator = createDrawerNavigator({
   Dashboard: {
      screen: Dashboard
   },
   Fitness: {
      title: 'Fitness Tracker',
      screen: Fitness
   },
   Profile: {
      title: 'Profile',
      screen: User
   },
},
   {
      navigationOptions: {
         headerStyle: {backgroundColor: '#2980b9'},
         headerTintColor: '#fff'
      }
   }
);

const AppSwitchNavigator = createSwitchNavigator({
   login:{screen:Login},
   signUp:{screen:Signup},
   AddActivity: {
      screen: AddActivity
   },
   EditActivity: {
      screen: EditActivity
   },
   loggedIn:{screen:AppDrawerNavigator}
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default AppContainer;

