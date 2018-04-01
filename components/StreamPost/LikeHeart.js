import React, {Component} from 'react'
import {
    View,
    Animated,
    StyleSheet,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'

export default class LikeHeart extends Component {
    state = {
        animation: new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps) {
        const {index, hearts} = nextProps
        const likesDifferent = this.props.liked !== nextProps.liked && nextProps.liked
        const forceAnimation = this.props.likeAnimation !== nextProps.likeAnimation
        const shouldAnimationRun = likesDifferent || forceAnimation
        if (shouldAnimationRun) {
            this.state.animation.setValue(0)
            const ANIMATION_DURATION = 10
            Animated.sequence([
                Animated.timing(this.state.animation, {
                    toValue: 1,
                    duration: 250,
                    delay: index * ANIMATION_DURATION,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.animation, {
                    toValue: 2,
                    duration: 500,
                    delay: (hearts - index) * ANIMATION_DURATION + 300,
                    useNativeDriver: true,
                })
            ]).start()
        }
    }

    render() {
        const sizeRatio = this.props.size || 1
        const color = '#ff8e90'
        const styles = StyleSheet.create({
            heart: {
                width: 30 * sizeRatio,
                height: 30 * sizeRatio
            },
            heartShape: {
                width: 18 * sizeRatio,
                height: 27 * sizeRatio,
                position: 'absolute',
                top: 0,
                borderTopLeftRadius: 90,
                borderTopRightRadius: 90,
                backgroundColor: color,

            },
            leftHeart: {
                transform: [
                    {rotate: '-45deg'}
                ],
                left: 2.8 * sizeRatio,
            },
            rightHeart: {
                transform: [
                    {rotate: '45deg'}
                ],
                right: 2.8 * sizeRatio,
            }
        })
        const {index, hearts, offset} = this.props
        const RADIUS = 100
        return (
            <Animated.View style={[styles.heart, {
                position: 'absolute',
                left: RADIUS * Math.cos(Math.PI * 2 * (index / hearts)) - 15 + offset,
                bottom: RADIUS * Math.sin(Math.PI * 2 * (index / hearts)) - 15 + offset,
                opacity: this.state.animation.interpolate({
                    inputRange: [0, 1, 1.25, 2],
                    outputRange: [0, 1, 1, 0],
                }),
                transform: [
                    {
                        translateY: this.state.animation.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [0, 0, -RADIUS * Math.sin(Math.PI * 2 * (index / hearts))]
                        })
                    },
                    {
                        translateX: this.state.animation.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [0, 0, RADIUS * Math.cos(Math.PI * 2 * (index / hearts))]
                        })
                    }
                ],
                zIndex: 10,
            }]} shouldRasterizeIOS={true}>
                <View style={[styles.leftHeart, styles.heartShape]}/>
                <View style={[styles.rightHeart, styles.heartShape]}/>
            </Animated.View>
        )

    }
}