import React, {Component} from 'react'
import {
    View,
    PanResponder,
    Platform,
} from 'react-native'

export default class PanController extends Component {
    static defaultProps = {
        onPanStart: () => {
        },
        onPanMove: () => {
        },
        onPanEnd: () => {
        },
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // Ask to be the responder:
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                const {locationX, locationY} = evt.nativeEvent
                this.props.onPanMove({x: locationX, y: locationY})
                return true;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                // The gesture has started. Show visual feedback so the user knows
                // what is happening!

                // gestureState.d{x,y} will be set to zero now
                const {locationX, locationY} = evt.nativeEvent
                this.props.onPanStart({x: locationX, y: locationY})
            },
            onPanResponderMove: (evt, gestureState) => {
                // The most recent move distance is gestureState.move{X,Y}

                // The accumulated gesture distance since becoming responder is
                // gestureState.d{x,y}
                const {locationX, locationY} = evt.nativeEvent
                this.props.onPanMove({x: locationX, y: locationY})
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // The user has released all touches while this view is the
                // responder. This typically means a gesture has succeeded
                const {locationX, locationY} = evt.nativeEvent
                this.props.onPanEnd({x: locationX, y: locationY})
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
                const {locationX, locationY} = evt.nativeEvent
                this.props.onPanEnd({x: locationX, y: locationY})
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // Returns whether this component should block native components from becoming the JS
                // responder. Returns true by default. Is currently only supported on android.
                return true;
            },
        });
    }

    render() {
        return (
            <View
                {...this._panResponder.panHandlers}
            >
                <View
                    pointerEvents="none"
                    style={this.props.style || {}}
                >
                    {this.props.children}
                </View>
            </View>
        )
    }
}