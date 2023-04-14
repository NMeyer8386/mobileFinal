/**
 * @file    App.js
 * @author  Nathaniel Meyer
 * @date    2023-04-14
 * @brief   This app tracks bugs found in the game 'Star Citizen'
 */
import React, { Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import * as SQLite from 'expo-sqlite';

/**
 * This detects the platform that the app is running on. Since web isn't compatible with SQLite,
 * this application will be minimally functional on the web
 * On mobile, it creates a database under the local filesystem.
 */
function openDatabase() {
  if (Platform.OS === 'web') {
    return {
      transaction: () => {
        return {
          executeSql: () => { }
        }
      }
    }
  }
  const db = SQLite.openDatabase('scTracker.db');
  return db;
}

export default class App extends Component {
  constructor(props) {
    super(props);
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      this.state = {
        text: null,
        date: (year.toString() + '/' + 
              (month + 1).toString() + '/' + 
              (day).toString()),
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        
        {/* The app's header */}
        <View style={styles.header}>
          <Image
          style={styles.headImage}
          source={{uri: 'https://logos-world.net/wp-content/uploads/2021/04/Star-Citizen-Logo.png',}}
          contentFit='fill'
          />
          <Text style={styles.headerText}>Star Citizen Bug Tracker</Text>
        </View>

        {/* This is where bugs will be displayed */}
        <View style={styles.content}>
          <Text>{this.state.date}</Text>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: '12%',
    paddingTop: 35,
    paddingBottom: 10,
    borderColor: 'black',
    borderBottomWidth: 3,
  },
  headImage: {
    width: '25%',
    height: '100%',
    marginTop: 5,
  },
  headerText: {
    paddingTop: 20,
    paddingRight: 20,
    fontSize: 22,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
});
