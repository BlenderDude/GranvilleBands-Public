import React, {Component} from 'react'
import {
    View,
    Text,
    Dimensions,
    LayoutAnimation,
    TouchableOpacity,
    Animated,
    PanResponder,
    Platform, TouchableWithoutFeedback,
} from 'react-native'
import NavigatorService from '../../router/service'
import ReactNativeHaptic from 'react-native-haptic'
import ProfilePhoto from "../ProfilePhoto";
import LikeAnimation from "./LikeAnimation";

export default class Likes extends Component {

    state = {
        open: false,
        selection: null,
        touching: false,
        verticalPull: new Animated.Value(0),
        opening: false,
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: Animated.event(
                [{
                    nativeEvent: {
                        locationY: this.state.verticalPull,
                    }
                }],
                {listener: this._calcSelect.bind(this), useNativeDriver: false},
            ),
            onPanResponderMove: Animated.event(
                [{
                    nativeEvent: {
                        locationY: this.state.verticalPull,
                    }
                }],
                {listener: this._calcSelect.bind(this), useNativeDriver: false},
            ),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this._panEnd.bind(this)
                this._panEnd()
            },
            onPanResponderTerminate: (evt, gestureState) => {
                this._panEnd.bind(this)
                this._panEnd()
            },
            onShouldBlockNativeResponder: (evt, gestureState) => true,
        });
    }

    _calcSelect(evt) {
        if (this.state.opening) return;
        const CustomLayoutLinear = {
            duration: 200,
            create: {
                type: 'linear',
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: 'easeInEaseOut',
            },
            delete: {
                type: 'linear',
                property: LayoutAnimation.Properties.opacity,
            },
        }
        const x = evt.nativeEvent.locationX
        const y = evt.nativeEvent.locationY

        clearTimeout(this.openTimeout)
        const width = Dimensions.get('window').width - 10
        const widthPerLike = Math.min(25, width / this.props.likes.length)
        if (!this.state.open && !this.state.opening) {
            LayoutAnimation.configureNext(CustomLayoutLinear, () => this.setState({open: true, opening: false,}))
            this.setState({
                opening: true,
                open: true,
            })
            return;
        }
        this.props.scrollState(false)
        let selection = Math.ceil((x - (widthPerLike / 2)) / widthPerLike) - 1
        if (selection > this.props.likes.length - 1) selection = this.props.likes.length - 1
        if (selection < 0) selection = 0

        if (Platform.OS === 'ios' && this.state.selection !== selection) {
            ReactNativeHaptic.generate('selection')
        }
        let toUserPage
        if (y < -10) {
            if (!this.state.toUserPage && Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
            toUserPage = true
        } else {
            if (this.state.toUserPage && Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
            toUserPage = false
        }

        this.setState({
            open: true,
            touching: true,
            selection,
            toUserPage
        })


    }

    _panEnd() {
        const CustomLayoutLinear = {
            duration: 200,
            create: {
                type: 'linear',
                property: LayoutAnimation.Properties.opacity,
            },
            update: {
                type: 'easeInEaseOut',
            },
            delete: {
                type: 'linear',
                property: LayoutAnimation.Properties.opacity,
            },
        }
        if (this.state.toUserPage && this.state.selection !== null) {
            const like = this.props.likes[this.state.selection]
            NavigatorService.navigate("User", {user: {...like, id: like.user_id}})
        }

        clearTimeout(this.openTimeout)
        this.setState({touching: false, selection: null, toUserPage: false})
        this.props.scrollState(true)
        this.openTimeout = setTimeout(() => {
            LayoutAnimation.configureNext(CustomLayoutLinear, () => {
            })
            this.setState({open: false,})
        }, 3000)

    }

    render() {
        const {likes} = this.props
        const {open, selection, opening} = this.state
        let likesSize = 20
        if (likes.length > 9) {
            likesSize = 18
        }
        if (likes.length > 99) {
            likesSize = 14
        }
        return (
            <View
                style={{
                    position: 'absolute',
                    paddingHorizontal: open ? 5 : null,
                    top: open ? -50 : 5,
                    right: open ? -10 : 0,
                    width: open ? Dimensions.get('window').width : null,
                    height: open ? 40 : 30,
                    zIndex: 10,
                }}
            >
                {selection !== null && open && !opening && this.state.touching ?
                    <View
                        style={{
                            position: 'absolute',
                            top: -Dimensions.get('window').width / 2 - 50,
                            width: Dimensions.get('window').width,
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',


                        }}
                    >
                        <View
                            style={{
                                borderRadius: 15,
                                overflow: 'hidden',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                    color: 'white',
                                    fontSize: 42,
                                    maxWidth: Dimensions.get('window').width - 50,
                                    padding: 15,
                                    fontWeight: this.state.toUserPage ? 'bold' : 'normal',

                                }}
                            >
                                {likes[selection].first_name} {likes[selection].last_name}
                            </Text>
                        </View>
                    </View>
                    : null}
                <Animated.View
                    {...this._panResponder.panHandlers}
                >
                    <View
                        pointerEvents="none"
                        style={{flexDirection: 'row'}}
                    >
                        {likes.filter((_, i) => open ? true : i < 3).map((like, i) =>
                            <LikeAnimation
                                open={open}
                                touching={this.state.touching}
                                likeAmount={likes.length}
                                key={like.id}
                                style={{
                                    //marginRight: open ? Math.min(-25, (Dimensions.get('window').width - 10) / (likes.length) - 50) : -15,
                                }}
                                size={open ? 50 : 30}
                                user={like}
                                selection={this.state.selection}
                                index={i}
                                scale={this.state.verticalPull}
                            />
                        )}

                        {open ? null :
                            <View
                                style={{
                                    width: 30,
                                    height: 30,
                                    backgroundColor: '#fff',
                                    borderColor: "#333",
                                    marginLeft: -10,
                                    borderWidth: 1,
                                    borderRadius: 30 / 2,
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    overflow: 'hidden',
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: likesSize,
                                        textAlign: 'center',
                                        borderRadius: 30 / 2,
                                    }}
                                >
                                    {likes.length}
                                </Text>
                            </View>
                        }
                    </View>
                </Animated.View>
            </View>
        )
    }
}