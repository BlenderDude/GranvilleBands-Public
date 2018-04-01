import API from '../API'


export function refresh() {
    return (dispatch, getState) => {
        dispatch(tripRefresh())
        API.trip.getEvents()
            .then((body) => dispatch(tripDateLoaded(body.events)))
            .catch((errors) => dispatch(tripDataErrors(errors)))
    }
}

function tripRefresh() {
    return {
        type: 'TRIP_REFRESH'
    }
}

function tripDateLoaded(events) {
    return {
        type: 'TRIP_DATA_LOADED',
        data: {
            events,
        }
    }
}

function tripDataErrors(errors) {
    return {
        type: 'TRIP_DATA_ERROR',
        data: {
            errors,
        }
    }
}