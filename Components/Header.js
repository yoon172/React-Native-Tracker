
import Icon from "react-native-vector-icons/Entypo";
import React from "react";
import {View, StyleSheet, Text} from "react-native";


const CustomHeader = ({ navigation, title }) => (
   <View style={[styles.container]}>
      <Icon
         name="menu"
         onPress={() => navigation.openDrawer()}
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

export default CustomHeader;