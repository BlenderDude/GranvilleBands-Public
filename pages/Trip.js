import React, {Component} from 'react';
import {
    AppRegistry, Image, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    CameraRoll,
    View,
    Dimensions,
    StatusBar,
    TabBarIOS,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    Platform,
    SectionList,
} from 'react-native';
import {connect} from "react-redux"
import {refresh} from "../actions/trip"
import NavigatorService from '../router/service'
import TripItem from "../components/TripItem";
import Moment from 'moment'

class Trip extends Component {
    static navigationOptions = {
        title: 'Trip',
        tabBarLabel: 'Trip',
        tintColor: 'blue',
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
    };

    componentWillMount() {
        this.props.refresh()
    }

    render() {
        let sections = []
        let currentDay = ""
        let currentIndex = -1
        this.props.events.forEach((event) => {
            const day = Moment(event.start_time, "YYYY-MM-DD HH:mm:ss").format("dddd")
            if (currentDay !== day) {
                currentIndex++
                sections.push({data: [event], title: day})
                currentDay = day
            } else {
                sections[currentIndex].data.push(event)
            }
        })
        return (
            <View
                style={{
                    flex: 1
                }}
            >
                <SectionList
                    style={{flex: 1}}
                    sections={sections}
                    initialNumToRender={200}
                    renderSectionHeader={({section}) =>
                        <View
                            style={{
                                borderColor: "#000",
                                borderStyle: "solid",
                                borderBottomWidth: 1,
                                backgroundColor: "#bed5ff"
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#333',
                                    marginVertical: 5,
                                }}
                            >{section.title}</Text>
                        </View>
                    }
                    keyExtractor={(item) => item.id}
                    refreshing={this.props.refreshing}
                    onRefresh={this.props.refresh}
                    renderItem={({item}) => <TripItem event={item}/>}
                />
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    const {refreshing, loading, errors, events} = state.trip
    return {
        refreshing,
        loading,
        errors,
        events,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        refresh: () => dispatch(refresh()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Trip)