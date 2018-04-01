import React, {Component} from 'react'
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    Text,
    ActivityIndicator,
} from 'react-native'

export default class Upload extends Component {
    renderTitle() {
        if (this.props.done) {
            return (
                <Text
                    style={{
                        backgroundColor: "rgba(255,255,255,0.77)",
                        padding: 5,
                        fontSize: 28,
                        color: '#000',
                        borderRadius: 5,
                    }}
                >
                    Done
                </Text>
            )
        } else if (!this.props.done && this.props.complete === 1) {
            return (
                <ActivityIndicator animating={true}/>
            )
        }
        return (
            <Text
                style={{
                    backgroundColor: "rgba(255,255,255,0.77)",
                    padding: 5,
                    fontSize: 28,
                    color: '#000',
                    borderRadius: 5,
                }}
            >
                {Math.floor(this.props.complete * 100)}%
            </Text>
        )
    }

    render() {
        return (
            <View
                style={{
                    width: (Dimensions.get('window').width - 100) * this.props.complete + 100,
                    height: 50,
                    backgroundColor: "#dfdfdf",
                    borderColor: "#ccc",
                    borderWidth: StyleSheet.hairlineWidth,
                    marginVertical: 10,
                }}
            >
                <Image
                    style={{
                        height: 50,
                        width: Dimensions.get('window').width,
                    }}
                    source={{
                        uri: this.props.uri,
                        isStatic: true,
                    }}
                    blurRadius={10}

                />
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: 100,
                        height: 50,
                    }}
                >
                    <Image
                        style={{
                            height: 50,
                            width: 100,
                        }}
                        source={{
                            uri: this.props.uri,
                            isStatic: true,
                        }}

                    />
                    <View
                        style={{
                            width: 100,
                            height: 50,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderTopRightRadius: 15,
                            borderBottomRightRadius: 15,
                        }}
                    >
                        {this.props.done ?
                            <Text
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.77)",
                                    padding: 5,
                                    fontSize: 28,
                                    color: '#000',
                                    borderRadius: 5,
                                }}
                            >
                                Done
                            </Text> : null}
                        {!this.props.done && this.props.complete === 1 ? <ActivityIndicator animating={true}/> : null}
                        {!this.props.done && this.props.complete !== 1 ? <Text
                            style={{
                                backgroundColor: "rgba(255,255,255,0.77)",
                                padding: 5,
                                fontSize: 28,
                                color: '#000',
                                borderRadius: 5,
                            }}
                        >
                            {Math.floor(this.props.complete * 100)}%
                        </Text> : null}

                    </View>

                </View>
            </View>
        )
    }
}