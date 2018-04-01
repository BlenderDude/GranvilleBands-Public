import React, {Component} from 'react'
import {
    View,
    Image,
    TouchableWithoutFeedback,
    Animated,
} from 'react-native'

class PhotoPreview extends Component {
    state = {
        animation: new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activePhoto !== nextProps.activePhoto && nextProps.activePhoto === this.props.index) {
            Animated.sequence([
                Animated.timing(this.state.animation, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(this.state.animation, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                })
            ]).start()

        }
    }

    render() {
        const {filename, size} = this.props
        const {animation} = this.state
        return (
            <Animated.Image
                style={{
                    width: size,
                    height: size,
                    transform: [{
                        translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -20],
                        })
                    }]
                }}
                source={{uri: `https://gbands.danielabdelsamed.com/img/thumb_${filename}.jpg`}}
            />
        )
    }
}

export default PhotoPreview