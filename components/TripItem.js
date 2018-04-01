import React, {Component} from 'react'
import {
    View,
    Text,
    Animated,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    Linking,
} from 'react-native'
import MapView from 'react-native-maps'
import Moment from 'moment'
import ReactNativeHaptic from 'react-native-haptic'

const MAP_HEIGHT = 150

export default class TripItem extends Component {
    state = {
        height: new Animated.Value(0),
        descriptionOpen: false,
        descHeight: 0,
        arrowRotation: new Animated.Value(0),
    }

    toggleDescription() {
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.generate('impact')
        }

        const {event} = this.props
        const {latitude, longitude} = event
        const mapHeight = (longitude && latitude && Platform.OS === 'ios') ? MAP_HEIGHT : 0
        if (this.state.descriptionOpen) {
            Animated.parallel([
                Animated.timing(this.state.height, {
                    toValue: 0,
                    duration: 500,
                }),
                Animated.timing(this.state.arrowRotation, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start(() => this.setState({
                descriptionOpen: false,
            }))

        } else {
            this.setState({
                descriptionOpen: true,
            })
            Animated.parallel([
                Animated.timing(this.state.height, {
                    toValue: mapHeight + this.state.descHeight + 24 + 10,
                    duration: 500,
                }),
                Animated.timing(this.state.arrowRotation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                })
            ]).start()
        }


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

    // render() {
    //     const {event} = this.props
    //     //2017-12-28 15:00:00
    //     const start_time = Moment(event.start_time, "YYYY-MM-DD HH:mm:ss")
    //     //const end_time = new Date(event.end_time)
    //     const {latitude, longitude} = event
    //     return (
    //         <View
    //             style={{
    //                 borderColor: "#333",
    //                 borderStyle: 'solid',
    //                 borderBottomWidth: 1,
    //                 //backgroundColor: '#c7eeff',
    //             }}
    //         >
    //             <TouchableOpacity
    //                 style={{
    //                     width: "100%",
    //                     minHeight: 50,
    //                     flexDirection: 'row',
    //                     alignItems: 'center',
    //                     paddingLeft: 0,
    //                     paddingVertical: 5,
    //                     borderColor: "#333",
    //                     borderStyle: 'solid',
    //                     borderBottomWidth: StyleSheet.hairlineWidth,
    //                 }}
    //                 //onPress={()=>NavigatorService.navigate("Event",{eventId:item.id})}
    //                 onPress={this.toggleDescription.bind(this)}
    //             >
    //                 <View
    //                     style={{
    //                         width: 115,
    //                     }}
    //                 >
    //                     <Text
    //                         style={{
    //                             fontSize: 18,
    //                             textAlign: 'center',
    //                             fontWeight: 'bold',
    //                         }}
    //                     >
    //                         {start_time.format("h:mm a")}
    //                     </Text>
    //                 </View>
    //                 <View style={{flex: 1, marginLeft: 0}}>
    //                     <Text style={{
    //                         fontSize: 14,
    //                         fontWeight: 'bold',
    //                     }}>{event.title}</Text>
    //                 </View>
    //                 <Animated.View
    //                     style={{
    //                         width: 30,
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         marginRight: 10,
    //                         transform: [{
    //                             rotate: this.state.arrowRotation.interpolate({
    //                                 inputRange: [0, 1],
    //                                 outputRange: ['45deg', '-225deg']
    //                             })
    //                         }],
    //                     }}
    //                 >
    //                     <View
    //                         style={{
    //                             width: 15,
    //                             height: 15,
    //                             borderColor: "#000",
    //                             borderStyle: "solid",
    //                             borderTopWidth: 2,
    //                             borderRightWidth: 2,
    //                         }}
    //                     />
    //                 </Animated.View>
    //
    //             </TouchableOpacity>
    //             <Animated.View
    //                 style={{
    //                     height: this.state.height,
    //                     overflow: 'hidden',
    //                 }}
    //             >
    //                 <View>
    //                     {latitude && longitude && this.state.descriptionOpen && Platform.OS === 'ios' ?
    //                         <View
    //                             style={{
    //                                 width: "100%",
    //                                 height: MAP_HEIGHT,
    //                             }}
    //                         >
    //                             <MapView
    //                                 scrollEnabled={true}
    //                                 showsUserLocation={true}
    //                                 showsMyLocationButton={false}
    //                                 initialRegion={{
    //                                     latitude: parseFloat(latitude),
    //                                     longitude: parseFloat(longitude),
    //                                     latitudeDelta: 0.02,
    //                                     longitudeDelta: 0.02,
    //                                 }}
    //                                 style={{
    //                                     flex: 1,
    //                                 }}
    //                             >
    //                                 <MapView.Marker
    //                                     coordinate={{
    //                                         latitude: parseFloat(latitude),
    //                                         longitude: parseFloat(longitude),
    //                                     }}
    //                                 />
    //                             </MapView>
    //                             <TouchableOpacity
    //                                 style={{
    //                                     width: 100,
    //                                     height: 40,
    //                                     position: 'absolute',
    //                                     bottom: 10,
    //                                     right: 10,
    //                                     backgroundColor: "#4ca9ff",
    //                                     alignItems: 'center',
    //                                     justifyContent: 'center',
    //                                     borderRadius: 15,
    //                                 }}
    //                                 onPress={this._openMaps.bind(this)}
    //                             >
    //                                 <Text
    //                                     style={{
    //                                         color: 'white',
    //                                         textAlign: 'center',
    //                                         fontSize: 20,
    //                                     }}
    //                                 >
    //                                     Navigate
    //                                 </Text>
    //                             </TouchableOpacity>
    //                         </View>
    //                         : null}
    //                     <View
    //                         style={{
    //                             marginBottom: 10,
    //
    //                         }}
    //                     >
    //                         <Text style={{
    //                             height: 24,
    //                             fontSize: 18,
    //                             marginLeft: 10,
    //                         }}>{event.description !== "" ? "Details:" : ""}</Text>
    //                         <Text
    //                             style={{
    //                                 marginLeft: 25,
    //                                 marginRight: 20,
    //                             }}
    //                             onLayout={(e) => this.setState({descHeight: e.nativeEvent.layout.height})}
    //                         >{event.description}</Text>
    //                     </View>
    //                 </View>
    //             </Animated.View>
    //         </View>
    //     )
    render() {
        const {event} = this.props
        //2017-12-28 15:00:00
        const start_time = Moment(event.start_time, "YYYY-MM-DD HH:mm:ss")
        //const end_time = new Date(event.end_time)
        return (
            <View
                style={{
                    borderColor: "#333",
                    borderStyle: 'solid',
                    borderBottomWidth: 1,
                    //backgroundColor: '#c7eeff',
                    flexDirection: 'row',
                }}
            >
                <View
                    style={{
                        width: 100,
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        {start_time.format("h:mm a")}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <View style={{flex: 1, padding: 5}}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                        }}>{event.title}</Text>
                    </View>
                    {event.description ?
                        <View>
                            <View
                                style={{
                                    marginBottom: 10,

                                }}
                            >
                                <Text
                                    style={{
                                        marginLeft: 25,
                                        marginRight: 20,
                                    }}
                                >{event.description}</Text>
                            </View>
                        </View>
                        : null}

                </View>
            </View>
        )
    }
}