import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Animated,
} from 'react-native'
import ProfilePhoto from "../ProfilePhoto";

export default class LikesBar extends Component {
    state = {
        animation: new Animated.Value(0)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.likesOpen !== this.props.likesOpen) {
            Animated.timing(this.state.animation, {
                toValue: nextProps.likesOpen ? 1 : 0,
                duration: 500,
                delay: nextProps.likesOpen ? 0 : (Math.min(50, 1000 / nextProps.likes.length) * nextProps.likes.length),
                useNativeDriver: true,
            }).start()
        }
    }

    render() {
        const {likes} = this.props
        let likesSize = 20
        if (likes.length > 9) {
            likesSize = 18
        }
        if (likes.length > 99) {
            likesSize = 14
        }
        return (
            <Animated.View
                style={{
                    transform: [
                        {
                            translateX: this.state.animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, 100]
                            })
                        }
                    ],
                    height: 30,
                }}
            >
                <TouchableOpacity
                    onPress={this.props.openLikes}
                    disabled={likes.length < 1}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    {likes.filter((_, i) => i < 3).map(like =>
                        <ProfilePhoto
                            user={like}
                            key={like.id}
                            style={{
                                marginRight: -15,
                            }}
                        />
                    )}
                    <View
                        style={{
                            width: 30,
                            height: 30,
                            backgroundColor: '#fff',
                            borderColor: "#333",
                            borderWidth: 1,
                            borderRadius: 30 / 2,
                            justifyContent: 'center',
                            alignContent: 'center',
                            overflow: 'hidden',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: likesSize,
                                textAlign: 'center',
                                borderRadius: 30 / 2,
                            }}
                        >
                            {likes.length}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }
}