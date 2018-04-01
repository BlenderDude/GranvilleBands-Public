import React, {Component} from 'react'
import {
    View,
    Modal,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput, ActivityIndicator, KeyboardAvoidingView,
    Platform,
} from 'react-native'
import API from '../API'

export default class Report extends Component {
    state = {
        reason: "",
        loading: false,
    }

    _report() {
        this.setState({loading: true})
        API.post(this.props.post.id).report(this.state.reason)
            .then(() => {
                this.setState({loading: false, reason: "",})
                this.props.close()
            })
            .catch(() => {
                this.setState({loading: false, reason: "",})
                this.props.close()
            })
    }

    render() {
        const {visible, close, post} = this.props
        return (
            <Modal
                visible={visible}
                onRequestClose={close}
                animationType="fade"
                transparent
            >

                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                >
                    <PlatformSpecificKeyboardAvoidingView
                        behavior="padding"
                        keyboardVerticalOffset={0}
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        contentContainerStyle={{
                            flex: 1,
                        }}
                    >

                        <View
                            style={{
                                width: 300,
                                height: 200,
                                backgroundColor: '#ffffff',
                                borderRadius: 15,
                            }}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersisstTaps="handled"
                        >
                            {this.state.loading ?
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <ActivityIndicator animating size="large"/>
                                </View>
                                :
                                <View
                                    style={{flex: 1}}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderBottomWidth: StyleSheet.hairlineWidth,
                                            borderStyle: 'solid',
                                            borderColor: '#ccc',
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                maxWidth: 250,
                                                fontSize: 18,
                                                marginVertical: 10,
                                            }}
                                        >
                                            {`Report ${post.first_name} ${post.last_name}'s Post`}
                                        </Text>
                                    </View>
                                    < View style={{
                                        flex: 1,
                                        alignItems: 'center',
                                    }}>
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                marginBottom: 5,
                                                fontSize: 12,
                                            }}
                                        >
                                            The post will be reviewed by an admin and acted upon within 24 hours
                                        </Text>
                                        <TextInput
                                            placeholder="This post should be deleted because..."
                                            style={{
                                                fontSize: 14,
                                                width: "95%",
                                                flex: 1,
                                            }}
                                            multiline
                                            onChangeText={text => this.setState({reason: text})}
                                            value={this.state.reason}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            height: 50,
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#ccc',
                                                borderTopWidth: StyleSheet.hairlineWidth,
                                                borderRightWidth: StyleSheet.hairlineWidth,
                                            }}

                                        >
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                onPress={() => {
                                                    this.setState({reason: ""})
                                                    close()
                                                }}
                                            >
                                                <Text>Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                borderStyle: 'solid',
                                                borderColor: '#ccc',
                                                borderTopWidth: StyleSheet.hairlineWidth,
                                                borderRightWidth: StyleSheet.hairlineWidth,
                                            }}
                                        >
                                            <TouchableOpacity
                                                style={{
                                                    flex: 1,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                                disabled={this.state.reason === ''}
                                                onPress={this._report.bind(this)}
                                            >
                                                <Text style={{
                                                    opacity: this.state.reason !== '' ? 1 : 0.5,
                                                }}>
                                                    Report
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            }

                        </View>
                    </PlatformSpecificKeyboardAvoidingView>
                </View>

            </Modal>
        )
    }
}

const PlatformSpecificKeyboardAvoidingView = (props) => {
    if (Platform.OS === 'ios') {
        return (
            <KeyboardAvoidingView {...props}>
                {props.children}
            </KeyboardAvoidingView>
        )
    } else {
        return (
            <View {...props}>
                {props.children}
            </View>
        )
    }
}