import React from 'react'
import { ActivityIndicator, AsyncStorage, AppRegistry, AppState, FlatList,
  ImageBackground, Keyboard, StyleSheet, Text, View } from 'react-native'
import Swiper from 'react-native-swiper'
import DayHeader from './DayHeader.js'
import Schedule from './Schedule.js'

let initData = {1:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
2:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
3:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
4:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
5:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
6:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],
7:[{key: 480, time: '8:00', ampm: 'am', body: 'Hold to edit', editing: false}, {key: 481, time: '8:01', ampm: 'am', body: 'Hold again to stop', editing: false},
{key: 482, time: '8:02', ampm: 'am', body: 'Delete while editing', editing: false},{key: 483, time: '8:03', ampm: 'am', body: 'Or add while not', editing: false},],}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    let time = new Date()
    let today = time.getDay()
    let hr = time.getHours()
    let night = (0 <= hr && hr <= 5) || (17 <= hr && hr <= 23)

    this.state = {today : today, curI: today, lastI: today, night: night,
                  keyboardShowing: false, appState: AppState.currentState}

    this.getSchedule = this.getSchedule.bind(this)
    this.setSchedule = this.setSchedule.bind(this)
    this.swiped = this.swiped.bind(this)
    this.stopEditing = this.stopEditing.bind(this)
    this.updateFromChild = this.updateFromChild.bind(this)
    this._keyboardDidShow = this._keyboardDidShow.bind(this)
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
  }
  componentWillMount() {
    this.getSchedule()
    AppState.addEventListener('change', this._handleAppStateChange)
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide)
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }
  _keyboardDidShow() {
    this.setState({keyboardShowing: true})
  }
  _keyboardDidHide() {
    this.setState({keyboardShowing: false})
  }
  _handleAppStateChange(nextAppState) {
    if (this.state.appState === 'active' && nextAppState === 'inactive' ||
      nextAppState === 'background')
      this.setSchedule()
  }
  async getSchedule() {
    let res = {}
    try {
      let weekData = await AsyncStorage.getItem('weekData')
      if (weekData !== 'false' && !!weekData) {
        res = JSON.parse(weekData)
      } else {
        res = initData
      }
    } catch(e) {
      res = initData
    } finally {
      this.setState({weekData: res})
    }
  }
  async setSchedule() {
    await AsyncStorage.setItem('weekData', JSON.stringify(this.state.weekData))
  }
  stopEditing(i) {
    let res = this.state.weekData
    let day = res[i]

    day.anyEditing = false
    for (let i=0; i < day.length; i++)
      day[i].editing = false
    res[i] = day
    return res
  }
  swiped(i) {
    let updatedData = this.stopEditing(this.state.curI);
    this.setState({curI: i, lastI: this.state.curI, weekData: updatedData})
  }
  updateFromChild(newDay, i) {
    let newWeek = this.state.weekData
    newWeek[i] = newDay
    this.setState({weekData: newWeek})
  }
  render() {
    if (this.state.weekData) {
      return (
        <ImageBackground source={this.state.night ? require('./dark.jpg') : require('./light.jpg')} style={styles.wrapper}>
          <Swiper index={this.state.today-1} loop={false} showsPagination={false} onIndexChanged={index => this.swiped(index+1)}>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={1} />
              <Schedule dayIndex={1} dayData={this.state.weekData[1]} updateParent={x => this.updateFromChild(x, 1)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={2} />
              <Schedule dayIndex={2} dayData={this.state.weekData[2]} updateParent={x => this.updateFromChild(x, 2)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={3} />
              <Schedule dayIndex={3} dayData={this.state.weekData[3]} updateParent={x => this.updateFromChild(x, 3)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={4} />
              <Schedule dayIndex={4} dayData={this.state.weekData[4]} updateParent={x => this.updateFromChild(x, 4)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={5} />
              <Schedule dayIndex={5} dayData={this.state.weekData[5]} updateParent={x => this.updateFromChild(x, 5)}
                keyboardShowing={this.state.keyboardShowing}/>
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={6} />
              <Schedule dayIndex={6} dayData={this.state.weekData[6]} updateParent={x => this.updateFromChild(x, 6)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
            <View style={styles.container}>
              <DayHeader today={this.state.today} currentSlide={7} />
              <Schedule dayIndex={7} dayData={this.state.weekData[7]} updateParent={x => this.updateFromChild(x, 7)}
                keyboardShowing={this.state.keyboardShowing} />
            </View>
          </Swiper>
        </ImageBackground>
      );
    }
    return (
        <View style={styles.loading}><ActivityIndicator size="large" color="#00E676" /></View>
      );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#455A64'
  }
});

AppRegistry.registerComponent('Overachiever', () => Swiper);
