import React, {Component} from 'react'
import {
    View,
    Dimensions,
    Animated,
    Text,
    TouchableOpacity,
    ScrollView, TextInput,
    Alert, ActivityIndicator,
    Image,
} from 'react-native'
import {connect} from 'react-redux'
import {updateCaption, remove, removePhoto} from "../../actions/posts"
import PhotoPreview from "./PhotoPreview";
import Photo from "./Photo";
import Report from "../Report";

const PHOTO_SIZE = 75

class EditorOverlay extends Component {
    state = {
        animation: new Animated.Value(this.props.editorOpen ? 1 : 0),
        captionOpen: false,
        caption: this.props.post.caption,
        report: false,
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.editorOpen !== this.props.editorOpen) {
            Animated.timing(this.state.animation, {
                toValue: nextProps.editorOpen ? 1 : 0,
                duration: 500,
                useNativeDriver: true,
            }).start()
        }
    }

    _remove() {
        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: this.props.remove, style: 'destructive'},
            ],
            {cancelable: false}
        )
    }

    _removePhoto(photoid) {
        Alert.alert(
            'Delete Photo',
            'Are you sure you want to delete this photo?',
            [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Delete', onPress: () => this.props.removePhoto(photoid), style: 'destructive'},
            ],
            {cancelable: false}
        )
    }

    render() {
        const {width, height} = Dimensions.get('window')
        const {post, user} = this.props
        const {animation} = this.state
        return (
            <Animated.View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    width,
                    height: width,
                    transform: [
                        {
                            translateX: animation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-width, 0],
                            })
                        },
                    ],

                    opacity: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                    }),
                }}
            >
                {this.props.removing ?
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator animating size="large"/>
                    </View>
                    :
                    <View style={{flex: 1}}>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                }}
                            >
                                <View
                                    style={{width: '100%', flexDirection: 'row'}}
                                >
                                    {post.user_id === user.id || user.deletePost ?
                                        <View
                                            style={{
                                                flex: 1,
                                            }}
                                        >
                                            <Button
                                                height={40}
                                                width="100%"
                                                title="Delete"
                                                color="#ff3333"
                                                onPress={this._remove.bind(this)}/>
                                        </View>
                                        : null}
                                    <View
                                        style={{
                                            flex: 1,
                                        }}
                                    >
                                        <Button
                                            height={40}
                                            width="100%"
                                            title="Report"
                                            onPress={() => this.setState({report: true})}
                                        />
                                        <Report
                                            visible={this.state.report}
                                            close={() => this.setState({report: false})}
                                            post={post}
                                        />
                                    </View>
                                </View>
                                {post.user_id === user.id ?
                                    <View
                                        style={{
                                            width: '100%',
                                            flexDirection: 'row',
                                        }}
                                    >
                                        <View
                                            style={{
                                                marginHorizontal: 10,
                                                backgroundColor: '#fff',
                                                borderRadius: 10,
                                                height: 40,
                                                paddingHorizontal: 10,
                                                flex: 1,
                                            }}
                                        >
                                            <TextInput
                                                onChangeText={(text) => this.setState({caption: text})}
                                                value={this.state.caption}
                                                style={{
                                                    height: 40,
                                                }}
                                                placeholder="Caption"
                                            />
                                        </View>
                                        <Button height={40} margin={0} width={120} title="Save"
                                                onPress={this.props.updateCaption.bind(this, this.state.caption)}/>
                                    </View>
                                    : null}
                                <View
                                    style={{
                                        width: '100%',
                                        marginVertical: 5,
                                    }}
                                >
                                    <View
                                        style={{
                                            backgroundColor: '#fff',
                                            marginHorizontal: 10,
                                            borderRadius: 10,
                                            padding: 10,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Post Data
                                        </Text>
                                        <View
                                            style={{
                                                marginLeft: 10,
                                            }}
                                        >
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                }}
                                            >
                                                <View style={{flex: 1}}>
                                                    <NerdData title="Post ID" data={post.id}/>
                                                    <NerdData title="Poster ID" data={post.user_id}/>
                                                    <NerdData title="Caption"
                                                              data={post.caption !== "" ? "True" : "False"}/>
                                                </View>
                                                <View style={{flex: 1}}>
                                                    <NerdData title="Likes" data={post.likes.length}/>
                                                    <NerdData title="Comments" data={post.comments.length}/>
                                                    <NerdData title="Photo Count" data={post.photos.length}/>
                                                </View>
                                            </View>
                                            <NerdData title="Upload Time" data={post.upload_time}/>
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}
                            >

                            </View>

                        </View>
                        {post.user_id === user.id || user.deletePost ?
                            <View
                                style={{
                                    height: PHOTO_SIZE,
                                    marginBottom: 10,
                                    marginHorizontal: 10,

                                }}
                            >
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                        }}
                                    >
                                        {post.photos.map(photo =>
                                            <TouchableOpacity
                                                key={photo.filename}
                                                style={{
                                                    borderRadius: 15,
                                                    overflow: 'hidden',
                                                    marginRight: 5,
                                                    borderWidth: 1,
                                                    borderStyle: 'solid',
                                                    borderColor: '#fff',
                                                }}
                                                //disabled={post.photos.length === 1}
                                                onPress={post.photos.length !== 1 ?
                                                    this._removePhoto.bind(this, photo.id)
                                                    :
                                                    () => Alert.alert('Error', 'You can not delete the final photo. Instead, delete the post')
                                                }
                                            >
                                                <Image
                                                    style={{width: PHOTO_SIZE, height: PHOTO_SIZE, borderRadius: 15,}}
                                                    source={{uri: `https://gbands.danielabdelsamed.com/img/thumb_${photo.filename}.jpg`}}
                                                />
                                                {post.photos.length !== 1 ?
                                                    <View
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: PHOTO_SIZE,
                                                            height: PHOTO_SIZE,
                                                            backgroundColor: 'rgba(255,255,255,0.4)',
                                                        }}
                                                    >
                                                        <Bar
                                                            size={PHOTO_SIZE - 30}
                                                            width={PHOTO_SIZE}
                                                            height={PHOTO_SIZE}
                                                            rotate={45}
                                                        />
                                                        <Bar
                                                            size={PHOTO_SIZE - 30}
                                                            width={PHOTO_SIZE}
                                                            height={PHOTO_SIZE}
                                                            rotate={-45}
                                                        />
                                                    </View>
                                                    : null}

                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </ScrollView>
                            </View>
                            : null}
                    </View>
                }
            </Animated.View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        updateCaption: (caption) => dispatch(updateCaption(props.post.id, caption)),
        remove: () => dispatch(remove(props.post.id)),
        removePhoto: (id) => dispatch(removePhoto(props.post.id, id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorOverlay)

const Bar = ({size, width, height, rotate = 0}) =>
    <View
        style={{
            position: 'absolute',
            top: (height - size) / 2,
            left: (width - 6) / 2,
            width: 6,
            height: size,
            borderRadius: 3,
            backgroundColor: '#333',
            transform: [{
                rotate: rotate + 'deg',
            }],
        }}
    >

    </View>

const Button = ({width, height = 50, color = "#333", style, title, margin = 10, onPress}) =>
    <View
        style={{
            width,
        }}
    >
        <TouchableOpacity
            style={[{
                borderRadius: 10,
                height,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: margin,
                marginHorizontal: 10,
            }, style]}
            onPress={onPress}
        >
            <Text style={{color}}>{title}</Text>
        </TouchableOpacity>
    </View>

const NerdData = ({title, data}) =>
    <Text
        style={{
            fontWeight: 'bold',
        }}
    >
        {title}: {data}
    </Text>