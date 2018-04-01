import React, {PureComponent} from 'react'
import {
    View,
    Text
} from 'react-native'
import Comment from "./Comment";
import NavigatorService from '../../router/service'

export default class Comments extends PureComponent {
    render() {
        const {comments, caption} = this.props.post
        const lastComments = comments.filter((_, i) => i > comments.length - 3)
        return (
            <View
                style={{
                    marginTop: 15,
                }}
            >
                {caption ?
                    <Comment
                        user={this.props.post}
                        text={caption}
                        style={{
                            marginBottom: 5,
                        }}
                    />
                    : null}
                {lastComments.map((comment) =>
                    <Comment
                        key={comment.id}
                        user={comment}
                        text={comment.comment}
                        style={{
                            marginLeft: 15,

                        }}
                    />)}
                {comments.length > 0 ?
                    <Text
                        onPress={() => NavigatorService.navigate("Comments", {post: this.props.post})}
                        style={{
                            marginHorizontal: 15,
                            color: "#acacac"
                        }}
                    >
                        View {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                    </Text>
                    : null}
            </View>
        )
    }
}