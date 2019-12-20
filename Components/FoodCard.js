import * as React from 'react';
import {Avatar, Button, Card, Title, Paragraph, FAB} from 'react-native-paper';
import {StyleSheet, View} from "react-native";


class FoodCard extends React.Component {

   delete() {
      this.props.deleteFood(this.props.foodId).then();
   }

   render() {
      return (
         <>
            <Card style={styles.cardStyle}>
               <Card.Title name={this.props.name} left={(props) => <Avatar.Icon {...props} icon="food-apple"/>}/>
               <Card.Content>
                  <View style={{flexDirection: 'column'}}>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Title>{(this.props.name !== undefined ? this.props.name : '')}</Title>
                        <Paragraph>Calories: {this.props.calories}kcal</Paragraph>
                        <Paragraph>Carbohydrates: {this.props.carbohydrates}g</Paragraph>
                        <Paragraph>Protein: {this.props.protein}g</Paragraph>
                        <Paragraph>Fat: {this.props.fat}g</Paragraph>
                     </View>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                     </View>
                  </View>
               </Card.Content>
               <Card.Actions>
                  <Button icon="delete" onPress={() => this.delete()}>
                     Delete
                  </Button>
                  <Button icon="pencil-outline" onPress={() => this.props.navigation.navigate('EditFood', {
                     mealId:
                     this.props.mealId, foodId: this.props.foodId, name: this.props.name,
                     calories: this.props.calories, carbohydrates: this.props.carbohydrates,
                     protein: this.props.protein, fat: this.props.fat
                  })}>Edit Food</Button>
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
      marginTop: 7
   }

});
export default FoodCard;