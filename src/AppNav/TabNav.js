import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Home, My } from '../business';

const TabNav = createBottomTabNavigator(
  {
    home: {
      screen: Home,
      path: 'home',
    },
    my: {
      screen: My,
      path: 'my',
    },
  },
  {
    initialRouteName: 'home',
    backBehavior: 'none',
    navigationOptions: ({ navigation }) => ({
      tabBarLabel: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let title = '';
        if (routeName === 'home') {
          title = '首页';
        } else if (routeName === 'my') {
          title = '我的';
        }
        return <Text style={{ fontSize: 12, color: tintColor }}>{title}</Text>;
      },
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'home') {
          iconName = 'home';
        } else if (routeName === 'my') {
          iconName = 'user';
        }
        return <Icon name={iconName} size={25} color={tintColor} />;
      },
      header: null,
    }),
    tabBarOptions: {
      activeTintColor: '#B88E5B',
      inactiveTintColor: '#A7A9AC',
      // style: {
      //   backgroundColor: '#393836',
      //   paddingTop: 5,
      //   borderTopColor: '#cccccc',
      // },
    },
  },
);
export default TabNav;

