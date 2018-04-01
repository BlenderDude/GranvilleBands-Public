import API from '../API'
import NavigatorService from '../router/service'

export function refresh() {
    return (dispatch, getState) => {
        const {posts} = getState()
        if (!posts.loading) {
            dispatch(postsLoading(true))
            API.posts.request(10).then((body) => {
                dispatch(postsNew(body.posts, body.responseInfo.end_cursor))
            }).catch((error) => {
                dispatch(postsError(error))
            })
        }
    }
}

export function loadMore() {
    return (dispatch, getState) => {
        const {posts} = getState()
        if (!posts.loading && posts.startCursor !== -1) {
            const {startCursor} = posts
            dispatch(postsLoading())
            API.posts.request(30, startCursor).then((body) => {
                dispatch(postsAdd(body.posts, body.responseInfo.end_cursor))
            }).catch(() => dispatch(postsError()))
        }
    }
}

export function loadSingle(id) {
    return (dispatch, getState) => {
        dispatch(postsLoading())
        API.posts.single(id).then((body) => {
            dispatch(postsAddNoStream({[id]: body.post}))
        }).catch(() => dispatch(postsError()))
    }
}

export function like(id) {
    return (dispatch, getState) => {
        dispatch(userLike(id, getState().user))
        API.post(id).like().catch(() => {
        })
    }
}

export function dislike(id) {
    return (dispatch, getState) => {
        dispatch(userDislike(id, getState().user))
        API.post(id).dislike().catch(() => {
        })
    }
}

export function comment(id, comment) {
    return (dispatch, getState) => {
        dispatch(userComment(id, getState().user, comment))
        API.post(id).comment(comment).catch(() => {
        })
    }
}

export function remove(id) {
    return (dispatch, getState) => {
        dispatch(userRemoving(id))
        API.post(id).remove().then(() => {
            if (NavigatorService.getCurrentRoute().routeName !== "Home") {
                NavigatorService.reset(NavigatorService.getAllRoutes()[0].routeName)
            }
            dispatch(userRemove(id))
        }).catch((errors) => {
            dispatch(userRemoveError(id))
        })
    }
}

export function report(id) {

}

export function addPostsForUser(posts) {
    return (dispatch, getState) => {
        dispatch(postsAddNoStream(posts))
    }
}

export function updateCaption(id, caption) {
    return (dispatch) => {
        dispatch(postsUpdateCaption(id, caption))
        API.post(id).updateCaption(caption)
            .then(() => {
            })
            .catch(() => {
            })
    }
}

export function removePhoto(postid, id) {
    return (dispatch) => {
        dispatch(postsRemovePhoto(postid, id))
        API.post(postid).photo(id).remove()
            .then(() => {
            })
            .catch(() => {
            })
    }
}

function postsRemovePhoto(postid, id) {
    return {
        type: 'POSTS_REMOVE_PHOTO',
        data: {
            id: postid,
            photoId: id,
        }
    }
}

function postsUpdateCaption(id, caption) {
    return {
        type: 'POSTS_UPDATE_CAPTION',
        data: {
            id,
            caption,
        }
    }
}

function postsAddNoStream(posts) {
    return {
        type: 'POSTS_ADD_NO_STREAM',
        data: {
            posts
        }
    }
}

function userLike(id, user) {
    return {
        type: 'USER_LIKE',
        data: {
            id,
            user,
        }
    }
}

function userDislike(id, user) {
    return {
        type: 'USER_DISLIKE',
        data: {
            id,
            user,
        }
    }
}

function userComment(id, user, comment) {
    return {
        type: 'USER_COMMENT',
        data: {
            id,
            user,
            comment,
        }
    }
}

function userRemoving(id) {
    return {
        type: 'USER_REMOVING',
        data: {
            id,
            removeLoading: true,
        }
    }
}

function userRemove(id) {
    return {
        type: 'USER_REMOVE',
        data: {
            id,
            removeLoading: false,
        }
    }
}

function userRemoveError(id) {
    return {
        type: 'USER_REMOVE_ERROR',
        data: {
            id,
        }
    }
}

function postsLoading(refreshing = false) {
    return {
        type: 'POSTS_LOADING',
        data: {
            loading: true,
            refreshing
        }
    }
}

function postsNew(posts, startCursor) {
    return {
        type: 'POSTS_NEW',
        data: {
            loading: false,
            refreshing: false,
            posts,
            startCursor,
        }

    }
}

function postsAdd(posts, startCursor) {
    return {
        type: 'POSTS_ADD',
        data: {
            loading: false,
            refreshing: false,
            posts,
            startCursor,
        }

    }
}

function postsError(error) {
    return {
        type: 'POSTS_ERROR',
        data: {
            loading: false,
            refreshing: false,
            error,
        },
    }
}