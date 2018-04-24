import React from 'react';
import { Animated, Picker, StyleSheet, TextInput, TouchableNativeFeedback, View } from 'react-native';

export default class ScheduleItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      item: props.item,
      keyboardShowing: props.keyboardShowing,
      anim: new Animated.Value(0.4)
    }
    this.handleChange = props.handleChange
    this.addScheduleItem = props.addScheduleItem
    this.removeScheduleItem = props.removeScheduleItem
    this.holdItem = props.holdItem

    this.animLoop = this.animLoop.bind(this)
  }
  componentWillReceiveProps(nextProps) {
    this.animLoop()
    this.setState({keyboardShowing: nextProps.keyboardShowing})
  }
  animLoop() {
    if (this.state.item.editing) {
      Animated.timing(this.state.anim, {
        toValue: 0.6,
        duration: 1000
      }).start()
    } else {
      Animated.timing(this.state.anim, {
        toValue: 0.4,
        duration: 1000
      }).start()
    }
  }
  render() {
    let color = this.state.anim.interpolate({
      inputRange: [0.4, 0.6],
      outputRange: ['rgba(215, 215, 215, 0.4)', 'rgba(215, 215, 215, 0.6)']
    })
    return (
        <TouchableNativeFeedback onLongPress={item => this.holdItem(this.state.item.key)}>
          <Animated.View style={[styles.itemView, {backgroundColor: color}]}>
            <TextInput style={styles.timeInput} onEndEditing={text => this.handleChange(this.state.item.key, 1, text)}
               defaultValue={this.state.item.time} editable={this.state.item.editing} />
            <Picker style={styles.amPicker} selectedValue={this.state.item.ampm}
              onValueChange={value => this.handleChange(this.state.item.key, 2, value)}
              enabled={this.state.item.editing && !this.state.keyboardShowing} mode='dropdown'>
              <Picker.Item label="am" value="am" />
              <Picker.Item label="pm" value="pm" />
            </Picker>
            <TextInput style={styles.bodyInput} multiline={true} onEndEditing={text => this.handleChange(this.state.item.key, 3, text)}
               defaultValue={this.state.item.body} editable={this.state.item.editing} />
          </Animated.View>
        </TouchableNativeFeedback>
    )
  }
}

const styles = StyleSheet.create({
  itemView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 8,
    height: 80,
    width: 335,
    padding: 10
  },
  timeInput: {
    height: 80,
    width: 70,
    padding: 10,
    fontSize: 18,
  },
  amPicker: {
    height: 40,
    width: 75,
    padding: 10,
  },
  bodyInput: {
    height: 80,
    width: 175,
    padding: 10,
    fontSize: 18,
  }
});
