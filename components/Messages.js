import React, {Component} from 'react';
import {
    AppRegistry, Image, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    CameraRoll,
    View,
    Dimensions,
    StatusBar,
    Modal,
    TouchableHighlight,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    Platform,
    TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux'
import {refresh, add} from "../actions/messages"
import NavigatorService from "../router/service"
import ProfilePhoto from "../components/ProfilePhoto";

class Messages extends Component {
    static navigationOptions = {
        title: 'Notifications',
        headerBackTitle: null,
    }

    componentWillMount() {
        this.props.refresh()
    }

    _keyExtractor = (item) => item.id;

    render() {
        return (
            <FlatList
                data={this.props.messages}
                keyExtractor={this._keyExtractor.bind(this)}
                onEndReachedThreshold={1}
                onEndReached={this.props.add}
                refreshing={this.props.refreshing}
                onRefresh={this.props.refresh}
                renderItem={({item}) => {
                    return (
                        <TouchableOpacity
                            style={{
                                borderBottomColor: '#ccc',
                                borderBottomWidth: StyleSheet.hairlineWidth,
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                            }}
                            onPress={() => NavigatorService.navigate("User", {
                                user: {
                                    id: item.sender_id,
                                    first_name: item.first_name,
                                    last_name: item.last_name,
                                }
                            })}
                        >
                            <ProfilePhoto user={item} size={30}/>

                            <View style={{flex: 1, paddingHorizontal: 10}}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                        marginBottom: 3,
                                    }}
                                >
                                    {item.title}
                                </Text>
                                <Text>
                                    {item.body}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        messages: state.messages.messages,
        refreshing: state.messages.refreshing,
        loading: state.messages.loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        refresh: () => dispatch(refresh()),
        add: () => dispatch(add())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Messages)
