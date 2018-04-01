import React, {Component} from 'react'
import {
    View,
    SectionList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native'
import NavigatorService from '../router/service'
import Moment from 'moment'
import API from '../API'
import ProfilePhoto from "./ProfilePhoto";
import ProgressiveImage from "./ProgressiveImage";

export default class LeaderboardPage extends Component {
    state = {
        refreshing: false,
        data: {},
    }

    componentWillMount() {
        this._refresh.bind(this)
        this._refresh()
    }

    _refresh() {
        this.setState({refreshing: true})
        API.posts.leaderboard()
            .then(data => {
                this.setState({data, refreshing: false})
            })
            .catch(error => {
                this.setState({refreshing: false})
            })
    }

    render() {
        let sections = []
        return (
            <SectionList
                style={{flex: 1}}
                sections={(Object.keys(this.state.data)).map(key => ({
                    data: this.state.data[key],
                    title: Moment(key, "YYYY-MM-DD").format("dddd")
                }))}
                initialNumToRender={250}
                renderSectionHeader={({section}) =>
                    <View
                        style={{
                            borderColor: "#000",
                            borderStyle: "solid",
                            borderBottomWidth: 1,
                            backgroundColor: "#bed5ff"
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 18,
                                fontWeight: 'bold',
                                color: '#333',
                                marginVertical: 5,
                            }}
                        >{section.title}</Text>
                    </View>
                }
                keyExtractor={(item) => item.id}
                refreshing={this.state.refreshing}
                onRefresh={this._refresh.bind(this)}
                renderItem={({item, index}) => <LeaderboardItem post={item} index={index}/>}
            />
        )
    }
}

const LeaderboardItem = ({post, index}) => {
    let likesSize = 20
    if (post.likes > 9) {
        likesSize = 18
    }
    if (post.likes > 99) {
        likesSize = 14
    }
    let backgroundColor = "#fff"
    if (index === 0) {
        backgroundColor = "#fffad7"
    }
    if (index === 1) {
        backgroundColor = "#e4e4e4"
    }
    if (index === 2) {
        backgroundColor = "#f4d4c4"
    }
    return (
        <TouchableOpacity
            style={{
                flexDirection: 'row',
                padding: 5,
                alignItems: 'center',
                backgroundColor,
                borderColor: "#333",
                borderStyle: "solid",
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}
            onPress={() => NavigatorService.navigate("Post", {id: post.id})}
        >
            <View
                style={{
                    width: 30,
                    height: 30,
                    backgroundColor: '#fff',
                    borderColor: "#333",
                    borderWidth: 1,
                    borderRadius: 30 / 2,
                    justifyContent: 'center',
                    alignContent: 'center',
                    overflow: 'hidden',
                    marginRight: 5,
                }}
            >
                <Text
                    style={{
                        fontSize: likesSize,
                        textAlign: 'center',
                        borderRadius: 30 / 2,
                    }}
                >
                    {post.likes}
                </Text>
            </View>
            <TouchableOpacity style={{flexDirection: 'row',alignItems:'center'}} onPress={()=>NavigatorService.navigate("User",{
                user: {
                    id: post.user_id,
                    first_name: post.first_name,
                    last_name: post.last_name,
                }
            })}>
                <ProfilePhoto user={post}/>
                <Text style={{marginLeft: 5, fontWeight: 'bold'}}>{post.first_name} {post.last_name}</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}/>
            <View
                style={{
                    borderColor: "#ccc",
                    borderWidth: StyleSheet.hairlineWidth,
                    borderStyle: 'solid',
                }}
            >
                <ProgressiveImage width={30} height={30} filename={post.filename}/>
            </View>
        </TouchableOpacity>
    )
}