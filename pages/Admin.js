import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    TabNavigator
} from 'react-navigation';

export default class Admin extends Component {
    static navigationOptions = {
        title: 'Admin',
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
    }
    state = {
        loaded: false,
    }
    tabs = {}

    componentWillMount() {
        const url = "https://gbands.danielabdelsamed.com/api/users/permissions";

        var headers = new Headers();

        headers.append("Id", global.id);
        headers.append("Token", global.token);

        var conf = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            cache: 'default',
        };

        fetch(url, conf).then(res => res.json()).then((json) => {
            if (json.success) {
                const permissions = json.body;
                if (permissions.changeGroup) {
                    this.tabs.Groups = {
                        screen: ChangeGroup,
                    }
                }
                if (permissions.changeGroup) {
                    this.tabs.Approve = {
                        screen: ApproveUsers,
                    }
                }

                this.setState({
                    loaded: true,
                    permissions: json.body,
                });

            }

        });
    }

    render() {
        if (this.state.loaded) {
            const AdminTabs = TabNavigator(this.tabs, {
                headerMode: 'float',
                tintColor: "#fcfcfc",
                headerStyle: {
                    backgroundColor: "#fcfcfc",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                },
                tabBarPosition: 'bottom',
                tabBarOptions: {
                    //activeTintColor: 'blue',
                },
            });
            return (
                <View style={{
                    paddingTop: 20, backgroundColor: "#fcfcfc",
                    flex: 1,

                }}>
                    <View
                        style={{
                            height: 45,
                            backgroundColor: "#fcfcfc",
                            borderBottomColor: "#ccc",
                            borderBottomWidth: 1,

                        }}
                    >
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 16,
                            paddingTop: 10,
                            fontWeight: 'bold',
                        }}>Admin</Text>
                    </View>
                    <AdminTabs/>

                </View>
            )
        } else {
            return (
                <View style={{
                    paddingTop: 20, backgroundColor: "#fcfcfc",
                    flex: 1,

                }}>
                    <View
                        style={{
                            height: 45,
                            backgroundColor: "#fcfcfc",
                            borderBottomColor: "#ccc",
                            borderBottomWidth: 1,

                        }}
                    >
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                padding: 10,
                                paddingLeft: 20,
                                paddingTop: 10,
                                zIndex: 4,
                            }}
                            onPress={() => {
                                this.props.navigation.goBack();

                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                }}
                            >Back</Text>
                        </TouchableOpacity>
                        <Text style={{
                            textAlign: 'center',
                            fontSize: 18,
                            paddingTop: 10,
                        }}>Admin</Text>
                    </View>
                    <Text>Loading</Text>

                </View>
            )
        }

    }
}

class ChangeGroup extends Component {
    render() {
        return (<Text>Change Groups</Text>)
    }
}

class ApproveUsers extends Component {
    render() {
        return (<Text>Approve Users</Text>)
    }
}