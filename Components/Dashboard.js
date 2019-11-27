import React from "react";
import {AsyncStorage, KeyboardAvoidingView, SafeAreaView, ScrollView, StyleSheet, Text, View, Dimensions} from "react-native";
import Header from "./Header";
import {DataTable, Avatar, Card, Title, Paragraph} from 'react-native-paper';
import moment from "moment";
import ActivityCard from "./ActivityCard";

class Dashboard extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         activities : [],
         meals:[],
         mealFood:{},
         token : '',
         todayDate: '',
         goalDailyActivity: 0,
         goalDailyCalories: 0,
         goalDailyCarbohydrates: 0,
         goalDailyFat: 0,
         goalDailyProtein: 0,
      };

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


   handleObject = (data) => {
      for (let [key, value] of Object.entries(data)) {
         this.setState({[key]: value});
      }
   };



   makeMealsCells () {
      let cellArr = [];
      let mealFoodObj = this.state.mealFood;
      let mealArr = this.state.meals;
      for (let i = 0; i < mealArr.length; i++) {
         let dateString = mealArr[i].date;
         let T_location = dateString.indexOf('T');
         let date = dateString.substring(0, T_location);

         let currentDate = this.state.todayDate;
         let actDate = new Date(dateString.substring(0, 4), dateString.substring(5, 7) - 1, dateString.substring(8, 10));

         let curMoment = moment(currentDate);
         let actMoment = moment(actDate);

         let dateDiff = curMoment.diff(actMoment, 'days');

         if (dateDiff < 7 && curMoment >= actMoment) {
            let mealFoods = mealFoodObj[mealArr[i].id];
            if(mealFoods !== undefined) {
               for(let i = 0; i < mealFoods.length; i++) {
                  cellArr.push(
                     <DataTable.Row>
                        <DataTable.Cell>{mealFoods[i].name}</DataTable.Cell>
                        <DataTable.Cell numeric>{mealFoods[i].calories}</DataTable.Cell>
                        <DataTable.Cell numeric>{mealFoods[i].protein}</DataTable.Cell>
                        <DataTable.Cell numeric>{mealFoods[i].carbohydrates}</DataTable.Cell>
                        <DataTable.Cell numeric>{mealFoods[i].fat}</DataTable.Cell>
                     </DataTable.Row>
                  );
            }

            }
         }
      }
      return cellArr;
   }



   makeActivityCells () {
      let cellArr = [];
      for (let i = 0; i < this.state.activities.length; i++) {
         let dateString = this.state.activities[i].date;
         let T_location = dateString.indexOf('T');
         let date = dateString.substring(0, T_location);

         let currentDate = this.state.todayDate;
         let actDate = new Date(dateString.substring(0, 4), dateString.substring(5, 7) - 1, dateString.substring(8, 10));

         let curMoment = moment(currentDate);
         let actMoment = moment(actDate);

         let dateDiff = curMoment.diff(actMoment, 'days');

         if (dateDiff < 7 && curMoment >= actMoment) {
            cellArr.push(
               <DataTable.Row key={i}>
                  <DataTable.Cell>{this.state.activities[i].name}</DataTable.Cell>
                  <DataTable.Cell numeric>{date}</DataTable.Cell>
                  <DataTable.Cell numeric>{this.state.activities[i].duration}</DataTable.Cell>
                  <DataTable.Cell numeric>{this.state.activities[i].calories}</DataTable.Cell>
               </DataTable.Row>
            );
         }

      }

      return cellArr;
   }

   getRandomPicture () {
      let pictureArr = [
         require('../exercise.jpg'),
         require('../exercise2.jpg'),
         require('../exercise3.jpg'),
         require('../exercise4.jpg'),

      ];
      return pictureArr[Math.floor(Math.random()*4)];
   }

   makeGoalCells() {
      let returnArr = [];
      let totalCaloriesBurned = 0;
      let totalDuration = 0;
      for (let i = 0; i < this.state.activities.length; i++) {
         let dateString = this.state.activities[i].date;
         let T_location = dateString.indexOf('T');
         let date = dateString.substring(0,T_location);
         if(date === this.state.todayDate) {
            totalCaloriesBurned += this.state.activities[i].calories;
            totalDuration += this.state.activities[i].duration;
         }
      }

      let randomPicture = this.getRandomPicture();

      returnArr.push(

         <Card key={1} style={styles.cardStyle}>
            <Card.Title name={"Goal Overview"} left={(props) => <Avatar.Icon {...props} icon="run-fast" />} />
            <Card.Content>
               <Card.Cover source={randomPicture} />
               <View style={{flexDirection:'column'}}>
                  <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                  </View>
                  <View style={{alignItems: 'center', justifyContent: 'space-evenly'}}>
                     <Title>Goals</Title>
                     <Paragraph>Total Calories Burned: {totalCaloriesBurned}</Paragraph>
                     <Paragraph>Activity Duration: {totalDuration}</Paragraph>
                     <Paragraph>Activity Goal: {this.state.goalDailyActivity}</Paragraph>
                     <Paragraph>Calorie Goal: {this.state.goalDailyCalories}</Paragraph>
                     <Paragraph>Calories to go till goal: {this.state.goalDailyCalories - totalCaloriesBurned}</Paragraph>
                  </View>
               </View>
            </Card.Content>
         </Card>
      );

   return returnArr;
   }

   async updateAPI () {
      let day = new Date().getDate();
      let month = new Date().getMonth() + 1;
      let year = new Date().getFullYear();
      this.setState({
         todayDate:
            year + '-' + month + '-' + day
      });
      await this.getData("token");
      let token = this.state.token;
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'activities/';
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


      await this.getData("username");
      let username = this.state.username;
      let defaultUrlProfile = 'https://mysqlcs639.cs.wisc.edu/users/';
      this.setState({token: token});
      defaultUrlProfile = defaultUrlProfile + username;
      await fetch(defaultUrlProfile, {
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

         });


      let mealsUrl = 'https://mysqlcs639.cs.wisc.edu/';
      mealsUrl = mealsUrl + 'meals/';

      await fetch(mealsUrl, {
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
         });


      let mealIds = [];
      let tempObj = {};
      let mealsArray = this.state.meals;
      for (let i = 0; i < mealsArray.length; i++) {
         mealIds.push(mealsArray[i].id);
      }
      for (let i = 0; i < mealIds.length; i++) {
         let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
         defaultUrl = defaultUrl + 'meals/' + mealIds[i] + '/foods/';

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
                  let mealId = mealIds[i];
                  /*let tempObj = JSON.parse(JSON.stringify(this.state.mealFood));*/
                  tempObj[mealId] = responseData["foods"];

               }
            )
      }
      this.setState({mealFood:tempObj});

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

            <Header navigation={this.props.navigation} title={"Dashboard"} />
            <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
               <SafeAreaView style={styles.container}>
                  <ScrollView style={styles.scrollView}>
                  <View style={{backgroundColor:'whitesmoke', flex:1, flexDirection:'column'}}>
                     <View style={{backgroundColor:'whitesmoke', alignItems:'center', justifyContent:'center',paddingVertical:20, marginTop: 30, marginBottom:20}}>

                           <Avatar.Icon size={50} icon="account" style={{padding:5}} />
                           <Text style={styles.subTitle}>{this.state.todayDate}</Text>

                     </View>
                     <View style={{flex:1, alignItems:'center', justifyContent:'flex-start'}}>
                        <Text style={styles.title}>Goals Overview</Text>
                           {this.makeGoalCells()}
                     </View>

                        <View style={{flex:1, alignItems:'center', justifyContent:'flex-start'}}>
                           <Text style={styles.title}>Food Consumed (7 days)</Text>
                           <DataTable style={{borderWidth:1}}>
                              <DataTable.Header>
                                 <DataTable.Title>Food</DataTable.Title>
                                 <DataTable.Title numeric>Calories</DataTable.Title>
                                 <DataTable.Title numeric>Protein</DataTable.Title>
                                 <DataTable.Title numeric>Carbs</DataTable.Title>
                                 <DataTable.Title numeric>Fat</DataTable.Title>
                              </DataTable.Header>
                              {this.makeMealsCells()}
                           </DataTable>
                        </View>
                     <View style={{flex:1, alignItems:'center', justifyContent:'flex-start'}}>
                        <Text style={styles.title}>Fitness (7 days)</Text>
                        <DataTable style={{borderWidth:1}}>
                           <DataTable.Header>
                              <DataTable.Title>Activity</DataTable.Title>
                              <DataTable.Title numeric>Date</DataTable.Title>
                              <DataTable.Title numeric>Duration</DataTable.Title>
                              <DataTable.Title numeric>Calories</DataTable.Title>
                           </DataTable.Header>
                           {this.makeActivityCells()}
                        </DataTable>
                     </View>
                  </View>
                  </ScrollView>
               </SafeAreaView>
            </KeyboardAvoidingView>




         </>
         );
   }
}

const styles = StyleSheet.create({
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom:10
   },
   subTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      paddingTop:15
   },
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
   },
   cardStyle: {
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#ed2aff',
      marginLeft: 5,
      marginRight: 5,
      marginTop:7,
      width: Dimensions.get('window').width - 10
   }
});
export default Dashboard;