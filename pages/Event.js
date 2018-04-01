import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ScrollView,
    Linking,
    TouchableOpacity,
    Platform,
    Animated,
} from 'react-native'

import MapView from 'react-native-maps'

class Event extends Component {
    static navigationOptions = {
        title: 'Event',
        tabBarLabel: 'Event',
        tintColor: 'blue',
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
    }

    state = {
        height: new Animated.Value(200),
        scrollEnabled: false,
    }

    _openMaps() {
        const {event} = this.props
        const {latitude, longitude} = event

        const latLong = `${latitude},${longitude}`

        if (Platform.OS === "ios") {
            Linking.openURL(`http://maps.apple.com/maps?q=${event.title}&ll=${latLong}`)
        } else {
            Linking.openURL(`https://maps.google.com/maps?q=${latLong}`)
        }
    }

    _mapInteraction() {
        Animated.timing(this.state.height, {
            toValue: 400,
            duration: 500,
        }).start()
        this.setState({
            scrollEnabled: true,
        })

    }

    render() {
        const {event} = this.props
        const {latitude, longitude} = event
        const start_time = new Date(event.start_time)
        const end_time = new Date(event.end_time)
        return (
            <ScrollView>
                {latitude && longitude ?
                    <Animated.View
                        style={{
                            width: Dimensions.get('window').width / (event.photos ? 2 : 1),
                            height: this.state.height,
                        }}
                    >
                        <MapView
                            toolbarEnabled={true}
                            scrollEnabled={this.state.scrollEnabled}
                            showsUserLocation={true}
                            showsMyLocationButton={false}
                            onPanDrag={this._mapInteraction.bind(this)}
                            onPress={this._mapInteraction.bind(this)}
                            initialRegion={{
                                latitude: parseFloat(latitude),
                                longitude: parseFloat(longitude),
                                latitudeDelta: 0.02,
                                longitudeDelta: 0.02,
                            }}
                            style={{
                                flex: 1,
                            }}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: parseFloat(latitude),
                                    longitude: parseFloat(longitude),
                                }}
                            />
                        </MapView>
                        <TouchableOpacity
                            style={{
                                width: "100%",
                                height: 60,
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                backgroundColor: "#4ca9ff",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                            onPress={this._openMaps.bind(this)}
                        >
                            <Text
                                style={{
                                    color: 'white',
                                    textAlign: 'center',
                                    fontSize: 32,
                                }}
                            >
                                Navigate
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                    : null}
                <View
                    style={{
                        borderStyle: 'solid',
                        borderColor: '#000',
                        borderBottomWidth: 2,
                        padding: 5,
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 24,
                        }}
                    >
                        {event.title}
                    </Text>
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 18,
                        }}
                    >
                        {start_time.toLocaleDateString([], {weekday: 'long'})}
                        at {start_time.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </Text>
                </View>
                <Text style={{textAlign: 'center'}}>Details</Text>
                <Text
                    style={{
                        margin: 10,
                    }}
                >

                    {event.description}
                </Text>
            </ScrollView>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        event: state.trip.events.filter(event => event.id === props.navigation.state.params.eventId)[0]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Event)