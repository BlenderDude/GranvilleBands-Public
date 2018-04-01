import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Platform,
    StatusBar,
    Button,
} from 'react-native';
import Logo from '../img/logo.png';

export default class ErrorLoading extends Component {
    render() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {Platform.OS === "android" ?
                        null
                        :
                        <StatusBar
                            barStyle="dark-content"
                            translucent={true}
                            hidden={false}
                            animated={true}
                        />
                    }
                    <Image source={Logo} style={{
                        width: 100,
                        height: 100,
                        borderColor: "#dfdfdf",
                        borderWidth: 1,
                        borderRadius: 50,
                    }}/>

                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                        }}
                    >Network Error</Text>
                    <Button title="Refresh" onPress={this.props.auth}/>
                </View>
            </View>
        )
    }
}