import * as React from 'react';
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
import AddFitnessHeader from "./AddFitnessHeader";

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
      if (responseData == null || responseData.length <= 0) {
         return "";
      } else {
         if(responseData[Object.keys(responseData)[1]] === "Activity created!") {
            alert(responseData[Object.keys(responseData)[1]]);
            this.setState({activityName:''});
            this.setState({duration:''});
            this.setState({calories:''});
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
      if (isNaN(this.state.duration) === false && isNaN(this.state.calories) === false) {
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
               console.log(responseData);
               this.getAddResponse(responseData);
            })
            .done();
      } else {
         alert("Duration and Calories can only accept numeric values");
      }
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
            <AddFitnessHeader title={"Add Activity"} navigation={this.props.navigation}/>
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
   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
   }
});


export default AddActivity;