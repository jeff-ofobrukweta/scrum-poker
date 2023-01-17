import { Route } from 'react-router';

import { Login } from './Login';

export const LOGIN_ROUTE = '/';

export const LoginRoute = () => (
  <Route path={LOGIN_ROUTE}>
    <Login />
  </Route>
);