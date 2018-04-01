import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
} from 'react-native'

export default class CommentIcon extends Component {
    render() {
        const {size, onPress} = this.props
        return (
            <TouchableOpacity
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: '#333',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onPress={onPress}
            >
                <Bar size={size}/>
                <Bar size={size}/>
                <Bar size={size}/>

            </TouchableOpacity>
        )
    }
}

const Bar = ({size}) =>
    <View style={{
        marginVertical: 1,
        height: 2,
        width: size / 2.5,
        backgroundColor: '#333',
        borderRadius: 2,
    }}/>