import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import AppNav from '../AppNav';

export default class Page extends Component {
  test() {

  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home</Text>
        <TouchableHighlight
          onPress={() => {
            // AppNav.nav('about');
            AppNav.path(['my', 'about']);
          }}
          underlayColor="transparent"
        >
          <View>
            <Text>关于</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
