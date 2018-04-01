import React, {Component} from "react"
import {
    AppRegistry, Image, ScrollView,
    StyleSheet,
    Text,
    TextInput,
    CameraRoll,
    View,
    Dimensions,
    StatusBar,
    TabBarIOS,
    Modal,
    TouchableHighlight,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
    PanResponder,
    Platform,
    Easing,
} from 'react-native';

export default class RecentComments extends Component {
    render() {
        const {post} = this.props
        const reverseOrderComments = post.comments.slice(0).reverse()
        const viewComments = this.props.viewComments
        return (
            <View
                style={{
                    marginLeft: 10,
                    marginRight: 10,
                }}
            >
                {reverseOrderComments[1] === undefined ? null :
                    <Text
                        style={{
                            paddingTop: 5,
                            fontSize: 12,
                        }}
                    >
                        <Text
                            onPress={() => {
                                const user = {
                                    id: reverseOrderComments[1].user_id,
                                    first_name: reverseOrderComments[1].first_name,
                                    last_name: reverseOrderComments[1].last_name,
                                    group_id: reverseOrderComments[1].group_id,
                                }
                                this.props.toUserPage(user);
                            }}
                            style={{fontWeight: 'bold'}}
                        >
                            {reverseOrderComments[1].first_name + " " + reverseOrderComments[1].last_name + "  "}
                        </Text>
                        <Text>{reverseOrderComments[1].comment}</Text>
                    </Text>
                }
                {reverseOrderComments[0] === undefined ? null :
                    <Text
                        style={{
                            paddingTop: 5,
                            fontSize: 12,
                        }}
                    >
                        <Text
                            onPress={() => {
                                const user = {
                                    id: reverseOrderComments[0].user_id,
                                    first_name: reverseOrderComments[0].first_name,
                                    last_name: reverseOrderComments[0].last_name,
                                    group_id: reverseOrderComments[0].group_id,
                                }
                                this.props.toUserPage(user);
                            }}
                            style={{fontWeight: 'bold'}}
                        >
                            {reverseOrderComments[0].first_name + " " + reverseOrderComments[0].last_name + "  "}
                        </Text>
                        <Text>{reverseOrderComments[0].comment}</Text>
                    </Text>
                }

                {post.comments.length > 0 ?
                    <TouchableOpacity
                        style={{
                            paddingTop: 5,
                        }}
                        onPress={viewComments}
                    >
                        <Text

                            style={{color: '#aaa', paddingTop: 5}}
                        >
                            {post.comments.length == 1 ?
                                `View ${post.comments.length} comment`
                                :
                                `View all ${post.comments.length} comments`
                            }

                        </Text>
                    </TouchableOpacity>
                    : null}


            </View>
        )
    }
}