import API from '../API'
import {AsyncStorage} from 'react-native'

export function login(username, password) {
    return (dispatch, getState) => {
        dispatch(loading())
        API.user.login(username, password).then((body) => {
            AsyncStorage.setItem("loginInfo", JSON.stringify({id: body.id, token: body.token}))
            dispatch(userLogin(body))
        }).catch((error) => {
            dispatch(loadingError(error))
        })
    }
}

export function register(first_name, last_name, username, password) {
    return (dispatch, getState) => {
        dispatch(loading())
        API.user.register(first_name, last_name, username, password).then((body) => {
            AsyncStorage.setItem("loginInfo", JSON.stringify({id: body.id, token: body.token}))
            dispatch(userLogin(body))
        }).catch((error) => {
            dispatch(loadingError(error))
        })
    }
}

export function auth(id, token) {
    return (dispatch) => {
        dispatch(loading())
        API.user.auth(id, token).then((body) => {
            dispatch(userLogin(body))
        }).catch((error) => {
            dispatch(loadingError(error))
        })
    }
}

export function logout() {
    return (dispatch) => {
        AsyncStorage.removeItem("loginInfo")
        dispatch(userLogout())
    }
}

export function clearErrors() {
    return (dispatch) => {
        dispatch(clearUserErrors())
    }
}

export function loaded() {
    return (dispatch) => {
        dispatch(userLoaded())
    }
}

export function changeProfilePhoto(photoURI) {
    return (dispatch) => {
        dispatch(profilePhotoLoading(photoURI))
        API.user.changeProfilePhoto(photoURI).then((res) => {
            dispatch(profilePhotoLoaded())
            dispatch(newProfilePhoto(res.id, res.photo))
        }).catch(() => {
            dispatch(profilePhotoLoaded())
        })
    }
}

function userLogout() {
    return {
        type: "USER_LOGOUT",
        data: {
            loggedin: false,
            loaded: true,
            loading: false,
        }
    }
}

function clearUserErrors() {
    return {
        type: "USER_CLEAR_ERRORS",
        data: {
            errors: [],
        }
    }
}

function userLoaded() {
    return {
        type: "USER_LOADED",
        data: {
            loaded: true,
        }
    }
}

function loading() {
    return {
        type: "USER_LOADING",
        data: {
            loading: true,
            error: false,
        }
    }
}

function userLogin(data) {
    return {
        type: "USER_LOGIN",
        data: {
            ...data,
            loggedin: true,
            loading: false,
            loaded: true,
            errors: [],
        }
    }
}

function loadingError(errors) {
    return {
        type: "USER_LOADING_ERROR",
        data: {
            loading: false,
            loaded: false,
            error: true,
        }
    }
}

function profilePhotoLoading(photoURI) {
    return {
        type: "USER_PROFILE_PHOTO_LOADING",
        data: photoURI,
    }
}

function profilePhotoLoaded() {
    return {
        type: "USER_PROFILE_PHOTO_LOADED",
    }
}

function newProfilePhoto(id, filename) {
    return {
        type: "SET_USER_DATA",
        data: {
            id: id,
            profile_pic: filename,
        }
    }
}
