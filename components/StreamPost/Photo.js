import React, {Component} from 'react'
import {
    View,
    Image,
    Dimensions, ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Text, Platform,
    CameraRoll,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'
import ProgressiveImage from "../ProgressiveImage";
import DoublePress from "../DoublePress";

class Photo extends Component {
    state = {
        scaleFactor: 1,
        downloading: false,
        saved: false,
    }

    _saveImage() {
        ReactNativeHaptic.generate('impact')
        this.setState({
            downloading: true,
            saved: false,
            error: false,
        })
        CameraRoll.saveToCameraRoll(`https://gbands.danielabdelsamed.com/img/${this.props.photo.filename}.jpg`, "photo")
            .then(() => {
                ReactNativeHaptic.generate('notification')
                this.setState({downloading: false, saved: true, error: false})
            })
            .catch(() => {
                setTimeout(()=>ReactNativeHaptic.generate('impact'),0)
                setTimeout(()=>ReactNativeHaptic.generate('impact'),100)
                setTimeout(()=>ReactNativeHaptic.generate('impact'),200)
                this.setState({saved: false, downloading: false, error: true})
            })

    }

    render() {
        const {photo} = this.props
        return (
            <View
                style={{flex: 1}}
            >
                <ScrollView
                    minimumZoomScale={1}
                    maximumZoomScale={3}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    onScroll={(e) => {
                        this.setState({scaleFactor: e.nativeEvent.zoomScale})
                    }}
                    onScaleChange={(e) => {
                        this.setState({scaleFactor: e.nativeEvent.scaleFactor})
                    }}
                    scrollEventThrottle={100}
                    scrollEnabled={this.state.scaleFactor !== 1}
                >
                    <DoublePress key={photo.filename} onDoublePress={this.props.like}>
                        <ProgressiveImage
                            width={Dimensions.get('window').width}
                            height={Dimensions.get('window').width}
                            filename={photo.filename}
                        />
                    </DoublePress>
                </ScrollView>
                {Platform.OS === 'ios' ?
                    <TouchableOpacity
                        disabled={this.state.downloading}
                        style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            borderColor: '#333',
                            borderStyle: 'solid',
                            borderWidth: 1,
                            borderRadius: 5,
                            padding: 3,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 25,
                        }}
                        onPress={this._saveImage.bind(this)}
                    >

                        {!this.state.downloading && !this.state.saved && !this.state.error ?
                            <Text style={{color: '#eee'}}>Save</Text>
                            : null}
                        {this.state.downloading ?
                            <Text style={{color: '#eee'}}>Downloading</Text>
                            : null}
                        {this.state.downloading ?
                            <ActivityIndicator color="#eee" style={{marginLeft: 5,height:25,width:25,}}/>
                            : null}
                        {this.state.saved ?
                            <Text style={{color: '#eee'}}>Saved</Text>
                            : null}
                        {this.state.error ?
                            <Text style={{color: '#eee'}}>Error, tap to retry</Text>
                            : null}

                    </TouchableOpacity>
                    : null}

            </View>
        )
    }
}

export default Photo