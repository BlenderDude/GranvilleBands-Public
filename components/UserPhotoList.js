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
    TouchableOpacity,
    Button,
    ActivityIndicator,
    Vibration,
    FlatList,
    ImagePickerIOS,
    Platform
} from 'react-native';
import ImagePicker from 'react-native-image-picker'
import {connect} from 'react-redux';
import {addUserPosts, getUserData, refreshUserPosts} from "../actions/users";
import ProgressiveImage from "./ProgressiveImage";
import {changeProfilePhoto} from "../actions/user";
import ProfilePhoto from "./ProfilePhoto";

class UserPhotoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            refreshing: false,
            loading: false,
            startCursor: "",
            user: this.props.user,
            loadingUser: true,
            end: false,
        }
    }

    componentWillMount() {
        const {user} = this.props
        this.props.getUserData(user.id)
        this.props.refreshUserPosts(user.id)
        // this.getUserPosts.bind(this);
        // this.getUserData.bind(this);
        // this.getMoreUserPosts.bind(this);
    }

    componentDidMount() {
        // this.getUserPosts();
        // this.getUserData();
    }


    getUserPosts() {
        if (this.state.refreshing) return false
        const user = this.state.user;
        const {id, token} = this.props.appUser
        const url = "https://gbands.danielabdelsamed.com/api/posts/requestbyuser/" + user.id + "/30";

        var headers = new Headers();

        headers.append("Id", id);
        headers.append("Token", token);

        var conf = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            cache: 'default',
        };
        this.setState({refreshing: true, loading: true,})
        fetch(url, conf).then(res => res.json()).then((json) => {
            if (json.success) {
                this.setState({
                    end: false,
                    refreshing: false,
                    loading: false,
                    posts: json.body.posts,
                    viewerInfo: json.body.user,
                    startCursor: json.body.responseInfo.end_cursor
                });
            }
        }).catch(() => {
            this.setState({
                refreshing: false,
                loading: false,
            })
        });
    }

    getMoreUserPosts() {
        if (this.state.loading || this.state.refreshing || this.state.end) return false
        const user = this.state.user;
        const {id, token} = this.props.appUser
        const url = "https://gbands.danielabdelsamed.com/api/posts/requestbyuser/" + user.id + "/30";

        var headers = new Headers();

        headers.append("Id", id);
        headers.append("Token", token);

        var conf = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            cache: 'default',
            body: JSON.stringify({startCursor: this.state.startCursor}),
        };
        this.setState({loading: true,})
        fetch(url, conf).then(res => res.json()).then((json) => {
            if (json.success) {
                if (json.body.posts.length === 0) {
                    this.setState({end: true})
                }
                this.setState({
                    loading: false,
                    posts: [...this.state.posts, ...json.body.posts],
                    startCursor: json.body.responseInfo.end_cursor
                });
            }
        }).catch(() => {
            this.setState({
                loading: false,
            })
        });
    }

    getUserData() {
        const user = this.state.user;
        const {id, token} = this.props.appUser
        const url = "https://gbands.danielabdelsamed.com/api/users/userdata/" + user.id;


        var headers = new Headers();

        headers.append("Id", id);
        headers.append("Token", token);

        var conf = {
            method: 'POST',
            headers: headers,
            mode: 'cors',
            cache: 'default',
        };

        fetch(url, conf).then(res => res.json()).then((json) => {
            if (json.success) {
                this.setState({user: {...this.state.user, ...json.body}, loadingUser: false});
            }
        }).catch(() => {
            this.getUserData();
        });
    }

    _selectProfilePhoto() {
        if (Platform.OS === 'ios') {
            ImagePickerIOS.openSelectDialog({}, (res) => {
                this.props.changeProfilePhoto(res)
            }, () => {
            })
        } else {
            const photoOptions = {
                title: 'Select Photo',
                mediaType: 'photo',
            }

            ImagePicker.launchImageLibrary(photoOptions, (res) => {
                if (!res.didCancel && !res.error && !res.customButton) {
                    const uri = "file://" + res.path
                    this.props.changeProfilePhoto(uri)
                }
            })
        }

    }

    render() {
        const {id} = this.props.user

        const users = this.props.users.users

        const userData = {
            postIds: [],
            first_name: "",
            last_name: "",
            username: "",
            total_posts: 0,
            like_total: 0,
            profile_pic: null,
            ...users[id]
        }

        const postIds = userData.postIds || []
        return (
            <FlatList
                data={postIds.map((postID) => this.props.posts.posts[postID])}
                keyExtractor={(post) => post.id}
                numColumns={3}
                style={{flex: 1}}
                refreshing={this.props.users.refreshing}
                onRefresh={this.props.refreshUserPosts.bind(this, id)}
                onEndReachedThreshold={1}
                onEndReached={this.props.addUserPosts.bind(this, id)}
                ListHeaderComponent={(
                    <View
                        style={{}}
                    >
                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderStyle: 'solid',
                                borderColor: '#ccc',
                            }}
                        >
                            <View style={{
                                height: 90,
                                flexDirection: 'row'
                            }}>
                                <View style={{
                                    width: 100,
                                    height: 90,
                                    justifyContent: 'center',
                                    alignItems: 'center',

                                }}>
                                    <View style={{
                                        width: 75,
                                        height: 75,
                                        borderRadius: 75 / 2,
                                        borderColor: "#333",
                                        borderWidth: StyleSheet.hairlineWidth,
                                        backgroundColor: "#ccc",
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        {this.props.profilePhotoLoading ?
                                            <View
                                                style={{
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Image
                                                    style={{
                                                        width: 75,
                                                        height: 75,
                                                        position: 'absolute',
                                                        borderRadius: 75 / 2,
                                                    }}
                                                    blurRadius={Math.floor((1 - this.props.profilePhotoProgress) * 100)}
                                                    source={{uri: this.props.nextProfilePhotoURI, isStatic: true}}
                                                />
                                                <View
                                                    style={{
                                                        width: 50,
                                                        height: 50,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        overflow: 'hidden',
                                                        borderRadius: 50,
                                                        position: 'absolute',
                                                        backgroundColor: "#ffffff88",
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 18,
                                                            textAlign: 'center',
                                                        }}
                                                    >

                                                        {Math.floor(this.props.profilePhotoProgress * 100)}%
                                                    </Text>
                                                </View>
                                            </View>
                                            :
                                            <ProfilePhoto user={userData} size={75}/>}

                                    </View>
                                    {id === this.props.appUser.id && !this.props.profilePhotoLoading ?
                                        <TouchableOpacity
                                            style={{
                                                height: 20,
                                                position: 'absolute',
                                                bottom: 10,
                                                right: 10,
                                                backgroundColor: "#ffffffdd",
                                                paddingHorizontal: 5,
                                                borderRadius: 10,
                                                borderColor: "#ccc",
                                                borderWidth: StyleSheet.hairlineWidth,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            hitSlop={{top: 7, left: 7, bottom: 7, right: 7}}
                                            onPress={this._selectProfilePhoto.bind(this)}
                                        >
                                            <Text
                                                style={{
                                                    fontSize: 12,
                                                    lineHeight: 14,
                                                    height: 14,
                                                }}
                                            >Change</Text>
                                        </TouchableOpacity>
                                        :
                                        null
                                    }
                                </View>

                                {(this.props.users.dataLoading) ?
                                    (
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <ActivityIndicator animated={true}/>
                                        </View>
                                    )
                                    :
                                    (
                                        <View
                                            style={{
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 36,
                                                    }}
                                                >{userData.like_total.toLocaleString()}</Text>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        color: "#555",
                                                    }}
                                                >Likes</Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 36,
                                                    }}
                                                >{userData.total_posts.toLocaleString()}</Text>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        color: "#555",
                                                    }}
                                                >Posts</Text>
                                            </View>
                                            <View>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: 36,
                                                    }}
                                                >{userData.id}</Text>
                                                <Text
                                                    style={{
                                                        textAlign: 'center',
                                                        color: "#555",
                                                    }}
                                                >User ID</Text>
                                            </View>
                                        </View>
                                    )
                                }

                            </View>
                            < View style={{
                                marginLeft: 12.5,
                                marginBottom: 5,
                            }}>
                                <Text
                                    style={{
                                        fontWeight: 'bold',
                                    }}
                                >{userData.first_name + " " + userData.last_name}</Text>
                            </View>
                        </View>
                        {userData.blocked ?
                            <View
                                style={{
                                    height: 50,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderColor: '#ccc',
                                    borderWidth: 1,
                                    borderStyle: 'solid',
                                    margin: 10,
                                }}
                            >
                                <Text>User Blocked</Text>
                            </View>

                            : null}
                    </View>
                )}
                renderItem={({item}) => {
                    if (userData.blocked) {
                        return null;
                    }
                    return (
                        <TouchableOpacity
                            style={{
                                width: Dimensions.get('window').width / 3,
                                height: Dimensions.get('window').width / 3,
                            }}
                            onPress={this.props.moveToPost.bind(this, item.id)}
                        >
                            <ProgressiveImage
                                width={Dimensions.get('window').width / 3}
                                height={Dimensions.get('window').width / 3}
                                filename={item.photos[0].filename}
                                preload={item.photos[0].preload}

                                zoomable={false}
                            />
                        </TouchableOpacity>
                    )
                }
                }/>
        )
    }
}

mapStateToProps = (state) => {
    return {
        appUser: state.user,
        users: state.users,
        posts: state.posts,
        profilePhotoLoading: state.user.profilePhotoLoading,
        profilePhotoProgress: state.user.profilePhotoProgress,
        nextProfilePhotoURI: state.user.nextProfilePhotoURI,
    }
}

mapDispatchToProps = (dispatch) => {
    return {
        getUserData: (id) => dispatch(getUserData(id)),
        refreshUserPosts: (id) => dispatch(refreshUserPosts(id)),
        addUserPosts: (id) => dispatch(addUserPosts(id)),
        changeProfilePhoto: (photoURI) => dispatch(changeProfilePhoto(photoURI))

    }

}
export default connect(mapStateToProps, mapDispatchToProps)(UserPhotoList)