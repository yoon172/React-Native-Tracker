import React from 'react';
import {
   View,
   StyleSheet,
   Text,
   TextInput,
   Keyboard,
   KeyboardAvoidingView,
   TouchableWithoutFeedback,
   TouchableHighlight,
   AsyncStorage, ScrollView
} from 'react-native';
import { Button} from "react-native-paper";
import IconRun from "react-native-vector-icons/FontAwesome5";
import IconFood from "react-native-vector-icons/MaterialCommunityIcons";
import base64 from 'react-native-base64'
class Login extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         username : '',
         password : '',
         token:'',
         response:''
      };

   }

   handleChanges = (value, text) => {
      this.setState({[value]:text}, function() {
      });
   };

   async saveToken(key, token) {
      await AsyncStorage.setItem(key, token);
   }


   async loginAttempt() {
      await fetch('https://mysqlcs639.cs.wisc.edu/login', {
         method: 'GET',
         headers: {'Authorization': 'Basic ' + base64.encode(this.state.username + ":" + this.state.password)},
      })
         .then((response) => response.json())
         .then((responseData) => {
            if (responseData !== "") {
               let key;
               let value;
               for (let [key2, value2] of Object.entries(responseData)) {
                  key = key2;
                  value = value2;
                  break;
               }
               if (key === "token") {
                  this.setState({[key]: value}, function() {
                     console.log("");
                  });
                  this.saveToken("token",value);
                  this.saveToken("username", this.state.username);
                  this.props.navigation.navigate('Dashboard', {token: this.state.token, username: this.state.username})
               } else if(this.state.password.length < 5 || this.state.username.length < 5) {
                  alert("Username/Password must be at least 5 characters long");
                  this.setState({username:'', password:''}, function() {
                     console.log("");
                  });
               }
               else {
                  alert("Invalid Username/Password");
                  this.setState({username:'', password:''}, function() {
                     console.log("");
                  });
               }

            }
         })
         .done();
   }

   render() {

      return (

         <View style={{backgroundColor:'whitesmoke', flex:1, flexDirection:'column'}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <KeyboardAvoidingView style={{backgroundColor:'whitesmoke', flex: 1, justifyContent: 'center', alignItems: 'center'}} behavior="padding" enabled>
            <View style={{flex:0.5, backgroundColor:'whitesmoke', alignItems:'center', justifyContent:'center'}}>
               <Text style={styles.title}>Fitness/Calorie Tracking App</Text>
            </View>
            <View style={{flex:0.5,flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
               <IconRun
                  name={"running"}
                  color="#add8e6"
                  size={60}
                  style={{marginBottom:25}}
               />
               <IconFood
                  name={"food-apple"}
                  color="#DB7093"
                  size={60}
                  style={{marginLeft:10, marginBottom:25}}
               />
            </View>
            <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'whitesmoke'}}>
               <Text style={styles.subTitle}>Login</Text>
            </View>
            <View style={{flex:0.7,backgroundColor:'whitesmoke', alignItems:'center', justifyContent:'center'}}>
               <View style={{backgroundColor:'whitesmoke', flexDirection: 'row', justifyContent:'space-evenly'}}>
                  <Text style={{marginRight: 30, marginTop: 10}}>Username: </Text>
                  <TextInput
                     style={{ height: 40, width:170, borderColor: 'gray', borderWidth: 1}}
                     onChangeText={text => this.handleChanges("username",text)}
                     placeholder='Write Here'
                  />
               </View>

               <View style={{backgroundColor:'whitesmoke', flexDirection: 'row', justifyContent:'space-evenly', marginTop:30}}>
                  <Text style={{marginRight: 32, marginTop: 10}}>Password: </Text>
                  <TextInput
                     style={{ height: 40, width:170, borderColor: 'gray', borderWidth: 1}}
                     onChangeText={text => this.handleChanges("password",text)}
                     placeholder='Write Here'
                     secureTextEntry={true}
                  />
               </View>

            </View>

                  <View style={{
                     flex: 1.5,
                     flexDirection:'row',
                     backgroundColor: 'whitesmoke',
                     alignItems: 'center',
                     justifyContent: 'space-evenly',
                     width:'100%'
                  }}>
                     <Button
                        color={"purple"}
                        mode="contained"
                        size={50}
                        style ={styles.addButton}
                        onPress={() => this.loginAttempt()}
                     >Login</Button>
                     <Button
                        color={"purple"}
                        mode="contained"
                        size={50}
                        style ={styles.addButton}
                        onPress={() => this.props.navigation.navigate('signUp')}>
                     Sign Up</Button>
                  </View>
               </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
         </View>


      );
   }
}


const styles = StyleSheet.create({
   buttonStyle: {
      flex: 1,
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#007aff',
      marginLeft: 5,
      marginRight: 5
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
   }
});

export default Login;