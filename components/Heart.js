import React, {Component} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

export default class Heart extends Component {

    render() {
        const sizeRatio = this.props.size || 1
        const styles = StyleSheet.create({
            heart: {
                width: 300 * sizeRatio,
                height: 300 * sizeRatio
            },
            heartShape: {
                width: 180 * sizeRatio,
                height: 270 * sizeRatio,
                position: 'absolute',
                top: 0,
                borderTopLeftRadius: 90,
                borderTopRightRadius: 90,
                backgroundColor: '#ffffff',

            },
            leftHeart: {
                transform: [
                    {rotate: '-45deg'}
                ],
                left: 28 * sizeRatio,
            },
            rightHeart: {
                transform: [
                    {rotate: '45deg'}
                ],
                right: 28 * sizeRatio,
            }
        })

        return (
            <Animated.View {...this.props} style={[styles.heart, this.props.style]} shouldRasterizeIOS={true}>
                <View style={[styles.leftHeart, styles.heartShape]}/>
                <View style={[styles.rightHeart, styles.heartShape]}/>
            </Animated.View>
        )

    }
}