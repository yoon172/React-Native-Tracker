import React, { Component } from 'react'
import ReactDatePicker from 'react-native-datepicker'

export default class DateCalendar extends Component {
   constructor(props){
      super(props);
      this.state = {
         date:''
      }
   }

   sendDate = (dateData) => {
      this.setState({date: dateData});
      this.props.getDate(dateData);
   };

   componentDidMount() {
      if(this.props.date !== undefined) {
         this.setState({date:this.props.date})
      } else {
         this.setState({date:new Date()})
      }
   }

   render(){
      return (
         <ReactDatePicker
            style={{width: 200}}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            format="YYYY-MM-DD"
            minDate="2018-01-01"
            maxDate="2019-12-29"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
               dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
               },
               dateInput: {
                  marginLeft: 36
               }
            }}
            onDateChange={(date) => {this.sendDate(date)}}
         />
      )
   }
}