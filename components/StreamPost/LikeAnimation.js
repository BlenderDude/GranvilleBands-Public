import React, {Component} from 'react'
import {
    View,
    Animated,
    Dimensions,
    Text,
} from 'react-native'
import ProfilePhoto from "../ProfilePhoto";

export default class LikeAnimation extends Component {
    state = {
        animation: new Animated.Value(0),
        introAnimation: new Animated.Value(this.props.likesOpen ? 1 : 0),
    }

    animatingTo = 0

    componentWillReceiveProps(nextProps) {
        const width = Dimensions.get('window').width - 30
        const widthPerLike = Math.min(25, width / this.props.likeAmount)
        const affectArea = Math.floor(50 / widthPerLike)
        if (nextProps.touching) {
            if (nextProps.selection !== this.props.selection) {
                if (this.props.index - affectArea <= nextProps.selection && nextProps.selection <= this.props.index + affectArea) {
                    const dist = Math.abs(this.props.index - nextProps.selection)
                    let toValue
                    if (dist === 0) {
                        toValue = 1
                    } else {
                        toValue = Math.cos(Math.PI / 2 * (dist / affectArea)) / 4
                    }

                    if(toValue !== this.animatingTo){
                        this.animatingTo = toValue
                        Animated.spring(this.state.animation, {
                            toValue,
                            speed: 20,
                            useNativeDriver: true,
                        }).start()
                    }
                } else {
                    if (0 !== this.animatingTo) {
                        this.animatingTo = 0
                        Animated.spring(this.state.animation, {
                            toValue: 0,
                            speed: 20,
                            useNativeDriver: true,
                        }).start(() => this.animatingDown = false)
                    }
                }
            }
        } else {
            if (0 !== this.animatingTo) {
                this.animatingTo = 0
                Animated.spring(this.state.animation, {
                    toValue: 0,
                    speed: 20,
                    useNativeDriver: true,
                }).start()
            }
        }
        if (nextProps.likesOpen !== this.props.likesOpen) {
            Animated.sequence([
                Animated.timing(this.state.introAnimation, {
                    toValue: nextProps.likesOpen ? 0 : 1,
                    duration: 0,
                    useNativeDriver: true,
                }), Animated.timing(this.state.introAnimation, {
                    toValue: nextProps.likesOpen ? 1 : 0,
                    duration: 200,
                    delay: nextProps.index * Math.min(50, 1000 / nextProps.likeAmount),
                    useNativeDriver: true,
                })
            ]).start()
        }

    }

    render() {
        let scale = {
            scale: 1,
        }
        if (this.props.selection === this.props.index) {
            scale = {
                scale: this.props.scale.interpolate({
                    inputRange: [-1, -0.99, 30],
                    outputRange: [1.7, 1.5, 1],
                    extrapolate: 'clamp'
                })
            }
        }
        const {width} = Dimensions.get('window')
        return (
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY: this.state.animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, -100]
                            })
                        },
                        {
                            translateX: this.state.introAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [width, 0],
                            })
                        }
                    ],
                    width: Math.min(25, (Dimensions.get('window').width - 30) / (this.props.likeAmount)),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Animated.View
                    style={{
                        transform: [
                            scale,
                        ],
                        opacity: this.props.openAnimation,
                    }}
                >
                    <ProfilePhoto
                        {...this.props}
                    />
                </Animated.View>
            </Animated.View>
        )
    }
}