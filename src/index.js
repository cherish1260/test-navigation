/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  YellowBox,
} from 'react-native';

// 根目录缓存，防止重新创建
let AppRootCache;
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated in plain JavaScript React classes.',
  'Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).',
]);
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTab: false,
    };
  }
  componentDidMount() {
    this.initRoot();
  }
  initRoot = () => {
    if (!AppRootCache) {
      AppRootCache = require('./AppNav/StackNav').default;
    }
    if (!this.state.showTab) {
      this.setState({
        showTab: true,
      });
    }
    // });
  }
  render() {
    if (this.state.showTab) {
      return (<AppRootCache uriPrefix="nsip://" screenProps={this.props} />);
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
  }
}
