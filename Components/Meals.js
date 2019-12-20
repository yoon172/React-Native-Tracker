import * as React from 'react';
import User from "./User";
import Header from "./Header";
import {AsyncStorage, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {FAB} from "react-native-paper";
import MealCard from "./MealCard";

class Meals extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         meals: [],
         token: ''
      };
   }

   async deleteMeal(id) {
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/meals/';
      defaultUrl = defaultUrl + id;
      await fetch(defaultUrl, {
         method: 'DELETE',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token
         },
      })
         .then((response) => response.json())
         .then((responseData) => {
            console.log(responseData);
         })
         .done();
      await this.updateAPI().then();
   }

   getData = async (key) => {
      try {
         let data = await AsyncStorage.getItem(key);
         this.setState({[key]: data});
      } catch (errorMessage) {
         console.log(errorMessage);
      }
   };

   handleObject = (data) => {
      for (let [key, value] of Object.entries(data)) {
         this.setState({[key]: value});
      }
      this.makeCards();
   };

   makeCards() {
      let cardArr = [];
      for (let i = 0; i < this.state.meals.length; i++) {
         let dateString = this.state.meals[i].date;
         let T_location = dateString.indexOf('T');
         let date = dateString.substring(0, T_location);
         cardArr.push(<MealCard navigation={this.props.navigation} key={i} id={this.state.meals[i].id}
                                name={this.state.meals[i].name} date={date}
                                deleteMeal={(data) => this.deleteMeal(data)}/>);
      }
      return cardArr;
   }

   async updateAPI() {
      await this.getData("token");
      let token = this.state.token;
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'meals/';
      await fetch(defaultUrl, {
         method: 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
         },
      })
         .then((response) => response.json())
         .then((responseData) => {
            this.handleObject(responseData);
         })
         .done();
   }


   componentDidMount() {
      // On mount, do the first update
      this.updateAPI().then(); // Function that updates component from fetch
      // Subscribe that same function to focus events on the component in the future
      this.focusListener = this.props.navigation.addListener('didFocus', () => {
         this.updateAPI().then();
      });
   }

   componentWillUnmount() {
      // Remove the event listener
      this.focusListener.remove();
   }


   render() {
      return (
         <>
            <Header navigation={this.props.navigation} title={"Meals Tracking"}/>
            <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
               <SafeAreaView style={styles.container}>
                  <ScrollView style={styles.scrollView}>
                     <View>{this.makeCards()}</View>
                  </ScrollView>
               </SafeAreaView>
            </KeyboardAvoidingView>

            <FAB
               icon="plus"
               color={"purple"}
               size={50}
               style={styles.addButton}
               onPress={() => this.props.navigation.navigate('AddMeal')}
            />
         </>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
   },
   addButton: {
      alignSelf: 'flex-end',
      position: 'absolute',
      bottom: 35,
      right: 15
   }
});
export default Meals;