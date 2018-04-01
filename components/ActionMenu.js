import React, {Component} from 'react'
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet, Animated, View} from 'react-native'

export default class ActionMenu extends Component {
    render() {
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: this.props.actionMenuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, this.props.children.filter((child) => child !== null).length * 50],
                    }),
                    backgroundColor: '#ffffffdd',
                    zIndex: 100,
                    overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderBottomLeftRadius: 15,
                }}
            >
                {this.props.children}
            </Animated.View>
        )
    }
}