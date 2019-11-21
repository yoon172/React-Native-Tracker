import React from "react";
import {
   View,
   StyleSheet,
   SafeAreaView,
   Text,
   Button,
   ScrollView,
   KeyboardAvoidingView,
   Dimensions,
   AsyncStorage,
   TouchableOpacity,
   Alert
} from 'react-native';
import Icon from "react-native-vector-icons/AntDesign";
import Header from "./Header";
import { TextInput } from 'react-native-paper';


class User extends React.Component {
/*   static navigationOptions = {
      header: null
   };*/

   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         admin: '',
         firstName: '',
         goalDailyActivity: 0,
         goalDailyCalories: 0,
         goalDailyCarbohydrates: 0,
         goalDailyFat: 0,
         goalDailyProtein: 0,
         lastName: '',
         username: '',
         token: '',
         response:''
      };

   }


   deleteAccount() {
      Alert.alert(
         'Delete Account',
         'Are you sure you want to delete your account?',
         [
            {text: 'YES', onPress: () => {this.deleteAccountConfirmed().then()}},
            {text: 'NO', style: 'cancel'},
         ]
      );
   }


   async deleteAccountConfirmed() {
      await this.removeData("token");
      await this.removeData("username");
      let token = this.state.token;
      let username = this.state.username;     /*this.props.navigation.getParam("username", "No username");*/
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/users/';
      defaultUrl = defaultUrl + username;
      await fetch(defaultUrl, {
         method: 'DELETE',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
         }
      })
         .then((response) => response.json())
         .then((responseData) => {
            this.getDeleteResponse(responseData);
         })
         .done();
         this.props.navigation.navigate("login");
   }

   logout() {
      Alert.alert(
         'Logout',
         'Would you like to Logout?',
         [
            {text: 'YES', onPress: () => {this.logoutConfirmed().then()}},
            {text: 'NO', style: 'cancel'},
         ]
      );
   }


   async logoutConfirmed () {
      await this.removeData("token");
      await this.removeData("username");
      this.props.navigation.navigate("login");
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

   removeData = async (key) => {
      try {
         await AsyncStorage.removeItem(key);
      }
      catch(errorMessage) {
         console.log(errorMessage);
      }
   };



   async editAttempt() {
      let token = this.state.token;
      let username = this.state.username;     /*this.props.navigation.getParam("username", "No username");*/
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/users/';
      defaultUrl = defaultUrl + username;
      if (this.state.goalDailyActivity === '') {
         this.setState({goalDailyActivity:0}, function(){
            console.log("");
         });
      }
      if (this.state.goalDailyCalories === '') {
         this.setState({goalDailyCalories: 0}, function () {
            console.log("");
         });
      }
      if (this.state.goalDailyFat === '') {
         this.setState({goalDailyFat: 0}, function () {
            console.log("");
         });
      }
      if (this.state.goalDailyProtein === '') {
         this.setState({goalDailyProtein: 0}, function () {
            console.log("");
         });
      }
      if (this.state.goalDailyCarbohydrates === '') {
         this.setState({goalDailyCarbohydrates: 0}, function () {
            console.log("");
         });
      }
      await fetch(defaultUrl, {
         method: 'PUT',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
         },
         body: JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            goalDailyCalories: this.state.goalDailyCalories,
            goalDailyProtein: this.state.goalDailyProtein,
            goalDailyCarbohydrates: this.state.goalDailyCarbohydrates,
            goalDailyFat: this.state.goalDailyFat,
            goalDailyActivity: this.state.goalDailyActivity,
         })
      })
         .then((response) => response.json())
         .then((responseData) => {
            console.log(responseData);
            this.getEditResponse(responseData);
         })
         .done();
   }

   getEditResponse = (responseData) => {
      let errorString = "(builtins.ValueError)";
      if (responseData == null || responseData.length <= 0) {
         return "";
      } else {
         if(responseData[Object.keys(responseData)[0]] === "User has been updated!") {
            alert(responseData[Object.keys(responseData)[0]]);
         }
         else if(responseData[Object.keys(responseData)[0]].substring(0, errorString.length) === "(builtins.ValueError)") {
            alert("Nutrition and fitness inputs can only accept numeric values");
         }
         else {
            alert("Error while saving");
         }
      }
   };


   getDeleteResponse = (responseData) => {
      if (responseData == null || responseData <= 0) {
         return "";
      } else {
         if(responseData[Object.keys(responseData)[0]] === "User has been deleted!") {
            alert(responseData[Object.keys(responseData)[0]]);
         } else {
            alert("Error while deleting");
         }
      }
   };

   handleObject = (data) => {
      for (let [key, value] of Object.entries(data)) {
         this.setState({[key]: value});
      }
   };

   handleChanges = (value, text) => {
      this.setState({[value]: text}, function () {
      });
   };


   async componentDidMount() {

      await this.getData("token");
      await this.getData("username");
      let token = this.state.token;
      let username = this.state.username;
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/users/';
      if (token !== "No token" && username !== "No username") {
         this.setState({token: token});
         defaultUrl = defaultUrl + username;
      }
      fetch(defaultUrl, {
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

   render() {
      return (

         <View style={{flex: 1, flexDirection: 'column'}}>
            <Header navigation={this.props.navigation} title={"Edit Profile"} />
            <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
               <SafeAreaView style={styles.container}>
                  <ScrollView style={styles.scrollView}>
                     <View style={{
                        flex: 1.2,
                        flexDirection:"row",
                        backgroundColor: 'whitesmoke',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        paddingTop: 5
                     }}>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                           <Text style={{color:'white', fontWeight:'bold'}}>Logout</Text>
                        </TouchableOpacity>
                        <Icon
                           name={"edit"}
                           color="#add8e6"
                           size={60}
                           style={{marginBottom: 25}}
                        />
                        <TouchableOpacity style={styles.deleteButton}  onPress={() => this.deleteAccount()}>
                           <Text style={{color:'white', fontWeight:'bold'}}>Delete Account</Text>
                        </TouchableOpacity>
                     </View>
                     <View style={{
                        flex: 0.7,
                        backgroundColor: 'whitesmoke',
                        alignItems: 'center',
                        justifyContent: 'center'
                     }}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              label='First Name'
                              onChangeText={text => this.handleChanges("firstName", text)}
                              value={this.state.firstName}
                           />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              label='Last Name'
                              onChangeText={text => this.handleChanges("lastName", text)}
                              value={this.state.lastName}
                           />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              keyboardType = 'numeric'
                              label='Daily Activity Goal'
                              onChangeText={text => this.handleChanges("goalDailyActivity", text)}
                              value={(this.state.goalDailyActivity).toString()}
                           />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              keyboardType = 'numeric'
                              label='Daily Calorie Goal'
                              onChangeText={text => this.handleChanges("goalDailyCalories", text)}
                              value={(this.state.goalDailyCalories).toString()}
                           />
                        </View>

                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              keyboardType = 'numeric'
                              label='Daily Carbohydrate Goal'
                              onChangeText={text => this.handleChanges("goalDailyCarbohydrates", text)}
                              value={(this.state.goalDailyCarbohydrates).toString()}
                           />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              keyboardType = 'numeric'
                              label='Daily Fat Goal'
                              onChangeText={text => this.handleChanges("goalDailyFat", text)}
                              value={(this.state.goalDailyFat).toString()}
                           />
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30, paddingBottom:10}}>
                           <TextInput
                              style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                              keyboardType = 'numeric'
                              label='Daily Protein Goal'
                              onChangeText={text => this.handleChanges("goalDailyProtein", text)}
                              value={(this.state.goalDailyProtein).toString()}
                           />
                        </View>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => this.editAttempt()}>
                           <Text style={{color:'white', fontWeight:'bold'}}>Edit</Text>
                        </TouchableOpacity>
                     </View>
                  </ScrollView>
               </SafeAreaView>
            </KeyboardAvoidingView>
         </View>

      );
   }


}


const styles = StyleSheet.create({
   buttonStyle: {
      backgroundColor: '#0800ff',
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#190fff',
      height: 50,
      width: 100,
      justifyContent: 'center',
      alignItems:'center',
      paddingHorizontal: 5,
      marginHorizontal:3
   },
   logoutButton: {
      backgroundColor: '#ff5d00',
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#ff6310',
      height: 40,
      width: 80,
      justifyContent: 'center',
      alignItems:'center',
      paddingHorizontal: 5
/*      marginLeft: 5,
      marginRight: 5*/
   },
   deleteButton: {
      backgroundColor: '#ff0017',
      borderRadius: 1,
      borderWidth: 1,
      borderColor: '#ff001a',
      height: 40,
      width: 80,
      justifyContent: 'center',
      alignItems:'center',
      paddingHorizontal: 5
   },
   title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20
   },
   subTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      marginBottom: 25
   },
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
   }
});


export default User;