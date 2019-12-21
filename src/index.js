import React, {Component} from 'react';
import {YellowBox, StatusBar} from 'react-native';
import CodePush from 'react-native-code-push';
import OneSignal from 'react-native-onesignal';
import {Provider} from 'react-redux';

import {PersistGate} from 'redux-persist/integration/react';

import './config/ReactotronConfig';

import App from './App';
import {store, persistor} from './store';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated',
  'Unrecognized WebSocket',
  'Unrecognized WebSocket connection option(s)',
]);

const codePushOptions = {checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME};

class Index extends Component {
  constructor(props) {
    super(props);
    OneSignal.init('f9cca40a-a416-4f80-8f97-89ed90a82724');

    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = data => {
    // console.log('data user:', data);
  };

  onOpened = notification => {};

  onIds = id => {
    // console.log('ID user:', id);
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

// export default Index;

export default CodePush({codePushOptions})(Index);
