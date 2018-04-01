import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
    Button, ActivityIndicator,
    TextInput,
} from 'react-native'
import {connect} from 'react-redux'
import {auth} from '../../actions/user'
import {refresh} from '../../actions/posts'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'

import Header from "./Components/Header";
import AddedPhotos from "./Components/AddedPhotos"
import Caption from "./Components/Caption";
import AddedPhoto from "./Components/AddedPhoto/index";
import AddPhoto from "./Components/AddPhoto";
import UploadItem from './Components/Upload';

class Upload extends Component {
    state = {
        photos: [],
        uploading: false,
        uploadDone: false,
        uploads: [],
        height: 45,
        caption: '',
    }

    constructor(props) {
        super(props)
        this.addPhoto.bind(this)
    }

    addPhoto(uri) {
        if (this.state.photos.indexOf(uri) === -1) {
            this.setState({
                photos: this.state.photos.concat([uri])
            })
        } else {
            Alert.alert("Same photo can not be added twice");
        }
    }

    pickPhoto() {
        const photoOptions = {
            title: 'Select Photo',
            mediaType: 'photo',
        }

        ImagePicker.launchImageLibrary(photoOptions, (res) => {
            if (res.error) {
            }
            if (!res.didCancel && !res.error && !res.customButton) {
                this.addPhoto.bind(this)
                this.addPhoto("file://" + res.path)
            }
        })
    }

    toUploadScreen() {
        const uploads = this.state.photos.map((photo) => {
            return {
                uri: photo,
                done: false,
                complete: 0,
            }
        })
        this.setState({uploads, uploading: true,}, () => {
            this._uploadPost.bind(this)
            this._uploadPost()
        })
    }

