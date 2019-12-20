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
import Icon from "react-native-vector-icons/AntDesign";
import {Button, TextInput} from "react-native-paper";
import DateCalendar from "./DateCalendar";
import MealHeader from "./MealHeader";

class EditMeal extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         behavior: 'padding',
         token: '',
         mealName: '',
         mealDate: '',
         id: ''
      };
   }

   getData = async (key) => {
      try {
         let data = await AsyncStorage.getItem(key);
         this.setState({[key]: data});
      } catch (errorMessage) {
         console.log(errorMessage);
      }
   };

   async componentDidMount() {
      await this.getData("token");
      let id = this.props.navigation.getParam('id', '');
      let name = this.props.navigation.getParam('name', '');
      let date = this.props.navigation.getParam('date', '');
      this.setState({mealName: name, id: id, mealDate: date})
   }

   getEditResponse = (responseData) => {
      if (responseData == null || responseData <= 0) {
         return "";
      } else {
         if (responseData[Object.keys(responseData)[0]] === "Meal updated!") {
            alert(responseData[Object.keys(responseData)[0]]);
         } else {
            alert("Error while Adding");

         }
      }
   };

   async editActivity() {
      console.log('name: ' + this.state.mealName);
      console.log('date: ' + this.state.mealDate);
      let defaultUrl = 'https://mysqlcs639.cs.wisc.edu/';
      defaultUrl = defaultUrl + 'meals/' + this.state.id;
      await fetch(defaultUrl, {
         method: 'PUT',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': this.state.token
         },
         body: JSON.stringify({
            name: this.state.mealName,
            date: this.state.mealDate
         })
      })
         .then((response) => response.json())
         .then((responseData) => {
            this.getEditResponse(responseData);
         })
         .done();
   }

   handleChanges = (value, text) => {
      this.setState({[value]: text}, function () {
         console.log("");
      });
   };


   getDate = (dateData) => {
      this.setState({mealDate: dateData});
   };

   render() {
      return (
         <>
            <MealHeader navigation={this.props.navigation} title={"Edit Meal"}/>
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
                                 name={"edit"}
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
                              <DateCalendar date={this.props.navigation.getParam('date', undefined)}
                                            getDate={(data) => this.getDate(data)}/>
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
                                 onPress={() => this.editActivity()}
                              >Save Changes</Button>
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

export default EditMeal;