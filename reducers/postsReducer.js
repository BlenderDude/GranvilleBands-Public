const defaultState = {
    refreshing: false,
    loading: false,
    postStream: [],
    posts: {},
}

let placeholderID = -1

export function posts(state = defaultState, action) {
    const {type, data} = action
    let id, comment, user
    switch (type) {
        case 'POSTS_LOADING':
            return {...state, ...data}
        case 'POSTS_NEW':
            return {
                ...state,
                loading: data.loading,
                refreshing: data.refreshing,
                startCursor: data.startCursor,
                postStream: Object.keys(data.posts).reverse(),
                posts: {...state.posts, ...data.posts},
            }
        case 'POSTS_ADD':
            let newPostStream = []
            state.postStream.concat(Object.keys(data.posts).reverse()).forEach(item => {
                if (newPostStream.indexOf(item) === -1)
                    newPostStream.push(item);
            });
            return {
                ...state,
                loading: data.loading,
                refreshing: data.refreshing,
                startCursor: data.startCursor,
                postStream: newPostStream,
                posts: {...state.posts, ...data.posts},
            }
        case 'POSTS_ADD_NO_STREAM':
            return {
                ...state,
                loading: false,
                posts: {...state.posts, ...data.posts},
            }
        case 'POSTS_ERROR':
            return {
                ...state,
                ...data,
            }
        case 'POSTS_UPDATE_CAPTION':
            id = data.id
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [id]: {
                        ...state.posts[id],
                        caption: data.caption
                    }
                }
            }
        case 'POSTS_REMOVE_PHOTO':
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [data.id]: {
                        ...state.posts[data.id],
                        photos: state.posts[data.id].photos.filter(photo => photo.id !== data.photoId),
                    }
                }
            }
        case 'USER_LIKE':
            id = data.id
            user = data.user
            let new_likes = state.posts[id].likes
            if (state.posts[id].likes.map((like) => like.user_id).indexOf(user.id) === -1) {
                new_likes = state.posts[id].likes.concat({
                    id: --placeholderID,
                    user_id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    username: user.username,
                    group_id: user.group_id,
                    profile_pic: user.profile_pic,
                })
            }
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [id]: {
                        ...state.posts[id],
                        likes: new_likes
                    }
                }
            }
        case 'USER_DISLIKE':
            id = data.id
            user = data.user
            return {
                ...state,
                posts: {
                    ...state.posts,
                    [id]: {
                        ...state.posts[id],
                        likes: state.posts[id].likes.filter((like, i) => like.user_id !== user.id)
                    }
                }
            }
        case 'USER_COMMENT':
            id = data.id
            comment = data.comment
            user = data.user

            return {
                ...state,
                posts: {
                    ...state.posts,
                    [id]: {
                        ...state.posts[id],
                        comments: state.posts[id].comments.concat({
                            id: --placeholderID,
                            user_id: user.id,
                            first_name: user.first_name,
                            last_name: user.last_name,
                            username: user.username,
                            group_id: user.group_id,
                            profile_pic: user.profile_pic,
                            comment,
                        })

                    }
                }
            }
        case 'USER_REMOVING':
            id = data.id
            state.posts[id].removing = true
            return {
                ...state,
            }
        case 'USER_REMOVE':
            id = data.id
            state.posts[id].removing = false
            state.posts[id].removed = true
            return {
                ...state,
            }
        case 'USER_REMOVE_ERROR':
            id = data.id
            state.posts[id].removing = false
            return {
                ...state
            }
        default:
            return state;
    }
}