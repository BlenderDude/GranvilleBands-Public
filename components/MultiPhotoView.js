import React, {Component} from "react"
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
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
    PanResponder,
    Platform,
    Easing,
} from 'react-native';
import ReactNativeHaptic from 'react-native-haptic';
import ProgressiveImage from "./ProgressiveImage";

export default class MultiPhotoView extends Component {
    constructor(props) {
        super(props);
        this.windowWidth = Dimensions.get('window').width;
        this.state = {
            currentPhoto: this.props.currentPhoto,
        }
        this.lastPhoto = 0;
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                //this.props.setPanControl(true);
                this.props.scrollState(false);
                const currX = evt.nativeEvent.locationX;
                //const width = Dimensions.get('window').width / this.props.post.photos.length
                const width = 30
                let photo = Math.round(currX / width - 0.5);
                if (photo < 0) photo = 0;
                if (photo > this.props.post.photos.length - 1) photo = this.props.post.photos.length - 1;
                if (photo !== this.lastPhoto) {
                    //this.props.photoScroll.scrollTo({x:photo*this.windowWidth,animated:true})
                    this.props.setPhoto(photo)
                    this.setState({currentPhoto: photo});
                    if (Platform.OS === "ios") {
                        ReactNativeHaptic.generate('impact');
                    }

                    let animPara = [];
                    const photoID = photo;
                    this.props.post.photos.map((_, i) => {

                        if (i === photoID) {
                            animPara.push(Animated.timing(
                                this.state.animatedVals[i],
                                {
                                    toValue: -30,
                                    duration: 100,
                                    useNativeDriver: true,
                                }
                            ))
                        } else {
                            animPara.push(Animated.timing(
                                this.state.animatedVals[i],
                                {
                                    toValue: 0,
                                    duration: 100,
                                    useNativeDriver: true,
                                }
                            ))
                        }

                    });
                    Animated.parallel(animPara).start();
                }

                this.lastPhoto = photo;
                return true;
            },
            onPanResponderMove: (evt, gestureState) => {
                const currX = evt.nativeEvent.locationX
                //const width = Dimensions.get('window').width / this.props.post.photos.length
                const width = 30
                let photo = Math.round(currX / width - 0.5)
                if (photo < 0) photo = 0;
                if (photo > this.props.post.photos.length - 1) photo = this.props.post.photos.length - 1;
                if (photo !== this.lastPhoto) {
                    //this.props.photoScroll.scrollTo({x:photo*this.windowWidth,animated:true})
                    this.props.setPhoto(photo)
                    this.setState({currentPhoto: photo});
                    if (Platform.OS === "ios") {
                        ReactNativeHaptic.generate('impact');
                    }
                    let animPara = [];
                    this.props.post.photos.map((_, i) => {
                        if (i === photo) {
                            animPara.push(Animated.spring(
                                this.state.animatedVals[i],
                                {
                                    toValue: -30,
                                    friction: 3,
                                    tension: 70,
                                    //duration: 100,
                                    useNativeDriver: true,
                                }
                            ))
                        } else if (i === photo - 1 || i === photo + 1) {
                            animPara.push(Animated.timing(
                                this.state.animatedVals[i],
                                {
                                    toValue: 0,
                                    duration: 100,
                                    useNativeDriver: true,
                                }
                            ))
                        } else {
                            animPara.push(Animated.timing(
                                this.state.animatedVals[i],
                                {
                                    toValue: 0,
                                    duration: 100,
                                    useNativeDriver: true,
                                }
                            ))
                        }

                    });
                    Animated.parallel(animPara).start();
                }

                this.lastPhoto = photo;
                return true;
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.props.scrollState(true);
                let animPara = [];
                this.props.post.photos.map((_, i) => {
                    animPara.push(Animated.timing(
                        this.state.animatedVals[i],
                        {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true,
                        }
                    ))

                });
                Animated.parallel(animPara).start();
                return true;
            },
            onPanResponderTerminate: (evt, gestureState) => {
                this.props.scrollState(true);
                let animPara = [];
                this.props.post.photos.map((_, i) => {
                    animPara.push(Animated.timing(
                        this.state.animatedVals[i],
                        {
                            toValue: 0,
                            duration: 100,
                            useNativeDriver: true,
                        }
                    ))

                });
                Animated.parallel(animPara).start();
                return true;
            },
        });
    }

    componentWillMount() {
        let animatedVals = [];
        this.props.post.photos.map((photo) => {
            animatedVals.push(new Animated.Value(1))
        })
        this.setState({animatedVals});
    }

    render() {
        return (
            <View
                style={{
                    width: Dimensions.get('window').width,
                    alignItems: "center",
                    justifyContent: "center",
                    height: 30,
                    marginTop: 2,
                    marginBottom: 2,
                }}

            >
                <View
                    {...this._panResponder.panHandlers}
                >
                    <View pointerEvents="none" style={{
                        flexDirection: 'row',
                        height: 30,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        {this.props.post.photos.map((photo, i) => {
                            return (
                                <SingleImage key={photo.id} photo={photo} animatedVal={this.state.animatedVals[i]}/>)
                        })}
                    </View>
                </View>

            </View>
        )
    }
}

class SingleImage extends Component {
    state = {
        opacity: new Animated.Value(0),
        loaded: false,
    }

    _onLoad() {
        Image.prefetch("https://gbands.danielabdelsamed.com/img/thumb_" + this.props.photo.filename + ".jpg").then(() => {
            if (this.mounted) {
                this.setState({loaded: true})
                Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: 750,
                    delay: 200,
                }).start();
            }
        })

    }

    mounted = false

    componentWillMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    render() {
        //const width = Dimensions.get('window').width / this.props.post.photos.length
        const width = 30
        const {photo} = this.props
        return (
            <View
                style={{
                    height: 30,
                    width,
                    overflow: 'visible',
                }}

            >
                <Animated.View
                    style={{
                        transform: [{translateY: this.props.animatedVal}],
                        width,
                        height: 30,
                    }}
                >
                    <Image
                        style={{
                            width,
                            height: 30,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 1,

                        }}
                        blurRadius={1}
                        source={{uri: "data:image/png;base64," + photo.preload, isStatic: true}}
                        onLoad={this._onLoad.bind(this)}
                    />

                    <Animated.View
                        style={{
                            opacity: 1,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            zIndex: 5,
                            width,
                            height: 30,
                        }}
                    >
                        <Image
                            style={{
                                width,
                                height: 30,
                            }}
                            blurRadius={0}
                            source={{uri: "https://gbands.danielabdelsamed.com/img/thumb_" + photo.filename + ".jpg"}}

                        />
                    </Animated.View>
                </Animated.View>
            </View>
        )
    }
}

