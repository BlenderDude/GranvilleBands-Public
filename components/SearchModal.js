import React, {Component} from 'react'
import {
    View,
    Modal,
    TouchableWithoutFeedback,
    Animated,
    Image,
    Dimensions,
    TextInput,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import API from '../API'
import NavigatorService from '../router/service'
import searchIcon from '../img/search_passive.png'
import ProfilePhoto from "./ProfilePhoto";

export default class SearchModal extends Component {
    state = {
        animation: new Animated.Value(0),
        searchValue: "",
        results: [],
        fetching: false,
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.visible !== nextProps.visible) {
            this.state.animation.setValue(nextProps.visible ? 0 : 1)
            Animated.timing(this.state.animation, {
                toValue: nextProps.visible ? 1 : 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
        if (!nextProps.visible) {
            this.setState({
                results: [],
                fetching: false,
                searchValue: "",
            })
        }
    }


    _search(text) {
        this.setState({searchValue: text, fetching: true})
        API.users.search(text).then(users => this.setState({results: users, fetching: false,}))
    }

    render() {
        return (
            <View>
                <Modal
                    visible={this.props.visible}
                    onRequestClose={this.props.close}
                    animationType="fade"
                    transparent
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: "rgba(0,0,0,0.7)"
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                height: 62,
                                backgroundColor: "#fff",
                                zIndex: 5,
                                borderBottomWidth: 1,
                                borderColor: "#ccc",
                                borderStyle: "solid",
                            }}
                        >
                            <View
                                style={{
                                    width: 45,
                                    height: 40,
                                    position: 'absolute',
                                    top: 20,
                                    left: 0,
                                    backgroundColor: '#fff',
                                    zIndex: 6,
                                    borderTopRightRadius: 5,
                                    borderBottomRightRadius: 5,
                                }}
                            >
                                <Animated.Image
                                    source={searchIcon}
                                    resizeMode="contain"
                                    style={{
                                        width: 30,
                                        height: 30,
                                        position: 'absolute',
                                        bottom: 5,
                                        right: 10,
                                        transform: [
                                            {
                                                translateX: this.state.animation.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: [Dimensions.get('window').width - 45, 0]
                                                })
                                            }
                                        ]
                                    }}/>
                            </View>
                            <View
                                style={{
                                    marginLeft: 45,
                                    marginRight: 5,
                                    marginTop: 25,
                                    backgroundColor: '#f2f2f2',
                                    height: 32,
                                    padding: 5,
                                    borderRadius: 5,
                                }}
                            >
                                <TextInput
                                    style={{
                                        flex: 1,
                                    }}
                                    value={this.state.searchValue}
                                    onChangeText={this._search.bind(this)}
                                    placeholder="Search"
                                    autoFocus
                                    clearButtonMode="always"
                                />
                            </View>
                        </View>
                        {this.state.searchValue !== "" && this.state.results.length === 0 && !this.state.fetching ?
                            <View
                                style={{
                                    height: 50,
                                    width: '100%',
                                    backgroundColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 4
                                }}
                            >
                                <Text>No results</Text>
                            </View>
                            : null}
                        <View>
                            {this.state.results.length > 0 && this.state.results !== "" ?
                                <ScrollView
                                    style={{
                                        overflow: 'visible',
                                        backgroundColor: '#fff',
                                        zIndex: 4,
                                    }}
                                    keyboardDismissMode="on-drag"
                                    keyboardShouldPersistTaps="handled"
                                >
                                    {this.state.results.map(user => <ResultItem key={user.id} user={user}
                                                                                close={this.props.close}/>)}
                                </ScrollView>
                                : null}
                        </View>
                        <TouchableWithoutFeedback
                            onPress={this.props.close}
                        >
                            <View style={{flex: 1}}/>
                        </TouchableWithoutFeedback>
                    </View>
                </Modal>
            </View>
        )
    }
}

class ResultItem extends Component {
    _toUser() {
        const {user, close} = this.props
        close()
        NavigatorService.navigate('User', {user})
    }

    render() {
        const {user} = this.props
        return (
            <TouchableOpacity
                style={{
                    height: 50,
                    backgroundColor: '#fff',
                    paddingHorizontal: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
                onPress={this._toUser.bind(this)}
            >
                <ProfilePhoto user={user} size={40}/>
                <Text style={{marginLeft: 10, fontSize: 14, fontWeight: 'bold'}}>
                    {user.first_name} {user.last_name}
                </Text>

            </TouchableOpacity>
        )
    }
}