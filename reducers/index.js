import {combineReducers} from 'redux'
import {posts} from './postsReducer'
import {user} from './userReducer'
import {users} from './usersReducer'
import {notifications} from './notificationsReducer'
import {trip} from './tripReducer'
import {messages} from './messagesReducer'

export default combineReducers({
    posts,
    user,
    users,
    notifications,
    trip,
    messages,
});