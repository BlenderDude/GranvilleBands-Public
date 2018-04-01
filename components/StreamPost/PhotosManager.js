import React, {Component} from 'react'
import {
    View,
    ScrollView,
    Dimensions,
} from 'react-native'
import ReactNativeHaptic from 'react-native-haptic'
import Photo from "./Photo";
import PhotoPreview from "./PhotoPreview";
import PanController from './PanController'
import DoublePress from '../DoublePress'
import ProgressiveImage from "../ProgressiveImage";

const PREVIEW_SIZE = 30

class PhotosManager extends Component {
    state = {
        photo: 0,
    }


    _changePhotoIndex(i) {
        this.setState({
            photo: i,
        })
    }

    _calcPhoto(loc) {
        const {x} = loc

        if (x <= 0 || x >= PREVIEW_SIZE * this.props.photos.length) {
            return;
        }

        const photoIndex = Math.floor(x / PREVIEW_SIZE)


        this._changePhotoIndex.bind(this)
        this._changePhotoIndex(photoIndex)
        if (this.state.photo !== photoIndex) {
            ReactNativeHaptic.generate('impact')
        }
    }

    _panStart(loc) {
        this.props.scrollState(false)
        this._calcPhoto.bind(this)
        this._calcPhoto(loc)
    }

    _panMove(loc) {
        this._calcPhoto.bind(this)
        this._calcPhoto(loc)
    }

    _panEnd(loc) {
        this.props.scrollState(true)
    }

    render() {
        const {photos} = this.props
        return (
            <View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    style={{
                        flexDirection: 'row'
                    }}
                    contentOffset={{x: Dimensions.get('window').width * this.state.photo}}
                    scrollEnabled={photos.length > 1}
                    ref="photoScroll"
                >
                    {photos.map((photo) =>
                        <Photo
                            key={photo.filename}
                            photo={photo}
                            like={this.props.like}/>
                    )}
                </ScrollView>
                {photos.length > 1 ?
                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 30,
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <PanController
                            style={{
                                flexDirection: 'row',
                            }}
                            onPanStart={this._panStart.bind(this)}
                            onPanMove={this._panMove.bind(this)}
                            onPanEnd={this._panEnd.bind(this)}
                        >
                            {photos.map((photo, i) =>
                                <PhotoPreview
                                    key={photo.filename}
                                    index={i}
                                    activePhoto={this.state.photo}
                                    filename={photo.filename} size={PREVIEW_SIZE}
                                />
                            )}
                        </PanController>
                    </View>
                    : null}
            </View>
        )
    }
}

export default PhotosManager