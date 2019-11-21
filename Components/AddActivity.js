import * as React from 'react';
import SwitchHeader from "./SwitchHeader";
import {
   AsyncStorage,
   Dimensions, Keyboard,
   KeyboardAvoidingView,
   SafeAreaView,
   ScrollView,
   StyleSheet,
   TouchableWithoutFeedback,
   View
} from "react-native";
import {TextInput, Button} from "react-native-paper";
import Icon from "react-native-vector-icons/AntDesign";
import DateCalendar from "./DateCalendar";

class AddActivity extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         activityName: '',
         activityDate:'',
         token:'',
         duration:'',
         calories:''
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

   getAddResponse = (responseData) => {
      let errorString = "(builtins.ValueError)";
      if (responseData == null || responseData <= 0) {
         return "";
      } else {
         if(responseData[Object.keys(responseData)[0]] === "Activity created!") {
            alert(responseData[Object.keys(responseData)[0]]);
            this.setState({activityName:''});
            this.setState({duration:''});
            this.setState({calories:''});
         }
         else if(responseData[Object.keys(responseData)[0]].substring(0, errorString.length) === "(builtins.ValueError)") {
            alert("Duration and Calories can only accept numeric values");
         }
         else {
            alert("Error while Adding");

         }
      }
   };

   async addActivity() {
      await this.getData("token");
      let token = this.state.token;

      if (this.state.calories === '') {
         this.setState({calories:'0'});
      }
      if (this.state.duration === '') {
         this.setState({duration:'0'});
      }
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl +'activities/';
      await fetch(defaultUrl, {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
         },
         body: JSON.stringify({
            name: this.state.activityName,
            date: this.state.activityDate,
            calories: this.state.calories,
            duration:this.state.duration
         })
      })
         .then((response) => response.json())
         .then((responseData) => {
            this.getAddResponse(responseData);
         })
         .done();

   }



   handleChanges = (value, text) => {
      this.setState({[value]:text}, function() {
         console.log("");
      });
   };


   getDate = (dateData) => {
      this.setState({activityDate: dateData});
   };

   render () {
      return (
         <>
            <SwitchHeader title={"Add Activity"}/>
                     <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'whitesmoke'}}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                           <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
                              <SafeAreaView style={styles.container}>
                                 <ScrollView style={styles.scrollView}>
                                 <View style={{
                                    flex: 1.2,
                                    backgroundColor: 'whitesmoke',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingTop: 5
                                 }}>
                                    <Icon
                                       name={"edit"}
                                       color="#add8e6"
                                       size={60}
                                       style={{marginBottom: 25}}
                                    />
                                 </View>
                                 <View style={{
                                    flex: 0.7,
                                    paddingTop:70,
                                    backgroundColor: 'whitesmoke',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                 }}>
                                 <View style={{flex:0.7,backgroundColor:'whitesmoke', alignItems:'center', justifyContent:'center'}}>
                                    <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                                       <TextInput
                                          style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1}}
                                          label='Activity Name'
                                          onChangeText={text => this.handleChanges("activityName", text)}
                                          value={this.state.activityName}
                                       />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                                       <TextInput
                                          style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1,marginTop:10}}
                                          label='Duration (min)'
                                          keyboardType = 'numeric'
                                          onChangeText={text => this.handleChanges("duration", text)}
                                          value={this.state.duration}
                                       />
                                    </View>
                                    <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                                       <TextInput
                                          style={{height: 60, width: Dimensions.get('window').width - 20, borderColor: 'gray', borderWidth: 1,marginTop:10}}
                                          label='Calories'
                                          keyboardType = 'numeric'
                                          onChangeText={text => this.handleChanges("calories", text)}
                                          value={this.state.calories}
                                       />
                                    </View>
                                 </View>
                                 </View>
                                 <View style={{
                                    flex: 3,
                                    paddingTop:60,
                                    backgroundColor: 'whitesmoke',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                 }}>
                                    <DateCalendar getDate={(data) => this.getDate(data)}/>
                                 </View>


                                 <View style={{
                                    flex: 2,
                                    flexDirection:'row',
                                    paddingTop:80,
                                    backgroundColor: 'whitesmoke',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly'
                                 }}>
                                    <Button
                                       color={"purple"}
                                       mode="contained"
                                       size={50}
                                       style ={styles.addButton}
                                       onPress = {() => this.addActivity()}
                                    >Add</Button>
                                    <Button
                                       color={"purple"}
                                       mode="contained"
                                       size={50}
                                       style ={styles.addButton}
                                       onPress = {() => this.props.navigation.navigate('Fitness')}
                                    >Go Back</Button>
                                 </View>
                                 </ScrollView>
                              </SafeAreaView>
                           </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                     </View>


         </>
      )
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
   },
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
   }
});


export default AddActivity;