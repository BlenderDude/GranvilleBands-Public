import React, {Component} from 'react'
import {
    View,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native'

const Heart = ({size = 30, color = '#6427d1', onPress}) => {
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
        <TouchableOpacity onPress={onPress} style={{position: 'absolute', top: 0, left: 0,}}>
            <View style={styles.heart}>
                <View style={[styles.heartShape, styles.leftHeart]}/>
                <View style={[styles.heartShape, styles.rightHeart]}/>
            </View>
        </TouchableOpacity>
    )
}


export default Heart