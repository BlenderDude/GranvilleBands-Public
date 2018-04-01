import React, {Component} from 'react'
import {
    View,
    Modal,
    TouchableOpacity,
    Text,
    ActivityIndicator,
    Alert,
} from 'react-native'
import HamburgerButton from "./HamburgerButton";
import API from '../API'
import {connect} from 'react-redux'
import {block, unblock} from "../actions/users";
import {refresh} from "../actions/posts";

class UserActionModal extends Component {
    state = {
        modalOpen: false,
        blocking: false,
    }

    _block() {
        if (this.props.blocked) {
            this.props.unblock()
        } else {
            this.props.block()
        }
        this.props.refresh()
    }

    render() {
        const {id} = this.props
        return (
            <View>
                <HamburgerButton
                    onPress={() => this.setState({modalOpen: true})}
                />
                <Modal
                    transparent
                    animationType="fade"
                    visible={this.state.modalOpen}
                    onRequestClose={() => this.setState({modalOpen: false})}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <View>
                            <View
                                style={{
                                    borderRadius: 15,
                                    backgroundColor: '#fff',
                                    marginBottom: 15,
                                }}
                            >
                                <Button
                                    title={this.props.name}
                                    disabled
                                />
                            </View>
                            <View
                                style={{
                                    borderRadius: 15,
                                    backgroundColor: '#fff',
                                }}
                            >
                                {id !== this.props.appUser.id ?
                                    <View>
                                        <Button
                                            title={this.props.blocked ? "Unblock" : "Block"}
                                            onPress={this._block.bind(this)}
                                            activity={this.state.blocking}
                                        />
                                        <Separator/>
                                    </View>
                                    :
                                    null
                                }

                                <Button
                                    title="Close"
                                    onPress={() => this.setState({modalOpen: false})}
                                />

                            </View>
                        </View>

                    </View>

                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state, props) => {
    const {id} = props
    return {
        appUser: state.user,
        blocked: (state.users.users[id] || {blocked: false}).blocked
    }
}
const mapDispatchToProps = (dispatch, props) => {
    const {id} = props
    return {
        block: () => dispatch(block(id)),
        unblock: () => dispatch(unblock(id)),
        refresh: () => dispatch(refresh()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserActionModal)

const MODAL_WIDTH = 300

const Button = ({title, onPress, activity = false, disabled = false}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: MODAL_WIDTH,
                height: 50,
                flexDirection: 'row',
            }}
            disabled={disabled}
        >
            <Text>{title}</Text>
            {activity ?
                <ActivityIndicator
                    style={{
                        marginLeft: 10,
                    }}
                    animating
                />
                : null}

        </TouchableOpacity>
    )
}

const Separator = () => {
    return (
        <View
            style={{
                height: 0.5,
                width: MODAL_WIDTH,
                backgroundColor: '#ccc'
            }}
        />
    )
}