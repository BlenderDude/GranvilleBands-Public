import React, {Component} from 'react'
import {
    Image,
    View,
    StyleSheet,
    Text,
    Animated,
} from 'react-native'

export default class ProfilePhoto extends Component {
    render() {
        const size = this.props.size || 30
        const {user} = this.props
        if (user.profile_pic) {
            return (
                <View
                    style={{
                        ...this.props.style,
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderColor: "#333",
                        borderWidth: StyleSheet.hairlineWidth,
                    }}
                >
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: size / 2,
                        }}
                        source={{
                            uri: "https://gbands.danielabdelsamed.com/img/" + user.profile_pic + ".jpg"
                        }}
                    />
                </View>
            )
        }
        const hashName = (user.first_name || "") + (user.last_name || "")
        let hash = 0;
        for (let i = 0; i < hashName.length; i++) {
            hash = hashName.charCodeAt(i) + ((hash << 5) - hash);
        }

        const h = hash % 360;
        const color = `hsl(${h},50%,60%)`;
        return (
            <View
                style={{
                    ...this.props.style,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    borderColor: "#333",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignContent: 'center',
                    overflow: 'hidden',
                    padding: size / 4,
                }}
            >
                <Text
                    style={{
                        fontSize: size * 0.6,
                        textAlign: 'center',
                        borderRadius: size / 2,
                        color: '#fff',
                    }}
                >
                    {(user.first_name || "").charAt(0).toUpperCase()}
                </Text>
            </View>
        )
    }
}