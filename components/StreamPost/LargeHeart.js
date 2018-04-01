import React, {Component} from 'react'
import {
    View,
    Dimensions,
    Platform,
} from 'react-native'
import Heart from "../Heart";
import ReactNativeHaptic from 'react-native-haptic'
import LikeHeart from "./LikeHeart";

export default class LargeHeart extends Component {

    componentWillReceiveProps(nextProps) {
        const likesDifferent = this.props.liked !== nextProps.liked && nextProps.liked
        const forceAnimation = this.props.likeAnimation !== nextProps.likeAnimation
        const shouldAnimationRun = likesDifferent || forceAnimation
        if (shouldAnimationRun && Platform.OS === 'ios') {
            ReactNativeHaptic.generate('impact')
        }
    }

    render() {
        const {width} = Dimensions.get('window')
        const hearts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,]
        return (
            <View
                style={{
                    position: 'absolute',
                    top: width / 2,
                    left: width / 2,
                    width: 0,
                    height: 0,
                    zIndex: 10,
                }}
            >
                {hearts.map((_, i) =>
                    <LikeHeart
                        key={i}
                        index={i}
                        hearts={hearts.length}
                        liked={this.props.liked}
                        likeAnimation={this.props.likeAnimation}
                        offset={0}
                        color="rgba(234,14,25,1)"
                    />
                )}
            </View>
        )
    }
}