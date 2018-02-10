import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const numToWord = { 1: "Monday", 2: "Tuesday", 3: "Wednesday",
              4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday"}

export default class DayHeader extends React.Component {
  constructor(props) {
    super(props)
    let introText = {}
    let finalText = {}

    for (let i=0; i <= 7; i++) {
      let txt = ''

      if (i === props.today) {
        txt = "Today is "
      } else if (i === props.today+1 || (props.today === 7 && i === 1)) {
        txt = "Tomorrow is "
      } else if (i === props.today-1 || (props.today === 1 && i === 7)) {
        txt = "Yesterday was "
      }
      introText[i] = txt
    }

    for (let i=0; i <= 7; i++) {
      if (i === 3 && (introText[i] === "Yesterday was ")) {
        finalText[i] = "Yesterday was Wed."
      } else if (i === 4 && (introText[i] === "Yesterday was ")) {
        finalText[i] = "Yesterday was Thurs."
      } else if (i === 6 && (introText[i] === "Yesterday was ")) {
        finalText[i] = "Yesterday was Sat."
      }
      else {
        finalText[i] = introText[i] + numToWord[i]
      }
    }

    this.state = {finalText: finalText, currentSlide: props.currentSlide}
  }
  render() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{this.state.finalText[this.state.currentSlide]}</Text>
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
