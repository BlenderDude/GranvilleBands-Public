import React, {Component} from 'react'
import {Animated, View, Text, TouchableOpacity, Dimensions} from 'react-native'
import ProgressiveImage from './ProgressiveImage'
import NavigatorService from '../router/service'

export default class AnimatedPhoto extends Component {
    componentWillMount() {
        this.totalRows = Math.ceil((Dimensions.get('window').height) / (Dimensions.get('window').width / this.props.photosPerRow));
        this.animationOffset = 2
        this.row = ((this.props.index - (this.props.index % this.props.photosPerRow)) / this.props.photosPerRow) - this.totalRows
    }

    _navigate() {
        NavigatorService.navigate("Post", {id: this.props.postid})
    }

    render() {
        let transform = []
        if (this.props.animate) {
            //let close = Animated.divide(this.props.scrollPosition, new Animated.Value(row*(HEIGHT)))
            let close = Animated.add(this.props.animation, new Animated.Value(-this.row))

            const topStart = this.totalRows - 0
            const topEnd = this.totalRows + 1

            const bottomStart = this.animationOffset - 1
            const bottomEnd = this.animationOffset


            if (this.props.index % this.props.photosPerRow === 0) {
                transform = [
                    {
                        translateX: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: [-100, 0, 0]
                        })
                    }, {
                        translateY: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: [40, 0, 0]
                        }),
                    }, {
                        rotate: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: ['20deg', '0deg', '0deg']
                        })
                    }
                ]
            } else if (this.props.photosPerRow % 2 === 1) {
                transform = [{
                    translateY: close.interpolate({
                        inputRange: [bottomStart, bottomEnd, topStart],
                        outputRange: [100, 0, 0]
                    })
                }]
            } else {
                transform = [
                    {
                        translateX: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: [100, 0, 0]
                        })
                    }, {
                        translateY: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: [40, 0, 0]
                        }),
                    }, {
                        rotate: close.interpolate({
                            inputRange: [bottomStart, bottomEnd, topStart],
                            outputRange: ['-20deg', '0deg', '0deg']
                        })
                    }
                ]
            }
        }

        return (
            <Animated.View
                style={{
                    transform,
                    //width: Dimensions.get('window').width / this.props.photosPerRow,
                }}
            >
                <ProgressiveImage
                    onPress={this._navigate.bind(this)}
                    width={Dimensions.get('window').width / this.props.photosPerRow}
                    height={Dimensions.get('window').width / this.props.photosPerRow}
                    preload={this.props.preload}
                    filename={this.props.filename}
                    zoomable={false}
                    //source={{uri: "https://gbands.danielabdelsamed.com/img/thumb_" + this.props.filename + ".jpg"}}
                />
            </Animated.View>
        )
    }
}