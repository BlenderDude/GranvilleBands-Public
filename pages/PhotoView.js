import React, {Component} from 'react'
import {View, Text, FlatList, Animated, TouchableOpacity, Dimensions, Platform} from 'react-native'
import {refresh, loadMore} from "../actions/posts"
import {connect} from 'react-redux'
import AnimatedPhoto from "../components/AnimatedPhoto";
import ReactNativeHaptic from 'react-native-haptic'


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class PhotoView extends Component {
    static navigationOptions = {
        title: "Photo View",
        headerBackTitle: null,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
    };

    currentIndex = 0
    photosPerRow = 2

    state = {
        scrollPosition: new Animated.Value(0),
        height: new Animated.Value(Dimensions.get('window').width / this.photosPerRow),
        data: []

    }

    constructor(props) {
        super(props)
        this._calculateData.bind(this)
    }

    componentWillMount() {
        this._calculateData()
    }

    componentWillReceiveProps() {
        this._calculateData()
    }

    _calculateData() {
        let photos = []
        const posts = this.props.postsData.postStream.map((postID) => this.props.postsData.posts[postID])
        posts.forEach((post) => {
            post.photos.forEach((photo) => {
                photos.push({...photo, post_id: post.id})
            })
        })
        this.setState({data: photos})
    }

    currentRow = 0

    _onScroll(e) {
        const {layoutMeasurement, contentOffset, contentSize} = e.nativeEvent
        const paddingToBottom = 100
        if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
            this.props.loadMore()
        }
        if (this.currentRow !== Math.floor(contentOffset.y / (Dimensions.get('window').width / 2))) {
            if (Platform.OS === "ios") {
                ReactNativeHaptic.generate('impact')
            }
            this.currentRow = Math.floor(contentOffset.y / (Dimensions.get('window').width / 2))
        }

    }


    render() {
        let animation = Animated.divide(this.state.scrollPosition, this.state.height)
        return (
            <Animated.ScrollView
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollPosition}}}],
                    {useNativeDriver: true, listener: this._onScroll.bind(this)})}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        width: Dimensions.get('window').width,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                >
                    {this.state.data.map((item, index) => {
                        return (
                            <AnimatedPhoto
                                key={item.id}
                                preload={item.preload}
                                filename={item.filename}
                                index={index}
                                postid={item.post_id}
                                animation={animation}
                                animate={true}
                                photosPerRow={this.photosPerRow}
                                //scrollPosition={this.state.scrollPosition}
                            />
                        )
                    })}
                </View>
            </Animated.ScrollView>
        )
        return (
            <AnimatedFlatList
                data={this.state.data}
                keyExtractor={(photo) => photo.id}
                numColumns={this.photosPerRow}
                style={{flex: 1}}
                scrollEnabled={this.state.scrollEnabled}
                refreshing={this.props.postsData.refreshing}
                onRefresh={this.props.refresh}
                extraData={this.props.postsData.refreshing}

                //ref={(component)=>this.props.registerScroll(component)}

                onEndReachedThreshold={10}
                onEndReached={this.props.loadMore}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollPosition}}}],
                    {useNativeDriver: true})}
                // onScroll={(e) => {
                //     const newIndex = Math.floor(e.nativeEvent.contentOffset.y / (Dimensions.get('window').width / 3))
                //     if(newIndex !== this.currentIndex && Platform.OS === 'ios'){
                //         ReactNativeHaptic.generate('impact')
                //     }
                // }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                renderItem={({item, index}) => {
                    return (
                        <AnimatedPhoto
                            preload={item.preload}
                            filename={item.filename}
                            index={index}
                            postid={item.post_id}
                            animation={animation}
                            animate={true}
                            photosPerRow={this.photosPerRow}
                            //scrollPosition={this.state.scrollPosition}
                        />
                    )
                }}
            />
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
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoView)