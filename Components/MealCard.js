import * as React from 'react';
import {Avatar, Button, Card, Title, Paragraph, FAB} from 'react-native-paper';
import {AsyncStorage, StyleSheet, View} from "react-native";


class MealCard extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         foods: [],
         token: '',
         totalCalories:'',
         totalCarbohydrates:'',
         totalProtein:'',
         totalFat:''
      };
   }


   delete () {
      this.props.deleteMeal(this.props.id).then();
   }


  getData = async (key) => {
      try {
         let data = await AsyncStorage.getItem(key);
         this.setState({[key]:data});
      }
      catch (errorMessage) {
         console.log(errorMessage);
      }
   };

   async handleObject(data) {
      for (let [key, value] of Object.entries(data)) {
         this.setState({[key]: value});
      }
      await this.createStates();
   };


   async componentDidMount() {
      await this.getData("token");
      let mealId = this.props.id;
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl +'meals/' + mealId + '/foods/';
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

   createStates() {
      let calories = 0;
      let carbohydrates = 0;
      let protein = 0;
      let fat = 0;
      for (let i = 0; i < this.state.foods.length; i++) {
         calories += this.state.foods[i].calories;
         carbohydrates += this.state.foods[i].carbohydrates;
         protein += this.state.foods[i].protein;
         fat += this.state.foods[i].fat;
      }
      this.setState({totalCalories:calories, totalCarbohydrates: carbohydrates, totalProtein: protein, totalFat:fat});
   }


   render () {
      return(
         <>
            <Card style={styles.cardStyle}>
               <Card.Title name={this.props.name} left={(props) => <Avatar.Icon {...props} icon="food" />} />
               <Card.Content>
                  <View style={{flexDirection:'column'}}>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Title>{this.props.name}</Title>
                        <Paragraph>{this.props.date}</Paragraph>
                     </View>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Paragraph>Total Calories: {this.state.totalCalories}kcal</Paragraph>
                        <Paragraph>Total Carbohydrates: {this.state.totalCarbohydrates}g</Paragraph>
                        <Paragraph>Total Protein: {this.state.totalProtein}g</Paragraph>
                        <Paragraph>Total Fat: {this.state.totalFat}g</Paragraph>
                     </View>
                  </View>
               </Card.Content>
               <Card.Actions>
                  <Button icon="delete" onPress={() =>this.delete()}>
                     Delete
                  </Button>
                  <Button icon="pencil-outline"  onPress = {() => this.props.navigation.navigate('EditMeal',{navigation: this.props.navigation, id : this.props.id, name:this.props.name, date: this.props.date})}>Edit Meal</Button>
                  <Button icon="food-apple"  onPress = {() => this.props.navigation.navigate('Foods',{navigation: this.props.navigation, id : this.props.id, name:this.props.name})}>Foods</Button>

               </Card.Actions>
            </Card>
         </>
      )
   }
}


const styles = StyleSheet.create({
   cardStyle: {
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ed2aff',
      marginLeft: 5,
      marginRight: 5,
      marginTop:7
   }

});
export default MealCard;