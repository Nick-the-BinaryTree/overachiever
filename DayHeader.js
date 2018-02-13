import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const numToWord = { 1: ["Monday", "Mon"], 2: ["Tuesday", "Tues"], 3: ["Wednesday", "Wed"],
              4: ["Thursday", "Thurs"], 5: ["Friday", "Fri"], 6: ["Saturday", "Sat"],
              7: ["Sunday", "Sun"]}

export default class DayHeader extends React.Component {
  constructor(props) {
    super(props)
    let text = {}

    for (let i=1; i <= 7; i++) {
      if (i === props.today) {
        text[i] = "Today is " + numToWord[i][0]
      } else if (i === props.today+1 || (props.today === 7 && i === 1)) {
        text[i] = "Tomorrow is " + numToWord[i][1] + '.'
      } else if (i === props.today-1 || (props.today === 1 && i === 7)) {
        text[i] = "Yesterday was " + numToWord[i][1] + '.'
      } else {
        text[i] = numToWord[i][0]
      }
    }
    this.state = {text: text, currentSlide: props.currentSlide}
  }
  render() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{this.state.text[this.state.currentSlide]}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: 50,
    marginBottom: 20
  },
  headerText: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.60)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 10
  },
});
