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
import Meals from "./Components/Meals";
import AddMeal from "./Components/AddMeal";
import EditMeal from "./Components/EditMeal";
import Foods from "./Components/Foods";
import AddFood from "./Components/AddFood";
import EditFood from "./Components/EditFood";

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
      screen: Fitness,
      navigationOptions: () =>
         ({
            title: 'Fitness Tracker'
         })
   },
   Meals: {
      screen: Meals,
      navigationOptions: () =>
         ({
            title: 'Meals Tracker'
         })
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
   AddMeal: {
      screen: AddMeal
   },
   EditMeal: {
      screen:EditMeal
   },
   Foods: {
      screen:Foods
   },
   AddFood : {
      screen:AddFood
   },
   EditFood : {
      screen:EditFood
   },
   loggedIn:{screen:AppDrawerNavigator}
});

const AppContainer = createAppContainer(AppSwitchNavigator);

export default AppContainer;

