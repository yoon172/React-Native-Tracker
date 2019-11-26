
import Icon from "react-native-vector-icons/AntDesign";
import React from "react";
import {View, StyleSheet, Text} from "react-native";


const AddFitnessHeader = ({title, navigation}) => (
   <View style={[styles.container]}>
      <Icon
         name="arrowleft"
         onPress={() => navigation.navigate("Fitness")}
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

export default AddFitnessHeader;