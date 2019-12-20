import * as React from "react";
import {AsyncStorage, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {FAB} from "react-native-paper";
import FoodsHeader from "./FoodsHeader";
import FoodCard from "./FoodCard";

class Foods extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         foods: [],
         token: '',
         mealName: ''
      };
   }


   async deleteFood(id) {
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      let mealId = this.props.navigation.getParam('id', '');
      defaultUrl = defaultUrl + 'meals/' + mealId + '/foods/' + id;
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
      for (let i = 0; i < this.state.foods.length; i++) {
         cardArr.push(<FoodCard navigation={this.props.navigation} key={i}
                                mealId={this.props.navigation.getParam('id', '')} foodId={this.state.foods[i].id}
                                name={this.state.foods[i].name}
                                fat={this.state.foods[i].fat} carbohydrates={this.state.foods[i].carbohydrates}
                                protein={this.state.foods[i].protein}
                                calories={this.state.foods[i].calories} deleteFood={(data) => this.deleteFood(data)}/>);
      }
      return cardArr;
   }

   async updateAPI() {
      await this.getData("token");
      this.setState({mealName: this.props.navigation.getParam('name', '')});
      let mealId = this.props.navigation.getParam('id', '');
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'meals/' + mealId + '/foods/';

      await fetch(defaultUrl, {
         method: 'GET',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token
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
            <FoodsHeader navigation={this.props.navigation} title={"Foods in Meal " + (this.state.mealName)}/>
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
               onPress={() => this.props.navigation.navigate('AddFood', {
                  id: this.props.navigation.getParam('id', ''),
                  name: this.props.name
               })}
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

export default Foods;
