import React, {Component} from 'react';
import {
    AppRegistry,
} from 'react-native';
import codePush from 'react-native-code-push'

import {Provider} from 'react-redux';
import store from './store/configureStore';

import App from './App'

class granvillebands extends Component {
    codePushStatusDidChange(status) {
        switch (status) {
            case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for updates.");
                break;
            case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case codePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Installing update.");
                break;
            case codePush.SyncStatus.UP_TO_DATE:
                console.log("Up-to-date.");
                break;
            case codePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Update installed.");
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }

    render() {
        return (
            <Provider store={store}>
                <App/>
            </Provider>
        )
    }
}


AppRegistry.registerComponent('granvillebands', () =>
    codePush({
        checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
        installMode: codePush.InstallMode.ON_NEXT_SUSPEND
    })(granvillebands)
);

