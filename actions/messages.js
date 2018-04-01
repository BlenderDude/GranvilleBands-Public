import API from '../API'

export function refresh() {
    return (dispatch, getState) => {
        if (!getState().messages.loading) {
            dispatch(refreshing())
            API.user.getMessages()
                .then((res) => {
                    dispatch(refreshMessages(res))
                })
                .catch(() => {
                    dispatch(messagesError())
                })
        }
    }
}

export function add() {
    return (dispatch, getState) => {
        if (!getState().messages.loading) {
            dispatch(loading())
            API.user.getMessages(getState().messages.end_cursor)
                .then((res) => {
                    dispatch(addMessages(res))
                }).catch(() => {
                dispatch(messagesError())
            })
        }

    }
}

function loading() {
    return {
        type: "MESSAGES_LOADING",
        data: {
            loading: true,
        }
    }
}

function refreshing() {
    return {
        type: "MESSAGES_REFRESHING",
        data: {
            refreshing: true,
            loading: true,
        }
    }
}

function refreshMessages(newMessages) {
    return {
        type: "MESSAGES_REFRESH",
        data: {
            refreshing: false,
            loading: false,
            messages: newMessages,
            end_cursor: newMessages[newMessages.length - 1].id,
        }
    }
}

function addMessages(newMessages) {
    return {
        type: "MESSAGES_ADD",
        data: {
            refreshing: false,
            loading: false,
            messages: newMessages,
            end_cursor: newMessages[newMessages.length - 1].id,
        }
    }
}

function messagesError() {
    return {
        type: 'MESSAGES_ERROR',
        data: {
            loading: false,
            refreshing: false,
        }
    }
}