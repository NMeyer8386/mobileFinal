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
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import Items from './components/Items';
import * as SplashScreen from 'expo-splash-screen';

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

const db = openDatabase(); // Creates the database

export default class App extends Component {
  constructor(props) {
    super(props);
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth();
      let day = date.getDate();
      this.state = {
        bugText: null,
        replicationText: null,
        date: (year.toString() + '/' + 
              (month + 1).toString() + '/' + 
              (day).toString()),
      }
  }

  // Creates the database on component mount if it doesn't exist already
  componentDidMount() {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists bugs (id integer primary key not null, bug_type text, replicate_steps text, created_at text);",
          [],
          null,
          (err) => console.log(err)
        )
      },
      (err) => console.log(err)
    );
  }

  // Sets user text from respective inputs to state variables for db input
  setBugText = (text) => {
    this.setState({ bugText: text });
  }

  setReplicationText = (text) => {
    this.setState({ replicationText: text });
  }

  // Inserts user-inputted text and the date into the db
  dbAdd = (bug, rep, date) => {
    if (bug === null || bug === '' || rep === null || rep === '') {
      return false;
    }

    db.transaction(
      (tx) => {
        tx.executeSql(
          "insert into bugs (bug_type, replicate_steps, created_at) values (?, ?, ?)",
          [bug, rep, date]
        );
        tx.executeSql(
          "select * from bugs",
          [],
          (_, { rows }) => console.log(JSON.stringify(rows))
        );
      },
      (err) => console.log(err),
      this.bugs.update()
    )
    this.setState({
      bugText: null,
      replicationText: null,
    });
  }

  render() {

    SplashScreen.preventAutoHideAsync();
    setTimeout(SplashScreen.hideAsync, 2000);

    return (
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
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

        {/* This is where a user will insert a bug report */}
        <View style={styles.bugInput}>
          <TextInput
            ref={bugInput => { this.textInput1 = bugInput }}
            onChangeText={text => this.setBugText(text)}
            placeholder="Where was the bug? (Ship, FPS, Terminal, etc.)"
            style={[styles.input, this.state.bugText? {borderColor: 'green'}:{borderColor: 'red'}]}
            value={this.state.bugText}
          />

          <TextInput
            ref={repInput => { this.textInput2 = repInput }}
            multiline={true}
            onChangeText={text => this.setReplicationText(text)}
            placeholder="Steps to replicate:"
            style={[styles.input, this.state.replicationText? {borderColor: 'green'}:{borderColor: 'red'}, {flex: 3,}]}
            value={this.state.replicationText}
          />
        </View>

          <TouchableOpacity
            disabled={this.state.bugText && this.state.replicationText? false : true }
            style={[styles.submitButton, this.state.bugText && this.state.replicationText? {backgroundColor: 'limegreen'} : {backgroundColor: 'lightgray'} ]}
            onPress={() => {
              this.dbAdd(this.state.bugText, this.state.replicationText, this.state.date);
              this.textInput1.clear();
              this.textInput2.clear();
              this.bugs.update();
            }}

          >
            <Text>{this.state.bugText && this.state.replicationText? 'Save' : 'Enter bug info' }</Text>
          </TouchableOpacity>

        

        {/* This is where bugs will be displayed */}
        <ScrollView style={styles.listArea}>
          <Items
            ref={bugs => (this.bugs = bugs)}
            db={db}
            onPress={(id) => {
              db.transaction(
                (tx) => {
                  tx.executeSql(
                    "delete from bugs where id = ?",
                    [id]
                  );
                },
                (err) => console.log(err), 
              )
              this.bugs.update();
              console.log('deleted');
            }
            }
          />
        </ScrollView>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8e8e8',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderColor: 'black',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  bugInput: {
    height: '20%',
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    height: 48,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    margin: 5,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    padding:10,
    alignItems: 'center',
    width: '90%',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  listArea: {
    paddingTop: 40,
    width: '100%',
  },
});
