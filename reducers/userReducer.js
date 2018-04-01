const defaultState = {
    loaded: false,
    loading: false,
    loggedin: false,
    errors: [],
    profilePhotoLoading: false,
    profilePhotoProgress: 0,
    nextProfilePhotoURI: "",
}

export function user(state = defaultState, action) {
    const {type, data} = action
    switch (type) {
        case 'CLEAR_ERRORS':
            return {...state, ...data}
        case 'USER_LOADING':
            return {...state, ...data}
        case 'USER_LOADED':
            return {...state, ...data}
        case 'USER_LOGIN':
            return {...state, ...data}
        case 'USER_LOGOUT':
            return {...state, ...data}
        case 'USER_LOADING_ERROR':
            return {...state, ...data}
        case 'USER_CLEAR_ERRORS':
            return {...state, ...data}
        case 'USER_PROFILE_PHOTO_LOADING':
            return {
                ...state,
                profilePhotoLoading: true,
                nextProfilePhotoURI: data,
            }
        case 'USER_PROFILE_PHOTO_LOADED':
            return {
                ...state,
                profilePhotoLoading: false,
                profilePhotoProgress: 0,
            }
        case 'USER_PROFILE_PHOTO_PROGRESS':
            return {
                ...state,
                profilePhotoProgress: data,
            }
        default:
            return state;
    }
}