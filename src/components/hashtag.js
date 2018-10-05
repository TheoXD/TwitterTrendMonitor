import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Chip, withTheme } from 'react-native-paper';

class Hashtag extends Component {
    constructor(props) {
      super(props);
  
      this.style = StyleSheet.create({
  
        hashtag : {
          borderRadius:8,
          fontSize: 16,
          margin: 4,
        }
      });
  
      this.state = {
        text : props.text,
        count: props.count
      };
    }
  
    render() {
      return(<Chip mode="outlined" style={this.style.hashtag}>{this.state.text} {
        (this.state.count > 0) ? " (" +this.state.count+ ")" : ""
      }</Chip>);
    }
}


export default withTheme(Hashtag);