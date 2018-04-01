import React, {Component} from 'react'
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import searchIcon from '../img/search_passive.png'
import SearchModal from "./SearchModal";

export default class Search extends Component {
    state={
        searchOpen: false,
    }
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>this.setState({searchOpen:true})}
                    style={{marginRight:5}}
                >
                    <Image
                        style={{
                            width: 30,
                            height: 30,
                            margin: 5,
                        }}
                        resizeMode="contain"
                        source={searchIcon}
                    />
                </TouchableOpacity>
                <SearchModal
                    visible={this.state.searchOpen}
                    close={()=>this.setState({searchOpen:false})}
                />
            </View>
        )
    }
}