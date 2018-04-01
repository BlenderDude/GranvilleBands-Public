import API from '../API'
import {addPostsForUser} from "./posts"

export function getUserData(id) {
    return (dispatch, getState) => {
        dispatch(dataLoading(id))
        API.userData(id).getUserData()
            .then((body) => {
                dispatch(setUserData(body))
            })
            .catch((error) => dispatch(dataError(error)))
    }
}

export function block(id) {
    return (dispatch, getState) => {
        dispatch(userBlock(id))
        API.userData(id).block()
            .then(() => {
            })
            .catch(() => {
            })
    }
}

export function unblock(id) {
    return (dispatch, getState) => {
        dispatch(userUnblock(id))
        API.userData(id).unblock()
            .then(() => {
            })
            .catch(() => {
            })
    }
}

export function refreshUserPosts(id) {
    return (dispatch, getState) => {
        if (getState().users.loading) return
        dispatch(postsLoading(id, true))
        API.userData(id).getPosts(30).then((body) => {
            const postIds = Object.keys(body.posts)
            const startCursor = body.responseInfo.end_cursor
            dispatch(addPostsForUser(body.posts))
            dispatch(userPostsNew(id, postIds, startCursor))
        }).catch(() => {
        })
    }
}

export function addUserPosts(id) {
    return (dispatch, getState) => {
        if (getState().users.loading || getState().users.users[id].startCursor === -1) return
        dispatch(postsLoading(id))
        API.userData(id).getPosts(30, getState().users.users[id].startCursor).then((body) => {

            const postIds = Object.keys(body.posts)
            const startCursor = body.responseInfo.end_cursor
            dispatch(addPostsForUser(body.posts))
            dispatch(userPostsAdd(id, postIds, startCursor))
        })
    }
}

function userBlock(id) {
    return {
        type: 'USER_BLOCK',
        data: {
            id
        }
    }
}

function userUnblock(id) {
    return {
        type: 'USER_UNBLOCK',
        data: {
            id
        }
    }
}

function dataLoading(id, dataRefreshing = false) {
    return {
        type: 'DATA_LOADING',
        data: {
            dataLoading: true,
            id,
            dataRefreshing,
        }
    }
}

function postsLoading(id, refreshing = false) {
    return {
        type: 'DATA_LOADING',
        data: {
            loading: true,
            id,
            refreshing,
        }
    }
}

function setUserData(data) {
    return {
        type: 'SET_USER_DATA',
        data,
    }
}

function userPostsNew(id, postIds, startCursor) {
    return {
        type: 'USER_POSTS_NEW',
        data: {
            id,
            postIds,
            startCursor,
        }
    }
}

function userPostsAdd(id, postIds, startCursor) {
    return {
        type: 'USER_POSTS_ADD',
        data: {
            id,
            postIds,
            startCursor,
        }
    }
}

function dataError(error) {
    return {
        type: 'DATA_ERROR',
        data: {
            error
        }
    }
}