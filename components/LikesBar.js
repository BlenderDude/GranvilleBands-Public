import React, {Component} from 'react'
import {
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
    StyleSheet,
    ScrollView,
    Text,
    Animated,
    Dimensions,
    Platform,
} from 'react-native'
import ProfilePhoto from "./ProfilePhoto";
import ReactNativeHaptic from 'react-native-haptic'
import AnimatedProfilePhoto from "./AnimatedProfilePhoto";
import Router from '../router/service'

const PREVIEW_LIKES = 4

const SMALL_SIZE = 30
const LARGE_SIZE = Dimensions.get('window').width / 4 - 10
const INVERT_MARGIN = -SMALL_SIZE / 2
const SMALL_SCROLL_WIDTH = likes => likes.filter((_, i) => i < PREVIEW_LIKES).length * SMALL_SIZE / 2 + SMALL_SIZE + 10

export default class LikesBar extends Component {
    state = {
        width: new Animated.Value(SMALL_SCROLL_WIDTH(this.props.likes)),
        marginRight: new Animated.Value(INVERT_MARGIN),
        size: new Animated.Value(30),
        likesOpen: false,
    }

    componentWillMount() {
        this._openLikes.bind(this)
        this._closeLikes.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.likes.length !== this.props.likes.length) {
            Animated.parallel([
                Animated.timing(this.state.marginRight, {
                    toValue: INVERT_MARGIN,
                    duration: 0,
                }),
                Animated.timing(this.state.size, {
                    toValue: SMALL_SIZE,
                    duration: 0,
                }),
                Animated.timing(this.state.width, {
                    toValue: SMALL_SCROLL_WIDTH(nextProps.likes),
                    duration: 0,
                })
            ]).start()
        }
    }

    _openLikes() {
        if (this.props.likes.length !== 0) {
            if (Platform.OS === 'ios') {
                ReactNativeHaptic.generate('impact')
            }
            clearTimeout(this.scrollTimeout)
            this.scrollTimeout = setTimeout(this._closeLikes.bind(this), 3000)
            this.setState({
                likesOpen: true,
            })
            Animated.parallel([
                Animated.timing(this.state.width, {
                    toValue: Dimensions.get('window').width,
                    duration: 500,
                }),
                Animated.timing(this.state.marginRight, {
                    toValue: 5,
                    duration: 500,
                }),
                Animated.timing(this.state.size, {
                    toValue: LARGE_SIZE,
                    duration: 500,
                })
            ]).start()
        }
    }

    _closeLikes() {

        //this.refs["likes"].scrollTo({x:0,animated:true})
        //setTimeout(()=>{
        this.setState({
            likesOpen: false,
        })
        Animated.parallel([
            Animated.timing(this.state.width, {
                toValue: SMALL_SCROLL_WIDTH(this.props.likes),
                duration: 500,
            }),
            Animated.timing(this.state.marginRight, {
                toValue: INVERT_MARGIN,
                duration: 500,
            }),
            Animated.timing(this.state.size, {
                toValue: SMALL_SIZE,
                duration: 500,
            })
        ]).start()
        //},250)


    }

    item = 0

    _onScroll(e) {
        const itemWidth = LARGE_SIZE + 10
        const width = e.nativeEvent.contentOffset.x
        const currentItem = Math.floor(width / itemWidth)
        if (currentItem !== this.item && currentItem >= 0 && currentItem < this.props.likes.length && Platform.OS === 'ios' && this.state.likesOpen) {
            this.item = currentItem
            //ReactNativeHaptic.generate('selection')
        }

        clearTimeout(this.scrollTimeout)
        this.scrollTimeout = setTimeout(this._closeLikes.bind(this), 1500)
    }

    render() {
        const {likes} = this.props
        return (
            <Animated.View
                style={{
                    width: this.state.width,
                }}
            >
                <TouchableWithoutFeedback
                    onPressIn={this._openLikes.bind(this)}
                    disabled={this.state.likesOpen}
                >
                    <View>
                        <ScrollView
                            style={{
                                width: Dimensions.get('window').width,
                                backgroundColor: "#fff"
                            }}
                            ref="likes"
                            horizontal={true}
                            onScroll={this._onScroll.bind(this)}
                            scrollEventThrottle={16}
                            scrollEnabled={this.state.likesOpen}
                            contentContainerStyle={{
                                flexDirection: 'row',
                            }}
                        >
                            {likes.filter((_, i) => i < PREVIEW_LIKES).map(like =>
                                <LikeItem
                                    key={like.id}
                                    open={this.state.likesOpen}
                                    like={like}
                                    size={this.state.size}
                                    marginRight={this.state.marginRight}
                                />
                            )}
                            {this.state.likesOpen ?
                                likes.filter((_, i) => i >= PREVIEW_LIKES).map(like =>
                                    <LikeItem
                                        key={like.id}
                                        open={this.state.likesOpen}
                                        like={like}
                                        size={this.state.size}
                                        marginRight={this.state.marginRight}/>)
                                : <Animated.View
                                    style={{
                                        width: this.state.size,
                                        height: this.state.size,
                                        backgroundColor: '#fff',
                                        borderColor: "#333",
                                        borderWidth: StyleSheet.hairlineWidth,
                                        borderRadius: this.state.size.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.5]
                                        }),
                                        justifyContent: 'center',
                                        alignContent: 'center',
                                        overflow: 'hidden',
                                        padding: this.state.size.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 0.25]
                                        }),
                                    }}
                                >
                                    <Animated.Text
                                        style={{
                                            fontSize: this.state.size.interpolate({
                                                inputRange: [30, 80],
                                                outputRange: [likes.length > 9 ? 12 : 20, likes.length > 9 ? 24 : 40]
                                            }),
                                            textAlign: 'center',
                                            borderRadius: this.state.size.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 0.5]
                                            }),
                                        }}
                                    >
                                        {likes.length}
                                    </Animated.Text>
                                </Animated.View>}
                        </ScrollView>
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        )
    }
}

const LikeItem = (props) => {
    const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
    return (
        <AnimatedTouchableOpacity
            style={{
                width: props.size,
                marginLeft: props.open ? 5 : 0,
                marginRight: props.marginRight,
            }}
            disabled={!props.open}
            onPress={Router.navigate.bind(this, 'User', {
                user: {
                    ...props.like,
                    id: props.like.user_id
                }
            })}>
            <AnimatedProfilePhoto user={props.like} size={props.size}/>
            <Animated.View
                style={{
                    height: props.size.interpolate({
                        inputRange: [SMALL_SIZE, LARGE_SIZE],
                        outputRange: [0, 40],
                    }),
                    width: props.size.interpolate({
                        inputRange: [SMALL_SIZE, LARGE_SIZE],
                        outputRange: [0, LARGE_SIZE],
                    })
                }}

            >
                <Text style={{textAlign: 'center', fontSize: 10,}}>{props.like.first_name}</Text>
                <Text style={{textAlign: 'center', fontSize: 10,}}>{props.like.last_name}</Text>
            </Animated.View>
        </AnimatedTouchableOpacity>
    )
}