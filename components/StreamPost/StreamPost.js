import React, {Component} from 'react'
import {
    Text,
    View,
    Platform,
} from 'react-native'
import {connect} from 'react-redux'
import ReactNativeHaptic from 'react-native-haptic'
import NavigatorService from '../../router/service'
import PostHeader from "./PostHeader";
import PhotosManager from "./PhotosManager";
import Comments from "./Comments";
import InteractionBar from "./InteractionBar";
import EditorOverlay from "./EditorOverlay";

import {like} from "../../actions/posts"
import {dislike} from "../../actions/posts"
import LikesOverlay from "./LikesOverlay";
import LargeHeart from "./LargeHeart";

class StreamPost extends Component {
    state = {
        likesOpen: false,
        editorOpen: false,
        likeAnimation: false,
    }

    componentWillMount() {
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.prepare();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //return true
        if (nextProps.post.removed) {
            return true
        }


        const likesSame = nextProps.post.likes.length === this.props.post.likes.length
        const commentsSame = nextProps.post.comments.length === this.props.post.comments.length
        const captionSame = nextProps.post.caption === this.props.post.caption
        const photosSame = nextProps.post.photos.length === this.props.post.photos.length
        const likesOpen = nextState.likesOpen === this.state.likesOpen
        const editorOpen = nextState.editorOpen === this.state.editorOpen
        const likesAnimation = nextState.likeAnimation === this.state.likeAnimation
        const removing = nextProps.post.removing === this.props.removing

        return !(likesSame && commentsSame && captionSame && likesOpen && editorOpen && removing && photosSame && likesAnimation)
    }

    _openLikes() {
        if (Platform.OS === 'android') {
            const {post} = this.props
            NavigatorService.navigate("Likes", {post})
        } else {
            const CLOSE_TIMEOUT = 3000
            clearTimeout(this.closeTimeout)
            this.closeTimeout = setTimeout(() => this.setState({likesOpen: false}), CLOSE_TIMEOUT)
            if (!this.state.likesOpen && this.state.likesOpen && Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
            this.setState({
                likesOpen: true,
            })
        }
    }

    _toggleEditor() {
        this.setState({editorOpen: !this.state.editorOpen})
        if (Platform.OS === 'ios') {
            ReactNativeHaptic.generate('impact')
        }
    }

    _like(){
        const {post,user} = this.props
        //true = liked

        if(post.likes.map((like) => like.user_id).indexOf(user.id) !== -1){
            this.setState({likeAnimation:!this.state.likeAnimation})
        }else{
            this.props.like()
        }
    }


    render() {
        const {post, user, scrollState, like, unlike} = this.props
        let removeHeight = {}
        if (post.removed) {
            removeHeight = {height: 0, overflow: 'hidden', marginBottom: 0,}
        }
        if (!post) return null;
        return (
            <View
                style={[{
                    marginBottom: 20,
                }, removeHeight]}
            >
                <PostHeader
                    user={post}
                    time={post.upload_time}
                    openEditor={this._toggleEditor.bind(this)}
                />
                <View>
                    <LargeHeart
                        liked={post.likes.map(like => like.user_id).indexOf(user.id) !== -1}
                        likeAnimation={this.state.likeAnimation}
                    />
                    <PhotosManager like={this._like.bind(this)} photos={post.photos} scrollState={scrollState}/>

                    {Platform.OS === 'ios' ?
                        <LikesOverlay
                            likesOpen={this.state.likesOpen}
                            openLikes={this._openLikes.bind(this)}
                            likes={post.likes}
                            scrollState={scrollState}
                        />
                        : null}
                    <EditorOverlay
                        post={post}
                        editorOpen={this.state.editorOpen}
                        removing={post.removing || false}
                    />

                </View>
                <InteractionBar
                    liked={post.likes.map((like) => like.user_id).indexOf(user.id) !== -1}
                    like={like.bind(this, post.id)}
                    unlike={unlike.bind(this, post.id)}
                    post={post}
                    scrollState={scrollState}
                    openLikes={this._openLikes.bind(this)}
                    likesOpen={this.state.likesOpen}
                    time={post.upload_time}
                />
                <Comments post={post}/>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        post: state.posts.posts[parseInt(props.id)],
        user: state.user,
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        like: () => dispatch(like(props.id)),
        unlike: () => dispatch(dislike(props.id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamPost)