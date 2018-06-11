import { NavigationActions, StateUtils, StackActions } from 'react-navigation';

const defaultConfig = {
  rootName: 'root',
  loginName: 'login',
  topRoutes: ['login', 'root', 'home', 'shop', 'my'],
};
const AppNav = {
  navigatorInstance: null,
  defaultGetStateForAction: null,
  generateKey() {
    return `{id-${Date.now()}}-${this.uuidCount++}`;
  },
  clone(state) {
    return state && JSON.parse(JSON.stringify(state));
  },
  getCurRouteByState(navState) {
    if (!navState) {
      return null;
    }
    const route = navState.routes[navState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getCurRouteByState(route);
    }
    return route;
  },
  /**
   * 返回当前页
   */
  getCurRoute() {
    const navState = this.navigatorInstance.state.nav;
    return this.getCurRouteByState(navState);
  },

  dispatch(action) {
    if (this.navigatorInstance) {
      this.navigatorInstance.dispatch(action);
    }
  },

  test(routeName, params) {
    this.dispatch({ type: 'test', routeName, params });
  },
  routeTest(action, state) {
    /**
     * 1、tab 根页面跳转处理，如从tabtest(tabindex=3)跳到home(tabindex=0)
     * 此时state结构为：
     * {
     *  key:"StackRouterRoot",
     *  isTransition:false,
     *  index:0,
     *  routes:[
     *    {
     *      index:3,//当前tab的选中页
     *      key:...,
     *      isTransition:...,
     *      routeName:'tab',
     *      routes:[{tab0},{tab1},{tab2}...]
     *    }
     *  ],
     * }
     * 处理的时候只需要修改routes[0]的index的值即可:
     *   const nextState = this.clone(state);
     *   nextState.routes[0].index = 0;
     * 2、tab根页面跳转，如从tabtest(tabindex=3),此时打开了一个test page，
     *    在test上跳到home页(tabindex=0)
     */
    const nextState = this.clone(state);
    nextState.index = 0;
    nextState.routes[0].index = 0;
    return nextState;
  },

  nav(routeName, params) {
    const newAction = NavigationActions.navigate({ routeName, params });
    this.dispatch(newAction);
  },

  root(routeName, params) {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'root', action: NavigationActions.navigate({ routeName, params }) }),
      ],
    });
    this.dispatch(resetAction);
  },
  /**
   * 依据action新建路由，返回新的state
   * 此时新路由处于栈顶
   */
  crtNewState(action, state) {
    return this.defaultGetStateForAction({
      ...action,
      type: 'Navigation/NAVIGATE',
    }, state);
  },

  replace(routeName, params) {
    this.dispatch({ type: 'replace', routeName, params });
  },
  routeReplace(action, state) {
    let nextState = this.clone(state);

    const curRoute = state.routes[state.routes.length - 1];
    if (curRoute.routeName === defaultConfig.rootName) {
      return nextState;
    }

    const newRoute = nextState.routes[nextState.routes.length - 1];
    newRoute.key = this.generateKey();
    newRoute.params = action.params;
    newRoute.routeName = action.routeName;

    const newRoutes = nextState.routes.slice(0, -1);
    newRoutes.push(newRoute);
    nextState = {
      ...nextState,
      routes: newRoutes,
      index: newRoutes.length - 1,
    };
    return nextState;
  },

  path(routeNames, params) {
    this.dispatch({ type: 'path', routeNames, params });
  },
  routePath(action, state) {
    const topRoutes = defaultConfig.topRoutes;
    let routes = action.routeNames || [];
    const params = action.params || {};
    const firstRouteName = routes[0];
    let nextState = this.clone(state);
    const firstPage = nextState.routes[0];

    if (!firstRouteName) return state;
    routes = [firstRouteName, ...routes.slice(1).filter(v => topRoutes.indexOf(v) === -1)];

    if (firstPage.routes && topRoutes.indexOf(firstRouteName) !== -1) {
      firstPage.routes.forEach((r, i) => {
        if (r.routeName === firstRouteName) {
          r.params = params;
          if (i !== firstPage.index) {
            firstPage.index = i;
          }
        }
      });
    }
    nextState = {
      ...nextState,
      index: 0,
      routes: [firstPage],
    };
    for (const r of routes) {
      if (topRoutes.indexOf(r) === -1) {
        nextState = this.crtNewState({ routeName: r, params }, nextState);
      }
    }
    return nextState;
  },

  back(routeName, params) {
    if (routeName) {
      this.dispatch({ type: 'back', routeName, params });
    } else {
      this.dispatch(NavigationActions.back());
    }
  },
  routeBack(action, state) {
    let nextState = this.clone(state);
    let i = nextState.routes.length - 1;
    for (; i > -1; i--) {
      if (nextState.routes[i].routeName === action.routeName) {
        break;
      }
    }
    if (i < 0) {
      if (action.subName) {
        Object.assign(action, {
          routeName: action.routeName,
          params: action.params,
          action: NavigationActions.navigate({
            routeName: action.subName,
            params: action.subParams,
          }),
        });
      }
      nextState = StateUtils.pop(nextState);
      nextState = this.crtNewState(action, nextState);
    } else {
      let count = nextState.routes.length;
      while (count > i + 1) {
        nextState = StateUtils.pop(nextState);
        count--;
      }
      nextState = { ...nextState };
      if (action.routeName === defaultConfig.rootName) {
        const subAction = action.action || {};
        const tabRoute = nextState.routes[i];
        const subName = action.subName || subAction.routeName;

        if (subName) {
          let tabIndex = 0;
          subRoute = tabRoute.routes.find((route, i) => {
            if (route.routeName === subName) {
              tabIndex = i;
              return true;
            }
            return false;
          });
          let subRoute = tabRoute.routes[tabIndex];
          tabRoute.index = tabIndex;
          subRoute.params = action.subParams || subAction.params;
        }
        tabRoute.params = action.params;
      } else {
        nextState.routes[i].params = action.params;
      }
    }
    return nextState;
  },
};
export default AppNav;
