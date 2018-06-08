import React from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { createStackNavigator, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabNav from './TabNav';
import AppNav from './index';
import Route from './Route';

let isTransitioning = false;
const isAndroid = Platform.OS === 'android';
const CustomStackNav = createStackNavigator(
  {
    root: {
      screen: TabNav,
      path: 'root',
      navigationOptions: {
        header: null,
      },
    },
    ...Route,
  },
  {
    initialRouteName: 'login',
    onTransitionStart: () => {
      isTransitioning = true;
    },
    onTransitionEnd: () => {
      isTransitioning = false;
    },
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#FFFFFF',
      },
      headerTitleStyle: {
        color: '#333333',
        fontSize: 18,
      },
      headerTintColor: '#333333',
      headerLeft: () => (
        <Icon
          name="angle-left"
          color="gray"
          style={{
            marginTop: 5,
            padding: 10,
            width: isAndroid ? 56 : 44,
            height: isAndroid ? 56 : 44,
            alignItems: 'center',
            textAlign: 'center',
            textAlignVertical: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}
        />
      ),
    }),
  },
);

function getCurRouteName(navState) {
  if (!navState) {
    return null;
  }
  const route = navState.routes[navState.index];
  if (route && route.routes) {
    return getCurRouteName(route);
  }
  return (route && route.routeName) || null;
}

function handleMessage(eventName, state, nextState, action) {
  const nextScreen = getCurRouteName(nextState);
  const currentScreen = getCurRouteName(state);
  if (nextScreen !== currentScreen) {
    let params = null;
    if (eventName === 'pageBeforeChange') {
      params = {
        page: currentScreen,
        nextPage: nextScreen,
        state,
        nextState,
        action,
        next: () => {
          this.dispatch(action);
        },
      };
    } else if (eventName === 'pageChange') {
      params = {
        page: currentScreen,
        prevPage: nextScreen,
        state,
        nextState,
      };
    }
    console.log(params);
  }
}

/**
 * 添加自定义导航器操作类型action=path
 */
const defaultGetStateForAction = CustomStackNav.router.getStateForAction;
CustomStackNav.router.getStateForAction = (action, state) => {
  let nextState = null;
  if (state && isTransitioning && action.type !== NavigationActions.COMPLETE_TRANSITION) {
    console.log('======无效操作========');
    return nextState;
  }
  if (state && action.type === 'test') {
    nextState = AppNav.routeTest(action, state);
  } else if (state && action.type === 'back') {
    nextState = AppNav.routeBack(action, state);
  } else if (state && action.type === 'replace') {
    nextState = AppNav.routeReplace(action, state);
  } else if (state && action.type === 'path') {
    nextState = AppNav.routePath(action, state);
  } else {
    nextState = defaultGetStateForAction(action, state);
  }
  if (__DEV__ && action.type !== NavigationActions.COMPLETE_TRANSITION) {
    console.log(`==========test==========${action.type}`);
    console.log(action);
    console.log(state);
    console.log(nextState);
    console.log('========================');
  } else {
    console.log(`==========test==========${action.type}`);
  }
  handleMessage('pageBeforeChange', state, nextState, action);
  return nextState;
};
export default class HMStackNav extends React.Component {
  render() {
    console.log('========HMStackNav=========');
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <CustomStackNav
          {...this.props}
          uriPrefix="test://"
          ref={(nav) => {
            if (nav) {
              AppNav.navigatorInstance = nav;
              AppNav.defaultGetStateForAction = defaultGetStateForAction;
            }
          }}
          onNavigationStateChange={(prevState, state) => {
            handleMessage('pageChange', state, prevState);
          }}
        />
      </View>
    );
  }
}
