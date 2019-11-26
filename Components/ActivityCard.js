import * as React from 'react';
import {Avatar, Button, Card, Title, Paragraph, FAB} from 'react-native-paper';
import {AsyncStorage, StyleSheet, View} from "react-native";


class ActivityCard extends React.Component {

   delete () {
      this.props.deleteActivity(this.props.id).then();
   }

   render () {
      return(
         <>
            <Card style={styles.cardStyle}>
               <Card.Title name={this.props.name} left={(props) => <Avatar.Icon {...props} icon="walk" />} />
               <Card.Content>
                  <View style={{flexDirection:'column'}}>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Title>{this.props.name}</Title>
                        <Paragraph>{this.props.date}</Paragraph>
                     </View>
                     <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                        <Paragraph>Calories: {this.props.calories}</Paragraph>
                        <Paragraph>Duration: {this.props.duration}</Paragraph>
                     </View>
                  </View>
               </Card.Content>
{/*
               <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
*/}
               <Card.Actions>
                  <Button icon="delete" onPress={() =>this.delete()}>
                     Delete
                  </Button>
                  <Button icon="pencil-outline"  onPress = {() => this.props.navigation.navigate('EditActivity',{id : this.props.id, name:this.props.name, calories:this.props.calories, duration:this.props.duration, date: this.props.date})}>Edit Activity</Button>
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
   },
   addButton: {
      alignSelf: 'center',
      position: 'absolute',
/*      bottom: 35,
      right: 15*/
   }

});
export default ActivityCard;