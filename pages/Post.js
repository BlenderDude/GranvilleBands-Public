import React, {Component} from 'react';
import {RefreshControl, ScrollView} from 'react-native'
import StreamPost from "../components/StreamPost/StreamPost";
import {connect} from "react-redux";

import {loadSingle} from "../actions/posts"

class Post extends Component {
    static navigationOptions = {
        title: "Post",
        headerBackTitle: null,
        headerTintColor: "#000",
        headerStyle: {
            backgroundColor: "#fcfcfc",
            borderBottomWidth: 1,
            borderBottomColor: "#ccc",
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            scroll: true,
        }
        this.props.loadSingle(this.props.navigation.state.params.id)
    }

    _refresh() {
        this.props.loadSingle(this.props.navigation.state.params.id)
    }

    _scrollState(scroll) {
        this.setState({scroll})
    }

    render() {
        const {id} = this.props.navigation.state.params;
        return (
            <ScrollView
                scrollEnabled={this.state.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={this.props.loading}
                        onRefresh={this._refresh.bind(this)}
                    />
                }
            >
                {this.props.post ?
                    <StreamPost
                        id={id}
                        scrollState={this._scrollState.bind(this)}
                    />
                    : null}
            </ScrollView>
        )

    }
}

mapStateToProps = (state, props) => {
    return {
        loading: state.posts.loading,
        post: state.posts.posts[props.navigation.state.params.id] || false,
    }
}

mapDispatchToProps = (dispatch) => {
    return {
        loadSingle: (id) => dispatch(loadSingle(id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Post)