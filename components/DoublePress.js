import React, {Component} from 'react';
import {
    View,
    PanResponder,
    TouchableWithoutFeedback,
} from 'react-native';

class DoublePress extends Component {
    constructor() {
        super();

        this.prevTouchInfo = {
            prevTouchTimeStamp: 0,
        };
    }

    isDoubleTap(currentTouchTimeStamp) {
        const {prevTouchTimeStamp} = this.prevTouchInfo;
        const dt = currentTouchTimeStamp - prevTouchTimeStamp;
        const {delay} = this.props;

        return ( dt < delay);
    }

    onPress() {
        const currentTouchTimeStamp = Date.now();

        if (this.isDoubleTap(currentTouchTimeStamp)) {
            this.prevTouchInfo = {prevTouchTimeStamp:0}
            this.props.onDoublePress();
        }

        this.prevTouchInfo = {
            prevTouchTimeStamp: currentTouchTimeStamp,
        };
    }

    render() {
        return (
            <TouchableWithoutFeedback
                onPress={this.onPress.bind(this)}
            >
                <View style={{flex:1}}>
                    {this.props.children}
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

DoublePress.defaultProps = {
    delay: 300,
    radius: 30,
    onDoublePress: () => console.log("Double tap"),
};

export default DoublePress