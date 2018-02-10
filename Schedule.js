import React from 'react';
import { Button, FlatList, Picker, StyleSheet,
  TextInput, TouchableNativeFeedback, View } from 'react-native';
import ScheduleItem from './ScheduleItem'

export default class Schedule extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anyEditing: props.anyEditing,
      dayIndex: props.dayIndex,
      dayData: props.dayData,
      keyboardShowing: props.keyboardShowing
    }
    this.handleChange = this.handleChange.bind(this)
    this.timeToKey = this.timeToKey.bind(this)
    this.addScheduleItem = this.addScheduleItem.bind(this)
    this.removeScheduleItem = this.removeScheduleItem.bind(this)
    this.holdItem = this.holdItem.bind(this)
    this.update = this.update.bind(this)

    this.updateParent = props.updateParent
  }
  /* don't allow deletes upon swiping to;
     parent data store disables editing on each
     individual list item */
  componentWillReceiveProps(nextProps) {
    this.checkForAnyEditing(nextProps.dayData)
    this.setState({keyboardShowing: nextProps.keyboardShowing})
  }
  handleChange(key, inputNum, change) {
    // Note, editing item will edit newSchedule
    let newSchedule = this.state.dayData
    let oldKeyIndex = keySearch(newSchedule, key)
    let n = newSchedule.length

    if (inputNum == 1 || inputNum == 2) {
        // remove old key
        let item = newSchedule[oldKeyIndex]

        newSchedule.splice(oldKeyIndex, 1)
        if (inputNum == 1) {
          item.time = change.nativeEvent.text
        } else {
          item.ampm = change
        }
        item.key = this.timeToKey(item.time, item.ampm)

        // insert new item into array in sorted order
        let pushed = false
        for (let i=0; i < newSchedule.length; i++) {
          if (item.key === newSchedule[i].key) { // override conflicting key
            item.key += 0.1
          } else if (item.key < newSchedule[i].key) {
            newSchedule.splice(i, 0, item)
            pushed = true
            break
          }
        }
        if (!pushed) {
          newSchedule.push(item)
        }
    } else {
      newSchedule[oldKeyIndex].body = change.nativeEvent.text
      }

    this.update(newSchedule)
  }
  timeToKey(time, ampm) {
    total = 0
    if (time.length == 4) {
      total += parseInt(time.charAt(0)) * 60
      total += parseInt(time.substring(2, 4))
    } else if (time.length == 5) {
      if (!time.substring(0, 2) == '12') {
        total += parseInt(time.substring(0, 2)) * 60
      }
      total += parseInt(time.substring(4, 6))
    }
    if (ampm == 'pm')
      total += 12*60
    return total
  }
  addScheduleItem() {
    let newSchedule = this.state.dayData

    newSchedule.unshift({key: newSchedule.length > 0 ? newSchedule[0].key-1 : -1,
      time: '12:00', ampm: 'am', body: 'Hold to edit!', editing: false})
    this.update(newSchedule)
  }
  removeScheduleItem() {
    let newSchedule = this.state.dayData.filter(x => !x.editing)
    this.update(newSchedule)
  }
  holdItem(key) {
    let newSchedule = this.state.dayData
    let i = keySearch(newSchedule, key)

    newSchedule[i].editing = !newSchedule[i].editing
    this.update(newSchedule)
    this.checkForAnyEditing(newSchedule)
  }
  checkForAnyEditing(newSchedule) {
    let newAnyEditing = newSchedule.reduce((a, x) => a+x.editing, 0)
    this.setState({anyEditing: newAnyEditing})
  }
  update(newSchedule) {
    this.setState({dayData: newSchedule})
    this.updateParent(newSchedule)
  }
  render() {
    return (
      <FlatList
        data={this.state.dayData}
        renderItem={({item, index}) =>
        <ScheduleItem handleChange={this.handleChange} addScheduleItem={this.addScheduleItem}
          removeScheduleItem={this.removeScheduleItem} holdItem={this.holdItem} item={item}
          keyboardShowing={this.state.keyboardShowing}/>}
        ListFooterComponent={this.state.anyEditing ?
          <View style={styles.addButton}><Button title='-' onPress={() => this.removeScheduleItem()} color='#F44336' /></View> :
          <View style={styles.addButton}><Button title='+' onPress={() => this.addScheduleItem()} color='#2196F3' /></View>
        }
      />
    )
  }
}

const keySearch = (A, key) => {
  let lo = 0, hi = A.length-1

  while (lo <= hi) {
    let m= parseInt(lo + (hi-lo)/2)

    if (A[m].key === key)
      return m
    else if (A[m].key > key)
      hi = m - 1
    else
      lo = m + 1
  }
  return -1
}

const styles = StyleSheet.create({
  addButton: {
    padding: 10,
    margin: 8
  }
});
