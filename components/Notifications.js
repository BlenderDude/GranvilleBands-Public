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
import {refresh, add} from "../actions/notifications"
import NavigatorService from "../router/service"
import ProfilePhoto from "../components/ProfilePhoto";

class Notifications extends Component {
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
                data={this.props.notifications}
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
                            onPress={() => NavigatorService.navigate("Post", {id: item.post_id})}
                        >
                            <TouchableOpacity
                                onPress={
                                    () => NavigatorService.navigate('User', {

                                        user: {
                                            id: item.action_user_id,
                                            first_name: item.first_name,
                                            last_name: item.last_name,
                                        }

                                    })
                                }
                            >
                                <ProfilePhoto user={item} size={30}/>
                            </TouchableOpacity>

                            <View style={{flex: 1, justifyContent: "center", paddingHorizontal: 10}}>
                                <Text>
                                    <Text
                                        style={{
                                            fontWeight: 'bold',
                                        }}
                                        onPress={
                                            () => NavigatorService.navigate('User', {

                                                user: {
                                                    id: item.action_user_id,
                                                    first_name: item.first_name,
                                                    last_name: item.last_name,
                                                }

                                            })
                                        }>
                                        {item.first_name + " " + item.last_name}
                                    </Text>
                                    {item.message}
                                </Text>
                            </View>

                            <Image
                                source={{uri: "https://gbands.danielabdelsamed.com/img/thumb_" + item.filename + ".jpg"}}
                                style={{
                                    width: 40,
                                    height: 40,
                                }}
                            />
                        </TouchableOpacity>
                    )
                }}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        notifications: state.notifications.notifications,
        refreshing: state.notifications.refreshing,
        loading: state.notifications.loading,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        refresh: () => dispatch(refresh()),
        add: () => dispatch(add())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
