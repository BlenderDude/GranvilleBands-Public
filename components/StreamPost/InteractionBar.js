import React, {Component} from 'react'
import {
    View,
    Animated,
    Platform,
    Text,
} from 'react-native'

import NavigatorService from '../../router/service'
import Heart from "./Heart";
import AnimatedHeart from "./AnimatedHeart";
import CommentIcon from "./CommentIcon";
import Likes from "./Likes";
import LikesBar from "./LikesBar";
import ReactNativeHaptic from 'react-native-haptic'
import Moment from "moment";

const RED_COLOR = "rgba(234,14,25,1)"
const WHITE_COLOR = "rgba(48,48,48,1)"
const ICON_SIZE = 30


export default class InteractionBar extends Component {
    state = {
        animationBeat: new Animated.Value(0),
        animationLike: new Animated.Value(this.props.liked ? 1 : 0)
    }

    shouldComponentUpdate(nextProps) {
        const liked = nextProps.liked === this.props.liked
        const likes = nextProps.post.likes.length === this.props.post.likes.length
        const likesOpen = nextProps.likesOpen === this.props.likesOpen
        return !(liked && likesOpen && likes)
    }

    componentWillReceiveProps(nextProps) {
        const DURATION = 500
        if (nextProps.liked !== this.props.liked) {
            Animated.sequence([
                Animated.timing(this.state.animationBeat, {
                    toValue: 1,
                    duration: DURATION / 2,
                }),
                Animated.timing(this.state.animationBeat, {
                    toValue: 0,
                    duration: DURATION / 2,
                })
            ]).start()
            Animated.timing(this.state.animationLike, {
                toValue: nextProps.liked ? 1 : 0,
                duration: 500,
            }).start()
            if (!nextProps.liked && Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
        }

    }

    _toggleLike() {
        const {liked, like, unlike} = this.props

        if (liked) {
            unlike()
        } else {
            like()
        }

    }

    render() {
        const {liked, post, scrollState, time} = this.props
        const fromNow = Moment(time, "YYYY-MM-DD HH:mm:ss").fromNow()
        return (
            <View
                style={{
                    paddingVertical: 5,
                    flexDirection: 'row',
                    marginHorizontal: 10,
                }}
            >
                <View
                    style={{
                        position: 'absolute',
                        top: 5,
                        left: 0,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: ICON_SIZE,
                    }}
                >
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            textAlign: 'center',
                        }}
                    >
                        {fromNow}
                    </Text>
                </View>
                <View
                    style={{
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        paddingRight: 10,
                        paddingLeft: 0,
                    }}
                >
                    <AnimatedHeart
                        size={ICON_SIZE}
                        onPress={this._toggleLike.bind(this)}
                        color={this.state.animationLike.interpolate({
                            inputRange: [0, 1],
                            outputRange: [WHITE_COLOR, RED_COLOR]
                        })}

                        style={{
                            transform: [
                                {
                                    scale: this.state.animationBeat.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.25],
                                    })
                                },
                                {
                                    rotateY: this.state.animationLike.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ["0deg", "180deg"]
                                    })
                                }
                            ],
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}/>
                </View>
                <View
                    style={{
                        paddingHorizontal: 10,
                    }}
                >
                    <CommentIcon size={ICON_SIZE}
                                 onPress={() => NavigatorService.navigate('Comments', {post, startComment: false})}/>
                </View>
                <View style={{flex: 1}}/>
                <LikesBar
                    likes={post.likes}
                    openLikes={this.props.openLikes}
                    likesOpen={this.props.likesOpen}
                />
            </View>
        )
    }
}