import * as React from "react";
import {
   AsyncStorage, Dimensions,
   Keyboard,
   KeyboardAvoidingView,
   SafeAreaView,
   ScrollView, StyleSheet,
   TouchableWithoutFeedback,
   View
} from "react-native";
import SwitchHeader from "./AddFitnessHeader";
import {Button, TextInput} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FoodsEditHeader from "./FoodsEditHeader";

class AddFood extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         foodName: '',
         foodCalories: '',
         foodProtein:'',
         foodCarbohydrates:'',
         foodFat:'',
         token: '',
      };
   }

   checkForNumericValues () {

      if (isNaN(this.state.foodCalories)) {
         alert('Calories only accepts numerical values');
         return false;
      }
      if (isNaN(this.state.foodProtein)) {
         alert('Protein only accepts numerical values');
         return false;
      }
      if (isNaN(this.state.foodCarbohydrates)) {
         alert('Carbohydrates only accepts numerical values');
         return false;
      }
      if (isNaN(this.state.foodFat)) {
         alert('Fat only accepts numerical values');
         return false;
      }
      return true;
   }

   getAddResponse = (responseData) => {
      if (responseData == null || responseData.length <= 0) {
         return "";
      } else {
         if (responseData[Object.keys(responseData)[1]] === "Food created!") {
            alert(responseData[Object.keys(responseData)[1]]);
            this.setState({foodName: ''});
            this.setState({foodCarbohydrates: ''});
            this.setState({foodFat: ''});
            this.setState({foodProtein: ''});
            this.setState({foodCalories: ''});
         } else {
            alert("Error while Adding");

         }
      }
   };

   handleChanges = (value, text) => {
      this.setState({[value]: text}, function () {
         console.log("");
      });
   };

   getData = async (key) => {
      try {
         let data = await AsyncStorage.getItem(key);
         this.setState({[key]: data});
      } catch (errorMessage) {
         console.log(errorMessage);
      }
   };


   async AddFood() {
      await this.getData("token");
      let mealId = this.props.navigation.getParam('id', '');
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'meals/' + mealId + '/foods/';

      if (this.state.foodCalories === '') {
         this.setState({foodCalories:0}, function(){
            console.log("");
         });
      }
      if (this.state.foodCarbohydrates === '') {
         this.setState({foodCarbohydrates: 0}, function () {
            console.log("");
         });
      }
      if (this.state.foodFat === '') {
         this.setState({foodFat: 0}, function () {
            console.log("");
         });
      }
      if (this.state.foodProtein === '') {
         this.setState({foodProtein: 0}, function () {
            console.log("");
         });
      }
      if(this.checkForNumericValues()) {
         await fetch(defaultUrl, {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'x-access-token': this.state.token
            },
            body: JSON.stringify({
               name: this.state.foodName,
               calories: this.state.foodCalories,
               protein:this.state.foodProtein,
               carbohydrates:this.state.foodCarbohydrates,
               fat:this.state.foodFat
            })
         })
            .then((response) => response.json())
            .then((responseData) => {
               this.getAddResponse(responseData);
            })
            .done();
      }
   }

   render() {
      return (
         <>
            <FoodsEditHeader navigation={this.props.navigation} mealId ={this.props.navigation.getParam('id', '')}
                             title={"Add Food"}/>
            <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'white'}}>
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <KeyboardAvoidingView behavior={this.state.behavior} style={styles.container}>
                     <SafeAreaView style={styles.container}>
                        <ScrollView style={styles.scrollView}>
                           <View style={{
                              flex: 1.2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: 5
                           }}>
                              <Icon
                                 name={"food"}
                                 color="#add8e6"
                                 size={60}
                                 style={{marginBottom: 25}}
                              />
                           </View>
                           <View style={{
                              flex: 2,
                              alignItems: 'center',
                              justifyContent: 'center',
                              paddingTop: 40
                           }}>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:15}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Food Name'
                                    onChangeText={text => this.handleChanges("foodName", text)}
                                    value={this.state.foodName}
                                 />
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:15}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Calories (kcal)'
                                    keyboardType = 'numeric'
                                    onChangeText={text => this.handleChanges("foodCalories", text)}
                                    value={(this.state.foodCalories).toString()}
                                 />
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:15}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Carbohydrates (g)'
                                    keyboardType = 'numeric'
                                    onChangeText={text => this.handleChanges("foodCarbohydrates", text)}
                                    value={(this.state.foodCarbohydrates).toString()}
                                 />
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:15}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Fat (g)'
                                    keyboardType = 'numeric'
                                    onChangeText={text => this.handleChanges("foodFat", text)}
                                    value={(this.state.foodFat).toString()}
                                 />
                              </View>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly', marginTop:15}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Protein (g)'
                                    keyboardType = 'numeric'
                                    onChangeText={text => this.handleChanges("foodProtein", text)}
                                    value={(this.state.foodProtein).toString()}
                                 />
                              </View>
                           </View>


                           <View style={{
                              flex: 2,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                              width: '100%',
                              paddingTop: 80,
                              paddingBottom:20
                           }}>
                              <Button
                                 color={"purple"}
                                 mode="contained"
                                 size={50}
                                 onPress={() => this.AddFood()}
                              >Add Food</Button>
                              <Button
                                 color={"purple"}
                                 mode="contained"
                                 size={50}
                                 onPress={() => this.props.navigation.navigate('Foods',{id : this.props.navigation.getParam('id', '')})}
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
      alignSelf: 'stretch',
      backgroundColor: '#fff',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#007aff',
      marginLeft: 5,
      marginRight: 5
   },

   container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingTop: 0,
   }
});

export default AddFood;