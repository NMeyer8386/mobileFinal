/**
 * @file    Items.js
 * @author  Nathaniel Meyer
 * @author  Stephen Graham
 * @author  Evan Bacon, https://github.com/EvanBacon
 * @date    2023-04-14
 * @brief   This class file defines an <Items> component that is crafted to be used by the sqlite demo code
*/
import React, { Component } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import * as SQLite from 'expo-sqlite';

/**
 * The Items component requires these props:
 *     db - sqlite db object
 *     done - boolean filter
 *     onPress - callback function
 * @todo enforce prop types via PropTypes from 'prop-types';
 */
class Items extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: null,
        }
    }

    /**
     * Update the state with selected items (from the database)
     * 
     * @fn setItems()
     * @param {array} items
     */
    setItems = (items) => {
        this.setState({ items: items });
    }

    /**
     * Called when an instance of <Items> mounts
     * Performs an update to put initial values in the items list from the database
     * 
     * @fn componentDidMount()
     * @see update()
     * @see setItems()
     */
    componentDidMount() {
        this.update();
    }

    /**
     * This will load the appropriate items from the provided database in this.props.db
     * 
     * @fn update()
     * @see setItems()
     */
    update = () => {
        this.props.db.transaction((tx) => {
            tx.executeSql(
                'select * from bugs',
                [],
                (_, { rows: { _array } }) => this.setItems(_array)
            );
        })
    }

    /**
     * This render function will only return something if there are items in the 
     * selected list (done or !done)
     * 
     * @fn render()
     */
    render() {

        // In the event that no bugs are recorded (impossible for star citizen)
        if (this.state.items === null || this.state.items.length === 0) {
            return (
                <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>No Bugs!</Text>
            </View>
            );
        }

        return (
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>Found Bugs:</Text>
                {this.state.items.map(({ id, bug_type, replicate_steps, created_at }) => (
                    <Pressable
                        key={id}
                        onLongPress={() => this.props.onPress(id)}
                        style={styles.bugBox}
                    >
                        <Text>Found: {created_at}</Text>
                        <Text>Type: {bug_type}</Text>
                        <Text>How to replicate: {replicate_steps}</Text>
                    </Pressable>

                ))}
            </View>
        );
    }
} // end of Items component
export default Items;

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 16,
        marginHorizontal: 16,
    },
    sectionHeading: {
        fontSize: 18,
        marginBottom: 8,
    },
    bugBox: {
        borderColor: 'red',
        borderWidth: 1,
    },
});