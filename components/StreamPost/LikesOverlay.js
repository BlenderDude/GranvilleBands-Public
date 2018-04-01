import React, {Component} from 'react'
import {
    View,
    Animated,
    Dimensions,
    Platform,
    Text,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

import NavigatorService from '../../router/service'

import ProfilePhoto from "../ProfilePhoto";
import PanController from "./PanController";
import LikeAnimation from "./LikeAnimation";

export default class LikesOverlay extends Component {
    state = {
        animation: new Animated.Value(0),
        touching: false,
        selection: null,
        lastSelection: null,
        scale: new Animated.Value(0),
        nameAnimation: new Animated.Value(0),
    }

    componentWillMount() {
        this._calcSelection.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.likesOpen !== this.props.likesOpen) {
            if (nextProps.likesOpen && Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
            const toValue = nextProps.likesOpen ? 1 : 0
            Animated.timing(this.state.animation, {
                toValue,
                duration: 200,
                delay: nextProps.likesOpen ? 0 : (Math.min(50, 1000 / nextProps.likes.length) * nextProps.likes.length),
                useNativeDriver: false,
            }).start()
        }
    }

    _calcSelection(x, y) {
        const width = Dimensions.get('window').width - 30
        const widthPerLike = Math.min(25, width / this.props.likes.length)

        let selection = Math.ceil((x - (widthPerLike / 2)) / widthPerLike)
        if (selection > this.props.likes.length - 1) selection = this.props.likes.length - 1
        if (selection < 0) selection = 0

        if (Platform.OS === 'ios' && this.state.selection !== selection) {
            ReactNativeHaptic.generate('selection')
        }
        let toUserPage
        if (y < -1) {
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
        if (!this.state.touching) {
            Animated.timing(this.state.nameAnimation, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start()
        }

        this.setState({
            selection,
            lastSelection: selection,
            toUserPage,
            touching: true,
        })

        Animated.event([this.state.scale])(y)
    }

    _panStart({x, y}) {
        this.props.scrollState(false)
        this.props.openLikes()
        this._calcSelection(x, y)
    }

    _panMove({x, y}) {
        this.props.openLikes()
        this._calcSelection(x, y)
    }

    _panEnd() {
        this.props.scrollState(true)
        this.setState({
            selection: null,
            touching: false,
        })
        if (this.state.toUserPage && this.state.selection !== null) {
            const like = this.props.likes[this.state.selection]
            NavigatorService.navigate("User", {user: {...like, id: like.user_id}})
        }
        Animated.timing(this.state.nameAnimation, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start()
    }

    render() {
        const {width} = Dimensions.get('window')
        const {likes, likesOpen} = this.props
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width,
                    height: this.state.animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 60],
                    }),
                    overflow: 'visible',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                }}
            >
                <View
                    style={{
                        height: likesOpen ? width - 80 : 0,
                        width: width - 20,
                        position: 'absolute',
                        bottom: 80,
                        left: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {this.state.lastSelection !== null && likes[this.state.lastSelection] ?
                        <Animated.View
                            style={{
                                opacity: this.state.nameAnimation,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                padding: 10,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: this.state.toUserPage ? 'bold' : 'normal',
                                    color: 'rgba(255,255,255,0.8)',
                                    fontSize: 42,
                                    textAlign: 'center'
                                }}
                            >
                                {likes[this.state.lastSelection].first_name} {likes[this.state.lastSelection].last_name}
                            </Text>

                        </Animated.View>
                        : null}

                </View>
                <Animated.View
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        left: 15,
                        width: width - 30,
                        height: this.state.animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 50],
                        }),
                    }}
                >
                    <PanController
                        onPanStart={this._panStart.bind(this)}
                        onPanMove={this._panMove.bind(this)}
                        onPanEnd={this._panEnd.bind(this)}
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        {likes.map((like, i) =>
                            <LikeAnimation
                                key={like.id}
                                touching={this.state.touching}
                                index={i}
                                user={like}
                                size={50}
                                selection={this.state.selection}
                                scale={this.state.scale}
                                likeAmount={likes.length}
                                likesOpen={this.props.likesOpen}
                                openAnimation={this.state.animation}
                            />
                        )}
                    </PanController>
                </Animated.View>

            </Animated.View>
        )
    }
}