    render() {
        if (!this.props.appUser.approved) {
            return (
                <View style={{flex: 1}}>
                    <Header
                        closeModal={this.props.closeModal}
                    />
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text>Your account is not approved</Text>
                        <Text>Please wait until an admin approves you</Text>
                        <Button title="Refresh"
                                onPress={this.props.auth.bind(this, this.props.appUser.id, this.props.appUser.token)}/>
                        <ActivityIndicator animating={this.props.appUser.loading}/>
                    </View>

                </View>
            )
        }
        return (
            <View style={{flex: 1}}>
                <Header
                    closeModal={this.props.closeModal}
                    refresh={this.props.refresh.bind(this)}
                    numPhotos={this.state.photos.length}
                    toUploadScreen={this.toUploadScreen.bind(this)}
                    uploading={this.state.uploading}
                    uploadDone={this.state.uploadDone}
                    uploads={this.state.uploads}
                />
                {this.state.uploading ?
                    <View>
                        {this.state.uploads.map(
                            (upload) => <UploadItem key={upload.uri} uri={upload.uri} done={upload.done}
                                                    complete={upload.complete}/>
                        )}
                    </View>
                    :
                    <View>
                        <AddedPhotos>
                            {this.state.photos.length < 10 ?
                                <TouchableOpacity
                                    style={{
                                        width: 130,
                                        height: 130,
                                        marginHorizontal: 5,
                                        marginVertical: 10,
                                        borderColor: "#333",
                                        borderWidth: StyleSheet.hairlineWidth,
                                        borderRadius: 15,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onPress={this.pickPhoto.bind(this)}
                                >
                                    <Text
                                        style={{
                                            fontSize: 124,
                                            height: 100,
                                            lineHeight: 92,
                                            textAlign: 'center',
                                            color: "#333",
                                        }}
                                    >+</Text>
                                </TouchableOpacity>
                                : null}
                            {this.state.photos.map((photo, i) => <AddedPhoto key={i} uri={photo}/>)}
                        </AddedPhotos>
                        <View>
                            <TextInput
                                style={{
                                    borderBottomColor: '#ccc',
                                    borderBottomWidth: 1,
                                    fontSize: 18,
                                    //height: 150,
                                    paddingLeft: 5,
                                    paddingRight: 5,
                                    height: this.state.height,

                                }}
                                underlineColorAndroid="#fff"
                                placeholder="Caption"
                                onChange={(event) => this.setState({caption: event.nativeEvent.text.substring(0, 128)})}
                                value={this.state.caption}
                                multiline={true}
                                returnKeyType={"done"}
                                blurOnSubmit={true}
                                maxLength={128}
                                autoCapitalize="sentences"
                                autoCorrect={true}
                                onContentSizeChange={(e) => this.setState({height: e.nativeEvent.contentSize.height})}
                            />
                        </View>
                    </View>
                }

            </View>
        )
    }

    _uploadPhoto(photo, postID, i) {
        const url = 'https://gbands.danielabdelsamed.com/api/posts/uploadPhoto/' + postID;
        RNFetchBlob.fetch('POST', url, {
            id: "" + this.props.appUser.id,
            token: this.props.appUser.token,
            'Content-Type': 'multipart/form-data',
        }, [
            {
                data: RNFetchBlob.wrap(photo.uri),
                filename: 'photo.jpg',
                name: "photo",
            }
        ])
        // listen to upload progress event
            .uploadProgress((written, total) => {
                let percentComplete = written / total;

                this.setState({
                    uploads: this.state.uploads.map((upload) => {
                        if (photo.uri === upload.uri) {
                            return {
                                ...upload,
                                complete: percentComplete,
                            }
                        }
                        return upload
                    }),
                });
            })
            .progress((received, total) => {

            })
            .then((resp) => {
                const testUploads = () => {
                    let allUploaded = true;
                    this.state.uploads.forEach((upload) => {
                        if (!upload.done) {
                            allUploaded = false;
                        }
                    });
                    return allUploaded;
                }
                let uploadsComplete = testUploads();
                this.setState({
                    uploads: this.state.uploads.map((upload) => {
                        if (photo.uri === upload.uri) {
                            return {
                                ...upload,
                                done: true,
                                complete: 1,
                            }
                        }
                        return upload
                    }),
                    uploadDone: uploadsComplete,
                })
            })
            .catch((err) => {
            })
        //console.log("uploadPhoto", photo)

        // var formData = new FormData();
        // formData.append("photo", {
        //     uri: photo.uri,
        //     filename: 'photo.jpg',
        //     name: "photo",
        // });

        // var xhr = new XMLHttpRequest();
        // xhr.open('POST', url);
        // xhr.upload.onprogress = (e) => {
        //     let percentComplete = e.loaded / e.total;
        //     console.log("upload progress ", percentComplete)
        //
        //     this.setState({
        //         uploads: this.uploads.map((upload) => {
        //             if (photo.uri === upload.uri) {
        //                 return {
        //                     ...upload,
        //                     complete: percentComplete,
        //                 }
        //             }
        //             return upload
        //         }),
        //     });
        //
        // };
        // xhr.onreadystatechange = () => {
        //     console.log("state change",xhr.readyState)
        //     if (xhr.readyState === 4 && xhr.status === 200) {
        //         const testUploads = () => {
        //             let allUploaded = true;
        //             this.state.uploads.forEach((upload) => {
        //                 if (!upload.done) {
        //                     allUploaded = false;
        //                 }
        //             });
        //             return allUploaded;
        //         }
        //         let uploadsComplete = testUploads();
        //         this.setState({
        //             uploads: this.state.uploads.map((upload) => {
        //                 if (photo.uri === upload.uri) {
        //                     return {
        //                         ...upload,
        //                         done: true,
        //                         complete: 1,
        //                     }
        //                 }
        //                 return upload
        //             }),
        //             uploadDone: uploadsComplete,
        //         });
        //
        //
        //     }
        // };

        // xhr.onerror = (err)=>{
        //     console.log("error",xhr.statusText)
        // }
        //
        // xhr.setRequestHeader('Id', this.props.appUser.id);
        // xhr.setRequestHeader('Token', this.props.appUser.token);
        // xhr.send(formData);

    }

    _uploadPost() {
        const url = 'https://gbands.danielabdelsamed.com/api/posts/uploadPost';

        let formData = new FormData();
        formData.append("caption", this.state.caption);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        const {uploads} = this.state;
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {

                let res = JSON.parse(xhr.responseText);
                let postID = res.body.postID;

                uploads.map((photo, i) => {
                    this._uploadPhoto.bind(this)
                    this._uploadPhoto(photo, postID, i)
                });
            }
        };


        xhr.setRequestHeader('Id', this.props.appUser.id);
        xhr.setRequestHeader('Token', this.props.appUser.token);
        xhr.send(formData);
    }
}

const mapStateToProps = (state) => {
    return {
        appUser: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        auth: (id, token) => dispatch(auth(id, token)),
        refresh: () => dispatch(refresh())
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Upload)