const defaultState = {
    loading: false,
    refreshing: false,
    messages: []
}

export function messages(state = defaultState, action) {
    const {type, data} = action
    switch (type) {
        case 'MESSAGES_LOADING':
            return {...state, ...data}
        case 'MESSAGES_REFRESHING':
            return {...state, ...data}
        case 'MESSAGES_ERROR':
            return {...state, ...data}
        case 'MESSAGES_REFRESH':
            return {...state, ...data}
        case 'MESSAGES_ADD':
            return {
                ...state,
                ...data,
                messages: state.notifications.concat(data.notifications)
            }
        default:
            return state;
    }
}