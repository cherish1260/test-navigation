import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';
import AppNav from '../AppNav';

export default class Page extends Component {
  test() {

  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableHighlight
          onPress={() => {
            // AppNav.nav('about');
            AppNav.root('home');
          }}
          underlayColor="transparent"
        >
          <View>
            <Text>welcome</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}
