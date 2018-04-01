const defaultState = {
    loading: false,
    refreshing: false,
    dataLoading: false,
    dataRefreshing: false,
    users: {}
}

export function users(state = defaultState, action) {
    const {type, data} = action
    switch (type) {
        case 'DATA_LOADING':
            return {
                ...state,
                ...data,
                postIds: state.postIds || [],
                first_name: state.first_name || "",
                last_name: state.last_name || "",
                username: state.username || "",
                total_posts: state.total_posts || 0,
                like_total: state.like_total || 0,
            }
        case 'DATA_ERROR':
            return {
                ...state,
                ...data,
                postIds: state.postIds || [],
                first_name: state.first_name || "",
                last_name: state.last_name || "",
                username: state.username || "",
                total_posts: state.total_posts || 0,
                like_total: state.like_total || 0,
            }
        case 'SET_USER_DATA':
            state.users[data.id] = {...state.users[data.id], ...data}
            return {
                ...state,
                users: {
                    ...state.users,
                    [data.id]: {
                        ...state.users[data.id],
                        ...data,
                    }
                },
                dataLoading: false,
                dataRefreshing: false,

            }
        case 'USER_POSTS_NEW':
            return {
                ...state,
                users: {
                    ...state.users,
                    [data.id]: {
                        ...state.users[data.id],
                        postIds: data.postIds.reverse(),
                        startCursor: data.startCursor
                    }
                },
                loading: false,
                refreshing: false,
                postIds: state.postIds || [],
                first_name: state.first_name || "",
                last_name: state.last_name || "",
                username: state.username || "",
                total_posts: state.total_posts || 0,
                like_total: state.like_total || 0,
            }
        case 'USER_POSTS_ADD':
            return {
                ...state,
                users: {
                    ...state.users,
                    [data.id]: {
                        ...state.users[data.id],
                        postIds: state.users[data.id].postIds.concat(data.postIds.reverse()),
                        startCursor: data.startCursor,
                    }
                },
                loading: false,
                postIds: state.postIds || [],
                first_name: state.first_name || "",
                last_name: state.last_name || "",
                username: state.username || "",
                total_posts: state.total_posts || 0,
                like_total: state.like_total || 0,
            }
        case 'USER_BLOCK':
            return {
                ...state,
                users: {
                    ...state.users,
                    [data.id]: {
                        ...state.users[data.id],
                        blocked: true,
                    }
                }

            }
        case 'USER_UNBLOCK':
            return {
                ...state,
                users: {
                    ...state.users,
                    [data.id]: {
                        ...state.users[data.id],
                        blocked: false,
                    }
                }

            }
        default:
            return state
    }
}