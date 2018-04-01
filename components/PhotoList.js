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
import ReactNativeHaptic from 'react-native-haptic';
import API from "../API"

import StreamPost from "./StreamPost/StreamPost"
import {connect} from "react-redux"
import {refresh, loadMore} from "../actions/posts"
import {refreshUserPosts} from "../actions/users";
import AnimatedStreamPost from "./AnimatedStreamPost";

class PhotoList extends Component {
    currentPhoto = 0

    state = {
        photos: [],
        refreshing: false,
        startCursor: "",
        loading: false,
        scrollEnabled: true,
        user: {},
        scrollPosition: new Animated.Value(0),
    }

    componentWillMount() {
        this._morePhotos.bind(this)
        this._refresh.bind(this)
        this._refresh()
    }

    _morePhotos() {
        this.props.loadMore()
    }

    _refresh() {
        this.props.refreshUserPosts(this.props.appUser.id)
        this.props.refresh()

    }

    _scrollState(state) {
        this.setState({
            scrollEnabled: state,
        })
    }

    render() {
        return (
            <FlatList
                data={this.props.postsData.postStream}
                keyExtractor={post => post}
                numColumns={1}
                style={{flex: 1}}
                scrollEnabled={this.state.scrollEnabled}
                refreshing={this.props.postsData.refreshing}
                onRefresh={this._refresh.bind(this)}
                extraData={this.props.postsData.refreshing}
                maxToRenderPerBatch={10}
                initialNumToRender={3}
                ref={(component) => global._registerScrollComponent(component)}
                onEndReachedThreshold={10}
                onEndReached={this.props.loadMore}
                // onScroll={Animated.event(
                //      [{nativeEvent: {contentOffset: {y: this.state.scrollPosition}}}],
                //      {useNativeDriver: true})}
                // onScroll={(e) => {
                //     const y = e.nativeEvent.contentOffset.y;
                //     const photo = Math.floor(y / (Dimensions.get('window').width + 200) + 0.2);
                //     if (this.currentPhoto !== photo) {
                //         let lastPhoto = this.currentPhoto;
                //         this.currentPhoto = photo;
                //         if (Platform.OS == "ios") {
                //             ReactNativeHaptic.generate('impact');
                //         }
                //     }
                // }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                //ItemSeparatorComponent={()=><View style={{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:"#ccc",height:3,margin: 5,}}/>}
                /*

                                        <StreamPost
                            user={this.props.appUser}
                            postID={item}
                            index={index}
                            scrollState={this._scrollState.bind(this)}
                            toUserPage={this.props.toUserPage}
                            toLikesPage={this.props.toLikesPage}
                            toCommentsPage={this.props.toCommentsPage}
                            scrollPosition={this.state.scrollPosition}
                        />

                 */

                renderItem={({item, index}) => {
                    return (
                        <StreamPost id={item} scrollState={this._scrollState.bind(this)}/>
                    )
                }
                }/>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        postsData: state.posts,
        appUser: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        refresh: () => dispatch(refresh()),
        loadMore: () => dispatch(loadMore()),
        refreshUserPosts: (id) => dispatch(refreshUserPosts(id)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoList)