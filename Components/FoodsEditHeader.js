import React from "react";
import {View, StyleSheet, Text} from "react-native";
import Icon from "react-native-vector-icons/AntDesign";

const FoodsEditHeader = ({ navigation, mealId, title }) => (
   <View style={[styles.container]}>
      <Icon
         name="arrowleft"
         onPress={() => navigation.navigate("Foods", {id : mealId})}
         size={32}
         color="black"
      />
      <Text style={{paddingTop:3, fontSize:20, paddingLeft:7}}>{title}</Text>
   </View>



);



const styles = StyleSheet.create({
   container: {
      height: 65,
      paddingTop: 27,
      borderBottomWidth: 2,
      flexDirection:'row'

   }
});

export default FoodsEditHeader;