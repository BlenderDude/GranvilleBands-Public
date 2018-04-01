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
    TabBarIOS,
    Modal,
    TouchableHighlight,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    Platform,
    KeyboardAvoidingView,
    Keyboard, TouchableOpacity,
    Animated,
} from 'react-native';
import {connect} from 'react-redux'
import {comment} from "../actions/posts"
import ProfilePhoto from "../components/ProfilePhoto";

class Comments extends Component {
    static navigationOptions = ({navigation}) => ({
        title: "Comments",
        tabBarLabel: navigation.state.params.tab,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
        headerBackTitle: null,
    });

    constructor(props) {
        super(props)
        this.state = {
            startComment: false,
            commentText: "",
            commentLoading: false,
            animationCompletedDelay: 1,
        }

    }

    componentWillMount() {

    }

    componentDidMount() {
        setTimeout(() => {
            if (this.state.startComment) {
                try {
                    this.refs.commentsScroll.scrollToEnd({animated: true})
                } catch (e) {
                    console.log(e)
                }

            }
        }, 500)

    }

    _toUserPage(user) {

        const actualUser = {
            id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            group_id: user.group_id,
        }
        this.props.navigation.navigate('User', {user: actualUser, tab: 'Home'})
    }

    _handleCommentText(text) {
        this.setState({commentText: text})
    }

    _sendComment() {
        const comment = this.state.commentText
        Keyboard.dismiss();
        this.setState({commentText: ""})

        this.props.comment(this.props.post.id, comment)
        setTimeout(() => this.refs.commentsScroll.scrollToEnd({animated: true}), 500)
    }

    _animationComplete() {
        if (this.state.animationCompletedDelay === 1) {
            this.setState({animationCompletedDelay: 0})
        }
    }

    render() {
        const post = this.props.post
        return (
            <View style={{flex: 1}}>
                {Platform.OS === "android" ?
                    null
                    :
                    <StatusBar
                        barStyle="dark-content"
                        translucent={true}
                        hidden={false}
                    />
                }
                {post.caption === "" ? null :
                    <View key={"caption"}
                          style={{
                              flexDirection: 'row',
                              borderBottomWidth: 1,
                              borderBottomColor: '#333',
                              padding: 5,

                          }}
                    >
                        <TouchableOpacity
                            onPress={this._toUserPage.bind(this, {...post, user_id: post.id})}
                        >
                            <ProfilePhoto user={post} style={{marginRight: 5}}/>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1
                            }}>
                            <Text
                                onPress={this._toUserPage.bind(this, post)}
                                style={{fontWeight: 'bold'}}
                            >{post.first_name + " " + post.last_name}</Text>
                            <Text>
                                {post.caption}
                            </Text>
                        </View>
                    </View>
                }
                <ScrollView style={{flex: 1}} ref="commentsScroll">
                    <View style={{flex: 1, paddingBottom: 5}}>

                        {post.comments.map((comment, i) => {
                            return (
                                <CurrentComment key={comment.id} startComment={this.state.startComment}
                                                animationCompletedDelay={this.state.animationCompletedDelay}
                                                animationComplete={this._animationComplete.bind(this)} i={i}
                                                comment={comment} toUserPage={this._toUserPage.bind(this)}/>
                            )
                        })}
                    </View>
                </ScrollView>

                <PlatformSpecificKeyboardAvoidingView behavior="padding" keyboardVerticalOffset={65}>
                    <View
                        style={{
                            borderTopColor: "#ccc",
                            borderTopWidth: 1,
                            paddingHorizontal: 5,
                            paddingVertical: 6,
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                width: Dimensions.get('window').width - 100,
                                height: 38,
                            }}
                        >
                            <TextInput
                                style={{
                                    backgroundColor: Platform.OS === 'ios' ? "#efefef" : "#fff",
                                    height: 38,
                                    borderRadius: 5,
                                    padding: 5,
                                    flex: 1,
                                    fontSize: 18,
                                }}
                                blurOnSubmit={true}
                                returnKeyType="send"
                                onChangeText={this._handleCommentText.bind(this)}
                                autoFocus={this.state.startComment}
                                onSubmitEditing={this._sendComment.bind(this)}
                                value={this.state.commentText}
                                placeholder="Comment"
                                autoCapitalize="sentences"
                                autoCorrect={true}
                            />
                        </View>
                        {!this.state.commentLoading ?
                            <Button
                                title="Comment"
                                onPress={this._sendComment.bind(this)}
                                disabled={!(this.state.commentText.replace(/\s/g, '').length)}
                                style={{
                                    width: 100,
                                    height: 38,
                                }}
                            />
                            :
                            <View
                                style={{
                                    width: 100,
                                    height: 38,
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <ActivityIndicator animated={true}/>
                            </View>
                        }

                    </View>
                </PlatformSpecificKeyboardAvoidingView>

            </View>
        )

    }
}

const mapStateToProps = (state, props) => {
    return {
        post: state.posts.posts[props.navigation.state.params.post.id],
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        comment: (id, commentText) => dispatch(comment(id, commentText)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comments)

class CurrentComment extends Component {
    state = {
        translateX: new Animated.Value(50),
        opacity: new Animated.Value(0)
    }

    componentDidMount() {
        const DURATION = 750
        const START_COMMENT_SPEED_UP = this.props.startComment ? 0.3 : 1
        const DELAY = 75 * this.props.animationCompletedDelay * START_COMMENT_SPEED_UP

        Animated.parallel([
            Animated.timing(this.state.translateX, {
                duration: DURATION,
                toValue: 0,
                delay: this.props.i * DELAY,
                useNativeDriver: true,
            }),
            Animated.timing(this.state.opacity, {
                duration: DURATION,
                toValue: 1,
                delay: this.props.i * DELAY,
                useNativeDriver: true,
            })

        ]).start(() => this.props.animationComplete())
    }

    render() {
        const {comment, toUserPage} = this.props
        const {translateX, opacity} = this.state
        return (
            <Animated.View
                style={{

                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderBottomColor: '#ccc',
                    padding: 5,


                }}
            >
                <Animated.View
                    style={{
                        transform: [{translateX}],
                        opacity,
                        flexDirection: 'row',
                    }}
                >
                    <TouchableOpacity
                        onPress={() => toUserPage(comment)}
                    >
                        <ProfilePhoto user={comment} style={{marginRight: 5}}/>
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1
                        }}>
                        <Text
                            onPress={() => toUserPage(comment)}
                            style={{fontWeight: 'bold'}}
                        >{comment.first_name + " " + comment.last_name}</Text>
                        <Text>
                            {comment.comment}
                        </Text>
                    </View>
                </Animated.View>
            </Animated.View>
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
        return props.children
    }
}