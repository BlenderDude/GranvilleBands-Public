import React, {Component} from 'react'
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Animated,
} from 'react-native'

const AnimatedHeart = ({size = 30, color = '#6427d1', style, onPress}) => {
    const styles = {
        heart: {
            width: size,
            height: size,
        },
        heartShape: {
            width: size * 0.57,
            height: size * 0.9,
            position: 'absolute',
            top: 0,
            borderTopLeftRadius: size * 0.3,
            borderTopRightRadius: size * 0.3,
            backgroundColor: color,
        },
        leftHeart: {
            transform: [
                {rotate: '-45deg'}
            ],
            left: size * 0.1,
        },
        rightHeart: {
            transform: [
                {rotate: '45deg'}
            ],
            right: size * 0.1,
        }
    }
    return (
        <Animated.View style={[style, {width: size, height: size}]}>
            <TouchableWithoutFeedback onPress={onPress} style={styles.heart}>
                <View style={styles.heart}>
                    <Animated.View style={[styles.heartShape, styles.leftHeart]}/>
                    <Animated.View style={[styles.heartShape, styles.rightHeart]}/>
                </View>
            </TouchableWithoutFeedback>
        </Animated.View>
    )
}


export default AnimatedHeart