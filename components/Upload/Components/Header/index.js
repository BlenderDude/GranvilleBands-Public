import React, {Component} from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'

export default class Header extends Component {
    closeModalAndRefresh() {
        this.props.refresh()
        this.props.closeModal()
    }

    render() {
        let total = 0
        this.props.uploads.forEach((upload) => total += upload.complete)
        const percentDone = total / this.props.uploads.length

        let uploadsComplete = true
        this.props.uploads.forEach((upload) => {
            if (!upload.done) {
                uploadsComplete = false
            }
        })


        return (
            <View
                style={{
                    height: 45,
                    backgroundColor: "#fcfcfc",
                    borderBottomColor: "#ccc",
                    borderBottomWidth: 1,
                    zIndex: 9999,
                    width: "100%",
                    flexDirection: 'row',
                }}
            >
                <TouchableOpacity
                    style={{
                        height: 45,
                        width: 100,
                        paddingLeft: 15,
                        justifyContent: 'center',
                    }}
                    onPress={this.props.closeModal}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            height: 24,
                            color: '#000',
                        }}
                    >
                        {this.props.uploading && uploadsComplete || !this.props.uploading ? "Close" : ""}
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        flex: 1,
                        height: 45,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            height: 24,
                            color: '#000',
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}
                    >
                        {this.props.uploading && !uploadsComplete ? `Uploading ${Math.floor(percentDone * 10000) / 100}%` : null}
                        {this.props.uploading && uploadsComplete ? `Upload Complete` : null}
                        {!this.props.uploading && !uploadsComplete ? ("Upload" + (this.props.numPhotos > 0 ? ` (${this.props.numPhotos}/10)` : '')) : null}

                    </Text>
                </View>
                {this.props.numPhotos > 0 ?
                    <View>
                        {!this.props.uploading ?

                            <TouchableOpacity
                                style={{
                                    height: 45,
                                    width: 100,
                                    paddingRight: 15,
                                    justifyContent: 'center',
                                }}
                                onPress={this.props.toUploadScreen}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        height: 24,
                                        color: '#000',
                                        textAlign: 'right',
                                    }}
                                >
                                    {!this.props.uploading ? "Post" : null}

                                </Text>
                            </TouchableOpacity>

                            : null}
                        {uploadsComplete ?

                            <TouchableOpacity
                                style={{
                                    height: 45,
                                    width: 100,
                                    paddingRight: 15,
                                    justifyContent: 'center',
                                }}
                                onPress={this.closeModalAndRefresh.bind(this)}
                            >
                                <Text
                                    style={{
                                        fontSize: 18,
                                        height: 24,
                                        color: '#000',
                                        textAlign: 'right',
                                    }}
                                >
                                    Done

                                </Text>
                            </TouchableOpacity>

                            : null}
                        {this.props.uploading && !uploadsComplete ?
                            <View style={{height: 45, width: 100, paddingRight: 15,}}/>
                            : null}
                    </View>


                    : <View style={{height: 45, width: 100, paddingRight: 15,}}/>}


            </View>
        )
    }
}