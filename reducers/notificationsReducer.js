const defaultState = {
    loading: false,
    refreshing: false,
    notifications: []
}

export function notifications(state = defaultState, action) {
    const {type, data} = action
    switch (type) {
        case 'NOTIFICATIONS_LOADING':
            return {...state, ...data}
        case 'NOTIFICATIONS_REFRESHING':
            return {...state, ...data}
        case 'NOTIFICATIONS_ERROR':
            return {...state, ...data}
        case 'NOTIFICATIONS_REFRESH':
            return {...state, ...data}
        case 'NOTIFICATIONS_ADD':
            return {
                ...state,
                ...data,
                notifications: state.notifications.concat(data.notifications)
            }
        default:
            return state;
    }
}