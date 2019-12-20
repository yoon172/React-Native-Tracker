import * as React from "react";
import {
   AsyncStorage,
   Dimensions,
   Keyboard,
   KeyboardAvoidingView,
   SafeAreaView,
   ScrollView, StyleSheet,
   TouchableWithoutFeedback,
   View
} from "react-native";
import {Button, TextInput} from "react-native-paper";
import DateCalendar from "./DateCalendar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MealHeader from "./MealHeader";

class AddMeal extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         mealName: '',
         mealDate: '',
         token: '',
         dateData: ''
      };
   }


      getAddResponse = (responseData) => {
         if (responseData == null || responseData.length <= 0) {
            return "";
         } else {
            if(responseData[Object.keys(responseData)[1]] === "Meal created!") {
               alert(responseData[Object.keys(responseData)[1]]);
               this.setState({mealName:''});
            }
            else {
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
         this.setState({[key]:data});
      }
      catch (errorMessage) {
         console.log(errorMessage);
      }
   };

   getDate = (dateData) => {
      this.setState({activityDate: dateData});
   };

   async addMeal() {
      await this.getData("token");
      let token = this.state.token;

      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'meals/';
      await fetch(defaultUrl, {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': token
         },
         body: JSON.stringify({
            name: this.state.mealName,
            date: this.state.mealDate,
         })
      })
         .then((response) => response.json())
         .then((responseData) => {
            this.getAddResponse(responseData);
         })
         .done();
   }

   render() {
      return (
         <>
            <MealHeader navigation={this.props.navigation} title={"Add Meal"}/>
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
                              paddingTop: 70
                           }}>
                              <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                 <TextInput
                                    style={{
                                       height: 60,
                                       width: Dimensions.get('window').width - 20,
                                       borderColor: 'gray',
                                       borderWidth: 1
                                    }}
                                    label='Meal Name'
                                    onChangeText={text => this.handleChanges("mealName", text)}
                                    value={this.state.mealName}
                                 />
                              </View>
                           </View>
                              <View style={{
                                 flex: 1,
                                 paddingTop: 40,
                                 alignItems: 'center',
                                 justifyContent: 'center'
                              }}>
                                 <DateCalendar getDate={(data) => this.getDate(data)}/>
                              </View>


                              <View style={{
                                 flex: 2,
                                 flexDirection: 'row',
                                 alignItems: 'center',
                                 justifyContent: 'space-evenly',
                                 width: '100%',
                                 paddingTop: 80
                              }}>
                                 <Button
                                    color={"purple"}
                                    mode="contained"
                                    size={50}
                                    onPress={() => this.addMeal()}
                                 >Add Meal</Button>
                                 <Button
                                    color={"purple"}
                                    mode="contained"
                                    size={50}
                                    onPress={() => this.props.navigation.navigate('Meals')}
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

export default AddMeal;

