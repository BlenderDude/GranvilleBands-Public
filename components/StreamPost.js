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
    TouchableWithoutFeedback,
    Animated,
    TouchableOpacity,
    PanResponder,
    Platform,
    Easing,
} from 'react-native';
import {connect} from 'react-redux'
import {like, dislike, comment, remove, report} from "../actions/posts"
import ReactNativeHaptic from 'react-native-haptic'
import Heart from "./Heart"

import MultiPhotoView from "./MultiPhotoView"
import InteractionBar from "./InteractionBar"
import ProgressiveImage from "./ProgressiveImage"
import RecentComments from "./RecentComments"

import API from '../API'
import HamburgerButton from "./HamburgerButton";
import ActionMenuButton from "./ActionMenuButton";
import ActionMenu from "./ActionMenu";
import ProfilePhoto from "./ProfilePhoto";
import LikesBar from "./LikesBar";

//import Heart from '../img/heart.png';

class StreamPost extends Component {
    state = {
        currentPhoto: 0,
        miniCurrentPhoto: 0,
        post: this.props.post,
        heartsAnimating: false,
        heartCollections: [],
        hearts: [],
        actionMenu: false,
        actionMenuAnim: new Animated.Value(0),
        saving: false,
    }

    constructor(props) {
        super(props)

        let likeAnims = []
        let likeOpacity = []
        for (let i = 0; i < 20; i++) {
            likeAnims.push(new Animated.ValueXY({x: 0, y: 0}))
            likeOpacity.push(new Animated.Value(0))
        }
        this.lastPhoto = 0;
        this.panControl = false;
        this._like.bind(this);
        this._unlike.bind(this)
        this._viewComments.bind(this)
        this._comment.bind(this)
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.prepare();
        }

    }


    _like(x = 0, y = 0) {
        this.props.like(this.props.post.id)
        this._likeAnimation(x, y);

    }

    _unlike() {
        if (Platform.OS === "ios") {
            ReactNativeHaptic.generate('notification')
        }

        this.props.dislike(this.props.post.id)
    }

    _comment() {
        this.props.toCommentsPage(this.props.post, true)
    }

    _remove() {
        this.props.remove(this.props.post.id)
    }

    _save() {
        this.setState({saving: true})
        Promise.all(this.props.post.photos.map((photo) => {
            return CameraRoll.saveToCameraRoll("https://gbands.danielabdelsamed.com/img/" + photo.filename + ".jpg")
        })).then(() => {
            this.setState({saving: false})
        })
    }

    _viewComments() {
        this.props.toCommentsPage(this.props.post, false)
    }

    _handleImagePress(e) {
        const DOUBLE_PRESS_DELAY = 500;
        const now = new Date().getTime();

        if (this.lastImagePress && (now - this.lastImagePress) < DOUBLE_PRESS_DELAY) {
            delete this.lastImagePress;
            this._handleImageDoublePress(e);
        }
        else {
            this.lastImagePress = now;
        }
    }

    _handleImageDoublePress(e) {
        this._like(e.nativeEvent.locationX, e.nativeEvent.locationY);
    }

    _setPhoto(id) {
        this.setState({
            currentPhoto: id,
        })
    }

    _likeAnimation(x = 0, y = 0) {
        const AMOUNT_OF_HEARTS = 20
        const ANIMATION_LENGTH = 500
        const HEART_SIZE = 0.1
        const deviceWidth = Dimensions.get('window').width
        let actualPos = {}
        if (x === 0 || y === 0) {
            actualPos.x = 0
            actualPos.y = 0
        } else {
            actualPos.x = x - deviceWidth / 2
            actualPos.y = y - deviceWidth / 2
        }
        if (this.state.heartsAnimating) {
            return true;
        }

        let animations = [];
        if (Platform.OS === "ios") {
            for (let i = 0; i < 20; i++) {

                setTimeout(() => {
                    ReactNativeHaptic.generate('impact')
                }, i * 15)

            }
        }

        let heartCollection = {
            hearts: [],
            heartAnimations: [],
        }
        const nextIndex = this.state.heartCollections.length
        for (let i = 0; i < AMOUNT_OF_HEARTS; i++) {
            heartCollection.heartAnimations.push({
                opacity: new Animated.Value(0),
                transform: new Animated.ValueXY(actualPos),
            })

        }
        let heartCollections = this.state.heartCollections.slice(0)
        heartCollections.push(heartCollection)
        this.setState({heartCollections: heartCollections}, () => {
            for (let i = 0; i < AMOUNT_OF_HEARTS; i++) {
                heartCollection.hearts.push(
                    <Heart key={i + (nextIndex * AMOUNT_OF_HEARTS)} size={HEART_SIZE} style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        opacity: this.state.heartCollections[nextIndex].heartAnimations[i].opacity,
                        transform: this.state.heartCollections[nextIndex].heartAnimations[i].transform.getTranslateTransform()
                    }}/>)
                let position = {}
                const dir = Math.atan2((Math.random() - .5), (Math.random() - .5))
                //const radPerHeart = 6.28318530718/(AMOUNT_OF_HEARTS)
                //const t = i * radPerHeart
                //const deviceMultiplier = 1 * (deviceWidth/2)
                //const dir = i * .314 * 2
                position.x = actualPos.x + (Math.cos(dir)) * (deviceWidth / 4);
                position.y = actualPos.y + (Math.sin(dir)) * (deviceWidth / 4);

                //position.x = Math.sin(t)**3 * (deviceMultiplier)
                //position.y = -1 * (13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/16 * (deviceMultiplier) - 50
                animations.push(
                    Animated.parallel([
                        Animated.timing(this.state.heartCollections[nextIndex].heartAnimations[i].transform, {
                            toValue: {x: position.x, y: position.y},
                            duration: ANIMATION_LENGTH,
                            //easing: Easing.easeOut,
                            userNativeDriver: true,
                        }),
                        Animated.sequence([
                            Animated.timing(this.state.heartCollections[nextIndex].heartAnimations[i].opacity, {
                                duration: 100,
                                toValue: 1,
                                useNativeDriver: false,
                            }),
                            Animated.timing(this.state.heartCollections[nextIndex].heartAnimations[i].opacity, {
                                duration: ANIMATION_LENGTH - 100,
                                //delay: ANIMATION_LENGTH/2,
                                toValue: 0,
                                useNativeDriver: false,
                            })
                        ])
                    ])
                )
            }
            heartCollections = this.state.heartCollections.slice(0)
            heartCollections[nextIndex] = heartCollection
            this.setState({heartCollections, heartsAnimating: true})
            //Animated.parallel(animations).start()

            Animated.stagger(15, animations).start(() => {
                let currentHeartsArray = this.state.heartCollections.slice(0);
                currentHeartsArray.shift()
                const heartCollections = currentHeartsArray
                this.setState({heartCollections, heartsAnimating: false})

            });
        })
    }

    _hamburgerPress() {
        this.setState({actionMenu: !this.state.actionMenu});
        Animated.timing(this.state.actionMenuAnim, {
            toValue: !this.state.actionMenu ? 1 : 0,
            duration: 250,
        }).start();

    }

    render() {
        const post = this.props.post
        if (!post) return null;
        const width = Dimensions.get('window').width
        if (post.photos.length === 0) {
            return null;
        }
        let removeHeight = {}
        if (post.removed) {
            removeHeight = {height: 0, overflow: 'hidden', marginBottom: 0,}
        }


        return (

            <View
                style={[{
                    //height: Dimensions.get('window').width + 200,
                    marginBottom: 15,
                    backgroundColor: "#fff",
                    // borderTopColor: "#ccc",
                    // borderTopWidth: StyleSheet.hairlineWidth,
                }, removeHeight]}>
                <View
                    style={{
                        borderBottomColor: '#ccc',
                        borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                >
                    <View
                        style={{
                            height: 30,
                            flexDirection: "row",
                            paddingLeft: 5,
                            paddingRight: 5,
                            marginTop: 5,
                            marginBottom: 5,

                        }}>
                        <ProfilePhoto user={post} size={30}/>

                        <TouchableOpacity
                            onPress={() => {
                                const user = {
                                    id: post.user_id,
                                    first_name: post.first_name,
                                    last_name: post.last_name,
                                    group_id: post.group_id,
                                }
                                this.props.toUserPage(user);
                            }}
                            style={{
                                height: 30,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "left",
                                    fontSize: 16,
                                    height: 20,
                                    lineHeight: 20,
                                    paddingLeft: 5,
                                }}>
                                {post.first_name + " " + post.last_name}
                            </Text>
                        </TouchableOpacity>
                        <View
                            style={{
                                flex: 1,
                                height: 30,
                                justifyContent: 'center',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "right",
                                    height: 20,
                                    fontSize: 16,
                                    lineHeight: 20,
                                }}>
                                {post.format_time}
                            </Text>
                        </View>
                        <HamburgerButton onPress={this._hamburgerPress.bind(this)}
                                         cancelButton={this.state.actionMenu}/>

                    </View>
                </View>
                <View
                    style={{
                        height: Dimensions.get('window').width,
                        overflow: "hidden",
                    }}
                >
                    <ActionMenu actionMenuAnim={this.state.actionMenuAnim}>

                        <ActionMenuButton
                            title={Platform.OS === 'ios' ? (this.state.saving ? "Downloading" : "Save") : "Saving Soon 😊"}
                            onPress={this._save.bind(this)} disabled={Platform.OS !== 'ios'}
                            active={this.state.saving}/>
                        {this.props.appUser.deletePost || this.props.appUser.id === this.props.post.user_id ?
                            <ActionMenuButton title="Delete" onPress={this._remove.bind(this)}
                                              active={post.removing || false}/>
                            : null}
                    </ActionMenu>
                    <Animated.View pointerEvents="none"
                                   style={{
                                       alignItems: 'center',
                                       justifyContent: 'center',
                                       width: Dimensions.get('window').width,
                                       height: Dimensions.get('window').width,
                                       backgroundColor: "#ffffff00",
                                       position: 'absolute',
                                       top: 0,
                                       left: 0,
                                       zIndex: 5,
                                   }}
                    >
                        <View style={{width: 60, height: 60}}>
                            {this.state.heartCollections.map((heartCollection) => heartCollection.hearts)}
                        </View>

                    </Animated.View>
                    <ScrollView
                        horizontal={true}
                        pagingEnabled={true}
                        scrollEnabled={post.photos.length > 1}
                        showsHorizontalScrollIndicator={Platform.OS === "android"}
                        contentOffset={{
                            x: this.state.currentPhoto * Dimensions.get('window').width,
                        }}
                        ref="photoScroll"
                        pointerevents="None"

                    >
                        {post.photos.map((photo) => {
                            return (
                                <ProgressiveImage
                                    key={photo.id}
                                    width={Dimensions.get('window').width}
                                    height={Dimensions.get('window').width}
                                    filename={photo.filename}
                                    preload={photo.preload}
                                    onPress={this._handleImagePress.bind(this)}
                                    like={this._like.bind(this)}
                                    comment={this._comment.bind(this)}
                                    zoomable={true}
                                />
                            )
                        })}

                    </ScrollView>

                </View>
                {(post.photos.length > 1) ?
                    <MultiPhotoView photoScroll={this.refs.photoScroll} post={this.props.post} currentPhoto={0}
                                    setPhoto={this._setPhoto.bind(this)} scrollState={this.props.scrollState}/>
                    : null}
                <View style={{
                    marginTop: 10,
                    marginBottom: 10,
                }}>
                    <View
                        style={{
                            marginBottom: 10,
                            flexDirection: 'row'
                        }}
                    >

                        <View style={{flex: 1}}>
                            <View
                                style={{
                                    position: 'absolute',
                                    top: 2,
                                    left: 15,
                                }}
                            >
                                <InteractionBar
                                    liked={this.props.post.likes.map(like => like.user_id).indexOf(this.props.appUser.id) !== -1}
                                    like={this._like.bind(this)}
                                    unlike={this._unlike.bind(this)}
                                    comment={this._comment.bind(this)}/>
                            </View>
                        </View>

                        <LikesBar likes={this.props.post.likes}/>
                    </View>

                    <View
                        style={{
                            marginHorizontal: 15,
                        }}
                    >

                        {post.caption !== "" ?
                            <Text
                                style={{
                                    paddingTop: 5,
                                }}
                            >
                                <Text
                                    onPress={() => {
                                        const user = {
                                            id: post.user_id,
                                            first_name: post.first_name,
                                            last_name: post.last_name,
                                            group_id: post.group_id,
                                        }
                                        this.props.toUserPage(user);
                                    }}
                                    style={{fontWeight: 'bold'}}
                                >
                                    {post.first_name + " " + post.last_name + "  "}
                                </Text>
                                <Text>{post.caption}</Text>
                            </Text>
                            : null}

                        <RecentComments post={post} viewComments={this._viewComments.bind(this)}
                                        toUserPage={this.props.toUserPage.bind(this)}/>
                    </View>

                </View>


            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        post: state.posts.posts[parseInt(props.postID)],
        appUser: state.user,

    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        like: (id) => dispatch(like(id)),
        dislike: (id) => dispatch(dislike(id)),
        comment: (id, comment) => dispatch(comment(id, comment)),
        remove: (id) => dispatch(remove(id)),
        report: (id) => dispatch(report(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamPost)



