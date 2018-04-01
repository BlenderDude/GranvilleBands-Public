import API from '../API'

export function refresh() {
    return (dispatch, getState) => {
        if (!getState().notifications.loading) {
            dispatch(refreshing())
            API.user.getNotifications()
                .then((res) => {
                    dispatch(refreshNotification(res))
                })
                .catch(() => {
                    dispatch(notificationsError())
                })
        }
    }
}

export function add() {
    return (dispatch, getState) => {
        if (!getState().notifications.loading) {
            dispatch(loading())
            API.user.getNotifications(getState().notifications.end_cursor)
                .then((res) => {
                    dispatch(addNotifications(res))
                }).catch(() => {
                dispatch(notificationsError())
            })
        }

    }
}

function loading() {
    return {
        type: "NOTIFICATIONS_LOADING",
        data: {
            loading: true,
        }
    }
}

function refreshing() {
    return {
        type: "NOTIFICATIONS_REFRESHING",
        data: {
            refreshing: true,
            loading: true,
        }
    }
}

function refreshNotification(newNotifications) {
    return {
        type: "NOTIFICATIONS_REFRESH",
        data: {
            refreshing: false,
            loading: false,
            notifications: newNotifications,
            end_cursor: newNotifications[newNotifications.length - 1].id,
        }
    }
}

function addNotifications(newNotifications) {
    return {
        type: "NOTIFICATIONS_ADD",
        data: {
            refreshing: false,
            loading: false,
            notifications: newNotifications,
            end_cursor: newNotifications[newNotifications.length - 1].id,
        }
    }
}

function notificationsError() {
    return {
        type: 'NOTIFICATIONS_ERROR',
        data: {
            loading: false,
            refreshing: false,
        }
    }
}