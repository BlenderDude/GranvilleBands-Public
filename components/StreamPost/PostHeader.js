import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import NavigatorService from '../../router/service'
import Moment from 'moment'
import ProfilePhoto from "../ProfilePhoto";
import HamburgerButton from "../HamburgerButton";


class PostHeader extends Component {
    shouldComponentUpdate(nextProps) {
        const firstNameChanged = nextProps.user.first_name === this.props.user.first_name
        const lastNameChanged = nextProps.user.last_name === this.props.user.last_name
        return true;
    }

    render() {
        const {user, time} = this.props

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginLeft: 10,
                    marginRight: 0,
                    marginVertical: 2,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        NavigatorService.navigate("User", {user: {...user, id: user.user_id}})
                    }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <ProfilePhoto user={user}/>
                    <Text
                        style={{
                            fontWeight: 'bold',
                            fontSize: 14,
                            marginLeft: 4,
                        }}
                    >
                        {user.first_name + ' ' + user.last_name}
                    </Text>
                </TouchableOpacity>
                <View style={{flex: 1}}/>
                <HamburgerButton onPress={this.props.openEditor}/>
            </View>
        )
    }
}

export default PostHeader