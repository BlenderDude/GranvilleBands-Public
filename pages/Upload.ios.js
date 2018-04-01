import React, {Component} from "react";
import {
    Modal, ScrollView, TouchableHighlight, Text, StyleSheet, View, Image,
    Button, TouchableOpacity, StatusBar, Animated, Easing, CameraRoll,
    Dimensions, PanResponder, Touchable, TouchableWithoutFeedback, ActivityIndicator, FlatList, TextInput,
    Platform, NativeModules
} from "react-native";
import RNPhotosFramework from "react-native-photos-framework"
import {postAssets} from 'react-native-photos-framework/src/ajax-helper'
import {connect} from 'react-redux'
import {auth} from '../actions/user'
import RNFetchBlob from 'react-native-fetch-blob';
import {refresh} from "../actions/posts";

import AnimateNumber from "react-native-animate-number"

//import BGUpload from 'react-native-background-upload';

class Upload extends Component {
    static navigatorOptions = {
        header: null,
        headerStyle: {backgroundColor: 'red'},
        headerBackTitle: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            page: 0,
            uploadStatus: [],
            uploadActive: false,
            uploadPage: false,
            caption: "",
        }
    }

    componentWillMount() {
        //this.props.auth(this.props.id,this.props.token)
    }

    _checkApprove() {
        this.props.auth(this.props.id, this.props.token)
    }

    _addPhoto(photo, index, listElement) {
        photo.listElement = listElement;
        listElement._checkInUpload.bind(listElement);
        if (this.state.photos.length == 10) {
            listElement._setInUpload(false, index);
            return false;
        }
        let newArray = this.state.photos.map((oldPhoto, i) => {
            return oldPhoto
        });
        newArray[index] = photo.withOptions({
            deliveryMode: 'highQuality',
        });
        this.setState({
            photos: newArray
        });
        listElement._setInUpload(true, index)
    }

    _removePhoto(index) {
        let newArray = this.state.photos.slice(0);
        const deletedPhoto = newArray.splice(index, 1)[0];
        deletedPhoto.listElement._setInUpload.bind(deletedPhoto.listElement);
        deletedPhoto.listElement._setInUpload(false);

        this.setState({
            photos: newArray
        });
    }

    _removePhotoByPhoto(photo) {
        let newArray = this.state.photos.slice(0);
        let urisArray = this.state.photos.slice(0).map(photo => photo.uri);
        const photoToDeleteIndex = urisArray.indexOf(photo.uri);
        const deletedPhoto = newArray.splice(photoToDeleteIndex, 1)[0];
        deletedPhoto.listElement._setInUpload.bind(deletedPhoto.listElement);
        deletedPhoto.listElement._setInUpload(false);

        this.setState({
            photos: newArray
        });
    }

    _getPhotosLength() {
        return this.state.photos.length
    }

    _uploadPhoto(photo, postID, thisClass, i) {

        // postAssets([photo], {
        //     url: 'https://gbands.danielabdelsamed.com/api/posts/uploadPhoto/' + postID,
        //     headers: {
        //         Id: this.props.id,
        //         Token: this.props.token,
        //     },
        //     onProgress: (progressPercentage, details) => {
        //         let currentUploads = thisClass.state.uploadStatus;
        //         currentUploads[i].uploaded = progressPercentage / 100;
        //
        //         thisClass.setState({
        //             uploadStatus: currentUploads,
        //         });
        //     },
        //     onComplete: (asset, status, responseText, xhr) => {
        //         console.log(responseText);
        //         let currentUploads = thisClass.state.uploadStatus;
        //         currentUploads[i].done = true;
        //         let uploadsComplete = testUploads();
        //         thisClass.setState({
        //             uploadActive: !uploadsComplete,
        //         });
        //
        //         function testUploads() {
        //             let allUploaded = true;
        //             thisClass.state.uploadStatus.map((upload) => {
        //                 if (!upload.done) {
        //                     allUploaded = false;
        //                 }
        //             })
        //             return allUploaded;
        //         }
        //     },
        //     onError: (asset, status, responseText, xhr) => {
        //         console.log('Asset upload failed');
        //     },
        //     onFinnished: (completedItems) => {
        //         console.log('Operation complete');
        //     },
        //     // modifyAssetData : (postableAsset, asset) => {
        //     //     postableAsset.name = `${postableAsset.name}-special-name-maybe-guid.jpg`;
        //     //     return postableAsset;
        //     // }
        // })


        NativeModules.JpegConverter.convert(photo.localIdentifier, (filePath) => {

            let currentUploads = thisClass.state.uploadStatus;
            currentUploads[i].converting = false;

            thisClass.setState({
                uploadStatus: currentUploads,
            });

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }

            const tempPath = RNFetchBlob.fs.dirs.CacheDir + "image-" + guid() + ".jpg";
            RNFetchBlob.fs.cp(filePath, tempPath).then(() => {
                const url = 'https://gbands.danielabdelsamed.com/api/posts/uploadPhoto/' + postID;
                var formData = new FormData();
                formData.append("photo", {
                    uri: "file://" + tempPath,
                    name: "photo",
                });

                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);

                xhr.upload.onprogress = function (e) {
                    let percentComplete = e.loaded / e.total;
                    let currentUploads = thisClass.state.uploadStatus;
                    currentUploads[i].uploaded = percentComplete;

                    thisClass.setState({
                        uploadStatus: currentUploads,
                    });


                };
                xhr.onreadystatechange = function () {
                    if (this.readyState === 4 && this.status === 200) {
                        let currentUploads = thisClass.state.uploadStatus;
                        currentUploads[i].done = true;
                        let uploadsComplete = testUploads();
                        thisClass.setState({
                            uploadActive: !uploadsComplete,
                        });

                        RNFetchBlob.fs.unlink(filePath)
                        RNFetchBlob.fs.unlink(tempPath)

                        function testUploads() {
                            let allUploaded = true;
                            thisClass.state.uploadStatus.map((upload) => {
                                if (!upload.done) {
                                    allUploaded = false;
                                }
                            });
                            return allUploaded;
                        }
                    }
                };

                xhr.setRequestHeader('Id', this.props.id);
                xhr.setRequestHeader('Token', this.props.token);
                xhr.send(formData);
            })
        })
    }

    _uploadPost() {
        this.setState({
            uploadPage: true,
            uploadActive: true,
        });
        let currentUploadStatus = this.state.uploadStatus.slice(0);
        this.state.photos.map((photo, i) => {

            currentUploadStatus.push({
                photo: photo,
                uploaded: 0,
                done: false,
                converting: true,
            });
        });
        this.setState({
            uploadStatus: currentUploadStatus,
        });
        const url = 'https://gbands.danielabdelsamed.com/api/posts/uploadPost';

        let formData = new FormData();
        formData.append("caption", this.state.caption);
        let xhr = new XMLHttpRequest();
        xhr.open('POST', url);
        xhr.upload.onprogress = (e) => {
            let percentComplete = e.loaded / e.total;
        };
        let photos = this.state.photos;
        let thisClass = this;
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let res = JSON.parse(xhr.responseText);
                let postID = res.body.postID;
                photos.map((photo, i) => {
                    thisClass._uploadPhoto(photo, postID, thisClass, i);
                });
                thisClass.setState({
                    uploadActive: true,
                });
            }
        };


        xhr.setRequestHeader('Id', this.props.id);
        xhr.setRequestHeader('Token', this.props.token);
        xhr.send(formData);
    }


    render() {
        let percentDone = 0;
        this.state.uploadStatus.map((upload) => {
            percentDone += upload.uploaded * (1 / this.state.uploadStatus.length);
        });
        percentDone = (Math.round(percentDone * 10000) / 100);
        return (
            <View style={{paddingTop: 20, backgroundColor: "#fcfcfc", flex: 1}}>
                <View style={styles.header}>
                    {(!this.state.uploadPage || (!this.state.uploadActive && this.state.uploadPage)) ?
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                paddingTop: 10,
                                paddingBottom: 10,
                                top: 0,
                                left: 16,
                                width: 80,
                                height: 40,
                                zIndex: 4,
                            }}
                            onPress={this.props.closeModal}>
                            <Text style={{
                                textAlign: "left",
                                fontSize: 18,
                                color: "#000000",
                            }}>Close</Text>
                        </TouchableOpacity> : null}

                    {(this.state.uploadPage) ?
                        <Text
                            style={styles.headerText}>
                            {percentDone.toFixed(2)}% Uploaded
                        </Text>
                        :
                        <Text
                            style={styles.headerText}>
                            Upload {(this.state.photos.length !== 0) ? "(" + (this.state.photos.length) + "/10)" : null}
                        </Text>
                    }

                    {(this.state.photos.length > 0 && this.state.page === 0) ?
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                paddingTop: 10,
                                paddingBottom: 10,
                                top: 0,
                                right: 16,
                                width: 80,
                                height: 40,
                                zIndex: 4,
                            }}
                            onPress={() => {
                                this.refs.step.scrollTo({x: Dimensions.get('window').width, y: 0, animated: true})
                            }}>
                            <Text style={{
                                textAlign: "right",
                                fontSize: 18,
                                color: "#007AFF",
                            }}>Next</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {(this.state.photos.length > 0 && this.state.page === 1 && !this.state.uploadPage) ?
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                paddingTop: 10,
                                paddingBottom: 10,
                                top: 0,
                                right: 16,
                                width: 80,
                                height: 40,
                                zIndex: 4,
                            }}
                            onPress={() => {
                                this._uploadPost.bind(this);
                                this._uploadPost();
                            }}>
                            <Text style={{
                                textAlign: "right",
                                fontSize: 18,
                                color: "#007AFF",
                            }}>Upload</Text>
                        </TouchableOpacity>
                        : null
                    }
                    {(!this.state.uploadActive && this.state.uploadPage) ?
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                paddingTop: 10,
                                paddingBottom: 10,
                                top: 0,
                                right: 16,
                                width: 80,
                                height: 40,
                                zIndex: 4,
                            }}
                            onPress={() => {
                                this.props.refresh();
                                this.props.closeModal();
                                this.setState({
                                    uploadActive: false,
                                    uploadPage: false,
                                    uploadStatus: [],
                                    photos: [],
                                    page: 0,
                                    caption: "",
                                })
                            }}>
                            <Text style={{
                                textAlign: "right",
                                fontSize: 18,
                                color: "#007AFF",
                            }}>Done</Text>
                        </TouchableOpacity>
                        : null
                    }
                </View>
                {
                    this.props.approved ?
                        <View
                            style={{
                                flex: 1
                            }}
                        >
                            {!this.state.uploadPage ?
                                <View
                                    style={{
                                        flex: 1,
                                    }}
                                >

                                    <View
                                        style={{
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            borderBottomColor: "#ccc",
                                            borderBottomWidth: 1,
                                            zIndex: 45
                                        }}>
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            style={{height: 130, overflow: "visible", zIndex: 45}}>
                                            {this.state.photos.slice(0).reverse().map((photo, index) => {
                                                return (
                                                    <ImagePlaceholder chosen={true} key={photo.localIdentifier}
                                                                      photo={photo}
                                                                      index={this.state.photos.length - 1 - index}
                                                                      addPhoto={this._addPhoto.bind(this)}
                                                                      removePhoto={this._removePhoto.bind(this)}/>
                                                )
                                            })}

                                        </ScrollView>
                                    </View>
                                    <View style={{
                                        flex: 1
                                    }}>
                                        <ScrollView
                                            horizontal={true}
                                            pagingEnabled={true}
                                            showsHorizontalScrollIndicator={false}
                                            onScroll={(e) => {
                                                this.setState({page: e.nativeEvent.contentOffset.x / Dimensions.get('window').width > 0.5 ? 1 : 0})
                                            }}
                                            scrollEventThrottle={100}
                                            scrollEnabled={this.state.photos.length !== 0}
                                            keyboardDismissMode="on-drag"
                                            ref="step">
                                            <CurrentPhotos newPhoto={this._addPhoto.bind(this)}
                                                           removePhoto={this._removePhotoByPhoto.bind(this)}
                                                           currentIndex={this._getPhotosLength.bind(this)}
                                                           currentPhotos={this.state.photos}/>
                                            {(this.state.photos.length !== 0)
                                                ?
                                                <View
                                                    style={{
                                                        flex: 1,
                                                        width: Dimensions.get('window').width,
                                                    }}>
                                                    <TextInput
                                                        style={{
                                                            borderBottomColor: '#ccc',
                                                            borderBottomWidth: 1,
                                                            fontSize: 18,
                                                            height: 150,
                                                            paddingLeft: 5,
                                                            paddingRight: 5,
                                                            marginBottom: 100,
                                                        }}
                                                        placeholder="Caption"
                                                        onChange={(event) => this.setState({caption: event.nativeEvent.text.substring(0, 128)})}
                                                        value={this.state.caption}
                                                        multiline={true}
                                                        returnKeyType={"done"}
                                                        blurOnSubmit={true}
                                                        maxLength={128}
                                                    />
                                                </View>

                                                :
                                                null

                                            }
                                        </ScrollView>
                                    </View>
                                </View>
                                :
                                <View
                                    style={{
                                        flex: 1
                                    }}
                                >
                                    <ScrollView
                                        style={{
                                            flex: 1
                                        }}
                                    >
                                        <View style={{}}>
                                            {this.state.uploadStatus.map((upload) => {
                                                return (
                                                    <View key={upload.photo.uri}
                                                          style={{
                                                              height: 50,
                                                              width: 100 + ((Dimensions.get('window').width - 110) * upload.uploaded),
                                                              borderRadius: 10,
                                                              overflow: "hidden",
                                                              margin: 5,
                                                          }}
                                                    >
                                                        <Image
                                                            source={upload.photo.image}
                                                            style={{
                                                                width: Dimensions.get('window').width,
                                                                height: 50,

                                                            }}
                                                            blurRadius={50}
                                                        />
                                                        <View
                                                            style={{
                                                                height: 50,
                                                                width: 100,
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 0,
                                                            }}
                                                        >
                                                            <Image source={upload.photo.image}
                                                                   style={{
                                                                       width: 100,
                                                                       height: 50,
                                                                       borderRadius: 10,
                                                                   }}
                                                            />
                                                            <View
                                                                style={{
                                                                    height: 50,
                                                                    width: 100,
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    justifyContent: 'center',
                                                                    alignItems: 'center',
                                                                }}
                                                            >
                                                                {(upload.uploaded === 1 && !upload.done) || (upload.converting) ?
                                                                    <ActivityIndicator style={{
                                                                        backgroundColor: "#ffffffca",
                                                                        padding: 5,
                                                                        borderRadius: 5,
                                                                        overflow: "hidden",
                                                                    }} animated={true}/>
                                                                    :
                                                                    <Text
                                                                        style={{
                                                                            backgroundColor: "#ffffffca",
                                                                            fontSize: 18,
                                                                            padding: 5,
                                                                            borderRadius: 5,
                                                                            overflow: "hidden",
                                                                        }}
                                                                    >
                                                                        {(upload.uploaded !== 1 && !upload.done) ? (Math.round(Math.floor(upload.uploaded * 10000) / 100)).toFixed(0) + "%" : null}
                                                                        {(upload.uploaded === 1 && !upload.done) ? "Processing" : null}
                                                                        {(upload.uploaded === 1 && upload.done) ? "Done" : null}
                                                                    </Text>
                                                                }

                                                            </View>
                                                        </View>

                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </ScrollView>
                                </View>
                            }
                        </View>
                        :
                        <View style={{backgroundColor: "#fff"}}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginTop: 20,
                                }}
                            >Account not Appoved</Text>
                            <Text
                                style={{
                                    margin: 10,
                                    fontSize: 18,
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    textAlign: 'center',
                                }}
                            >
                                Wait until a director or media tech approves you
                            </Text>
                            <Button title="Refresh"
                                    onPress={this.props.auth.bind(this, this.props.id, this.props.token)}/>
                            <ActivityIndicator animating={this.props.loading}/>
                        </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        approved: state.user.approved,
        id: state.user.id,
        token: state.user.token,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        auth: (id, token) => dispatch(auth(id, token)),
        refresh: () => dispatch(refresh()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Upload)

class ImagePlaceholder extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        x: new Animated.Value(-(Dimensions.get('window').width / 3)),
        y: new Animated.Value(0),
        scale: new Animated.Value(1),
        rotate: new Animated.Value(0),
        containerWidth: new Animated.Value(0),
        borderRadius: new Animated.Value(3),
    };

    componentDidMount() {
        if (Platform.OS !== 'android') {
            const duration = 500;
            Animated.parallel([
                Animated.spring(
                    this.state.x,
                    {
                        toValue: 0,
                        friction: 6,
                        tension: 60,
                        //duration,
                        useNativeDriver: false,
                    }
                ),
                Animated.timing(
                    this.state.y,
                    {
                        toValue: 0,
                        duration,
                        useNativeDriver: false,
                    }
                ),
                Animated.timing(
                    this.state.rotate,
                    {
                        toValue: 1,
                        duration,
                        useNativeDriver: false,
                    }
                ),
                Animated.spring(
                    this.state.containerWidth,
                    {
                        toValue: 130,
                        friction: 3.7,
                        tension: 40,
                        //duration,
                        useNativeDriver: false,
                    }
                ),
                Animated.timing(
                    this.state.borderRadius,
                    {
                        toValue: 3,
                        duration,
                        useNativeDriver: false,

                    }
                )
                // Animated.timing(
                //     this.state.scale,
                //     {
                //         toValue: 1,
                //         duration: duration,
                //         useNativeDriver: true,
                //     }
                // )
            ]).start();
        }

    }


    render() {
        let animationStyles = {
            overflow: 'hidden',
            width: 120,//this.state.width,
            height: 120,//this.state.height,
            borderColor: "#ccc",
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: this.state.borderRadius,
        };
        if (Platform.OS !== 'android') {
            animationStyles.transform = [
                {translateX: this.state.x},
                {translateY: this.state.y},
                // {rotate: this.state.rotate.interpolate({
                //     inputRange: [0,1],
                //     outputRange: ["-30deg","0deg"],
                // })},
                {scale: this.state.scale},
            ]

        } else {
            this.state.containerWidth = 130
        }


        return (
            <View ref="container" style={{zIndex: 50}}>
                <Animated.View style={{width: this.state.containerWidth, padding: 5, overflow: "visible", zIndex: 50}}>
                    <Animated.View
                        style={{...animationStyles, zIndex: 50}}>
                        <TouchableOpacity
                            style={{
                                margin: 0,
                            }}
                            onPress={() => {
                                this.props.removePhoto(this.props.index)
                            }}>
                            <Image source={this.props.photo.image} style={{
                                zIndex: 51,
                                width: 120,
                                height: 120,

                            }}/>
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 45,
        backgroundColor: "#fcfcfc",
        borderBottomColor: "#ccc",
        borderBottomWidth: 1,
        zIndex: 9999,
    },
    closeButton: {
        textAlign: "left",
        fontSize: 18,
        //color:"#007AFF",
        color: "black"
    },
    closeButtonContainer: {
        position: "absolute",
        top: 10,
        left: 16,
        width: 80,
        height: 40,
        zIndex: 4,
    },
    headerText: {
        textAlign: 'center',
        fontSize: 16,
        paddingTop: 10,
        fontWeight: 'bold',
    },
    touchableHighlight: {
        width: 150,
        height: 150,
        borderRadius: 0,
        backgroundColor: "#ccc",
        margin: 5,
    },
    choose: {
        fontSize: 150,
        lineHeight: 150,
        backgroundColor: "rgba(0,0,0,0)",
        color: "gray",
        textAlign: "center"
    },
    image: {
        borderRadius: 0,
        zIndex: 51,
    }
});

class CurrentPhotos extends Component {
    PHOTOS_PER_FETCHED = 36;

    constructor(props) {
        super(props);
        this.state = {
            cameraRoll: [],
            has_next_page: false,
            end_cursor: "",
            loading: true,
            containsHeic: false,
        };
        // ActionSheetIOS.showActionSheetWithOptions({
        //     options:["Test","test2","Cancel"],
        //     destructiveButtonIndex: 2,
        //     title: "Hello",
        //     message: "messsage",
        // },(e)=>console.log(e));


        // CameraRoll.getPhotos({
        //     first: 27,
        // }).then((r) => {
        //     console.log(r)
        //     let photos = r.edges;
        //     let {page_info} = r;
        //     this.setState({
        //         cameraRoll: photos,
        //         has_next_page: page_info.has_next_page,
        //         end_cursor: page_info.end_cursor,
        //         loading: false,
        //     });
        // }).catch((error)=>console.log(error))
        RNPhotosFramework.onLibraryChange(this._fetchPhotos.bind(this));

        this._fetchPhotos()

        //this.PHOTO_FETCH_INTERVAL = setInterval(this._fetchPhotos.bind(this),3000)
    }


    _fetchPhotos() {
        RNPhotosFramework.requestAuthorization().then((status) => {
            if (status.isAuthorized) {
                RNPhotosFramework.getAssets({
                    startIndex: 0,
                    endIndex: this.PHOTOS_PER_FETCHED,

                    includeMetadata: true,
                    prepareForSizeDisplay: {width: 500, height: 500},
                    includeResourcesMetadata: true,
                    fetchOptions: {
                        mediaTypes: ["image"],
                        sortDescriptors: [
                            {
                                key: 'creationDate',
                                ascending: false,
                            }
                        ]
                    },
                    trackInsertsAndDeletes: true,
                    trackChanges: true
                }).then((response) => {
                    const {assets, includesLastAsset} = response;
                    this.setState({
                        cameraRoll: assets,
                        endIndex: this.PHOTOS_PER_FETCHED + 1,
                        includesLastAsset,
                        loading: false,
                    });
                });
            }
        })
    }

    _loadMorePhotos() {
        if (!this.state.includesLastAsset && !this.state.loading) {
            this.setState({loading: true});
            RNPhotosFramework.requestAuthorization().then((status) => {
                if (status.isAuthorized) {
                    RNPhotosFramework.getAssets({
                        startIndex: this.state.endIndex + 1,
                        endIndex: this.state.endIndex + this.PHOTOS_PER_FETCHED + 1,

                        includeMetadata: true,
                        includeResourcesMetadata: true,
                        prepareForSizeDisplay: {width: 500, height: 500},
                        fetchOptions: {
                            mediaTypes: ["image"],

                            sortDescriptors: [
                                {
                                    key: 'creationDate',
                                    ascending: false,
                                }
                            ]
                        }
                    }).then((response) => {
                        const {assets, includesLastAsset} = response
                        this.setState({
                            cameraRoll: this.state.cameraRoll.concat(assets),
                            includesLastAsset,
                            endIndex: this.state.endIndex + this.PHOTOS_PER_FETCHED + 1,
                            loading: false,
                        });
                    });
                }
            })
        }
    }

    render() {
        const currentPhotoUris = (this.props.currentPhotos.map((e) => e.uri));
        const size = Dimensions.get('window').width / 3;
        return (
            <FlatList
                data={this.state.cameraRoll}
                keyExtractor={(photo, index) => photo.localIdentifier}
                numColumns={3}
                style={{}}
                onEndReachedThreshold={0.1}
                onEndReached={this._loadMorePhotos.bind(this)}
                // showsVerticalScrollIndicator={false}
                // onEndReached={() => {
                //     this._loadMorePhotos.bind(this);
                //     this._loadMorePhotos()
                // }}
                renderItem={({item}) => {

                    return (
                        <CameraRollPhoto currentPhotosUris={currentPhotoUris}
                                         photo={item.withOptions({deliveryMode: 'highQuality'})}
                                         getCurrentIndex={this.props.currentIndex} newPhoto={this.props.newPhoto}
                                         removePhoto={this.props.removePhoto} size={size}/>
                    )
                }
                }/>



        )

    }
}

class CameraRollPhoto extends Component {
    state = {
        inUpload: false,
        opacity: new Animated.Value(1),
    };

    _checkInUpload() {
        this.setState({inUpload: (this.props.currentPhotosUris.indexOf(this.props.photo.uri) !== -1)})
    }

    _setInUpload(state, index) {
        this.setState({inUpload: state, uploadIndex: index})
    }

    shouldComponentUpdate(newProps, newState) {
        return newState.inUpload !== this.state.inUpload;
    }

    componentDidMount() {

    }

    componentWillUpdate() {
        const duration = 300;
        const newOpacity = parseFloat((!this.state.inUpload) ? 0.2 : 1);
        Animated.timing(
            this.state.opacity,
            {
                toValue: newOpacity,
                duration: duration,
                useNativeDriver: true,
            }
        ).start()
    }

    render() {
        return (
            <View ref="imageOnRoll">
                <TouchableWithoutFeedback
                    style={{
                        width: this.props.size,
                        height: this.props.size,
                    }}
                    //underlayColor="#000"
                    onPress={() => {
                        if (!this.state.inUpload) {
                            this.props.newPhoto(this.props.photo, this.props.getCurrentIndex(), this)
                        } else {
                            this.props.removePhoto(this.props.photo)
                        }
                    }}>

                    <Animated.Image

                        source={this.props.photo.image}
                        style={{
                            zIndex: 1,
                            width: this.props.size,
                            height: this.props.size,
                            opacity: this.state.opacity
                        }}
                    />

                </TouchableWithoutFeedback>
            </View>
        )
    }
}