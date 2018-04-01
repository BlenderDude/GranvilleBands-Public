import React, {Component} from 'react'
import {
    View,
    Text,
} from 'react-native'
import NavigatorService from '../../router/service'

export default class Comment extends Component {
    render() {
        const {first_name, last_name} = this.props.user
        const {text, user} = this.props
        return (
            <View
                style={{
                    marginBottom: 2,
                    marginHorizontal: 10,
                    ...(this.props.style || {}),
                }}
            >
                <Text>
                    <Text
                        style={{
                            fontWeight: 'bold',
                        }}
                        onPress={() => {
                            NavigatorService.navigate("User", {user: {...user, id: user.user_id}})
                        }}
                    >
                        {first_name + ' ' + last_name + ' '}
                    </Text>
                    <Text>{text}</Text>
                </Text>
            </View>
        )
    }
}