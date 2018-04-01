const defaultState = {
    refreshing: false,
    loading: false,
    events: [],
    errors: [],
}

export function trip(state = defaultState, action) {
    const {type, data} = action
    switch (type) {
        case 'TRIP_REFRESH':
            return {
                ...state,
                refreshing: true,
                loading: true,
            }
        case 'TRIP_DATA_LOADED':
            return {
                ...state,
                loading: false,
                refreshing: false,
                events: data.events,
            }
        case 'TRIP_DATA_ERROR':
            return {
                ...state,
                loading: false,
                refreshing: false,
                errors: data.errors,
            }
        default:
            return {
                ...state
            }
    }
}