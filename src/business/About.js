import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import AppNav from '../AppNav';

export default class Page extends Component {
  test() {

  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>About</Text>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            AppNav.root('my');
          }}
        >
          <View>
            <Text>回到我的页</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
