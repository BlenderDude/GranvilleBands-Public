import store from "./store/configureStore"

const API_BASE = "https://gbands.danielabdelsamed.com/api/"

export default API = {
    posts: {
        request: (amount, startCursor = null) => {
            const url = API_BASE + "posts/request/" + parseInt(amount)
            if (startCursor !== null) {
                return apiFetch(url, true, {startCursor})
            }
            return apiFetch(url, true)
        },
        single: (id) => {
            const url = API_BASE + "posts/requestsingle/" + id
            return apiFetch(url, true)
        },
        leaderboard() {
            const url = API_BASE + "posts/leaderboard"
            return apiFetch(url, true)
        }
    },
    user: {
        auth: (id, token) => {
            const url = API_BASE + "useraccount/auth"
            return apiAuth(url, id, token)
        },
        login: (username, password) => {
            const url = API_BASE + "useraccount/login"
            return apiFetch(url, false, {
                username,
                password,
            })
        },
        register: (first_name, last_name, username, password) => {
            const url = API_BASE + "useraccount/register"
            return apiFetch(url, false, {
                first_name,
                last_name,
                username,
                password,
            })
        },
        setToken: (token, os) => {
            const url = API_BASE + "useraccount/settoken"
            return apiFetch(url, true, {token, os})
        },
        getNotifications: (start) => {
            const url = API_BASE + "useraccount/getnotifications/" + (start || "")
            return apiFetch(url, true)
        },
        getMessages: (start) => {
            const url = API_BASE + "useraccount/getmessages/" + (start || "")
            return apiFetch(url, true)
        },
        changeProfilePhoto: (profilePhotoURI) => {
            return new Promise((resolve, reject) => {
                const url = API_BASE + "useraccount/changeprofilephoto"
                var photo = {
                    uri: profilePhotoURI,
                    type: 'image/jpeg',
                    name: 'photo.jpg',
                };

                var formData = new FormData();
                formData.append("photo", photo);

                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);

                xhr.upload.addEventListener("progress", (progress) => {
                    store.dispatch({type: "USER_PROFILE_PHOTO_PROGRESS", data: progress.loaded / progress.total})
                })

                xhr.onreadystatechange = (e) => {
                    if (xhr.readyState !== 4) {
                        return;
                    }

                    if (xhr.status === 200) {
                        const res = JSON.parse(xhr.responseText).body
                        resolve(res)
                    } else {
                        reject()
                    }
                };


                const {id, token} = store.getState().user
                xhr.setRequestHeader("Id", id);
                xhr.setRequestHeader("Token", token);

                xhr.send(formData);
            })
        }

    },
    users: {
        search(query) {
            const url = API_BASE + `users/search`
            return apiFetch(url, true, {query})
        }
    },
    post: (id) => {
        return {
            like() {
                const url = API_BASE + "posts/like/" + id
                return apiFetch(url, true)
            },
            dislike() {
                const url = API_BASE + "posts/dislike/" + id
                return apiFetch(url, true)
            },
            comment(comment) {
                const url = API_BASE + "posts/comment/" + id
                return apiFetch(url, true, {
                    comment
                })
            },
            remove() {
                const url = API_BASE + "posts/delete/" + id
                return apiFetch(url, true)
            },
            report(reason) {
                const url = API_BASE + "posts/report/" + id
                return apiFetch(url, true, {reason})
            },
            updateCaption(caption) {
                const url = API_BASE + "posts/updatecaption/" + id
                return apiFetch(url, true, {caption})
            },
            photo(photoId) {
                return {
                    remove() {
                        const url = API_BASE + "posts/removephoto/" + id + "/" + photoId
                        return apiFetch(url, true)
                    }
                }
            },
        }
    },
    userData: (id) => {
        return {
            getPosts: (amount, startCursor = null) => {
                const url = API_BASE + `posts/requestbyuser/${id}/${parseInt(amount)}`
                if (startCursor !== null) {
                    return apiFetch(url, true, {startCursor})
                }
                return apiFetch(url, true)
            },
            getUserData: () => {
                const url = API_BASE + `users/userdata/${id}`
                return apiFetch(url, true)
            },
            block: () => {
                const url = API_BASE + `users/block/${id}`
                return apiFetch(url, true)
            },
            unblock() {
                const url = API_BASE + `users/unblock/${id}`
                return apiFetch(url, true)
            }
        }
    },
    trip: {
        getEvents() {
            const url = API_BASE + `itinerary/fetchevents`
            return apiFetch(url, true)
        }
    }
}

function apiFetch(url, useAuthentication, body = {}) {
    let headers = new Headers();
    // const ID = global.id
    // const TOKEN = global.token
    if (useAuthentication) {
        const {id, token} = store.getState().user
        headers.append("Id", id);
        headers.append("Token", token);
    }

    let conf = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify(body)
    };


    return new Promise((resolve, reject) => {
        fetch(url, conf).then(res => res.json()).then((json) => {
            // console.log({
            //     url,
            //     json
            // })
            if (json.success) {
                resolve(json.body)
            } else {
                reject(json.errors)
            }
        }).catch(errors => reject(errors))
    });
}

function apiAuth(url, id, token) {
    let headers = new Headers();
    headers.append("Id", id);
    headers.append("Token", token);

    let conf = {
        method: 'POST',
        headers: headers,
        mode: 'cors',
        cache: 'default',
    };

    return new Promise((resolve, reject) => {
        fetch(url, conf).then(res => res.json()).then((json) => {
            if (json.success) {
                resolve(json.body)
            } else {
                reject(json.errors)
            }
        }).catch(error => reject(error))
    });
}