import About from '../business/About';
import Login from '../business/Login';

export default {
  about: {
    screen: About,
    path: 'about',
    navigationOptions: {
      title: '关于',
    },
  },
  login: {
    screen: Login,
    path: 'login',
    navigationOptions: {
      header: null,
    },
  },
};
