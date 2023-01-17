import { useEffect, useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Room, ROOM_ROUTE } from './features/poker/room';
import { LoginRoute } from './features/users/routes/login';
import { initialMeState, MeContext, meReducer, MeState } from './features/users/stores/me';
import { useLocalStorage } from './utils/local-storage';

const ME_STORAGE_KEY = 'me'

function App() {
  const [storageState, setStorageState] = useLocalStorage(ME_STORAGE_KEY, initialMeState);
  const [state, dispatch] = useReducer(meReducer, storageState);


  useEffect(() => {
    setStorageState(state);
  }, [state])

  return (
    <MeContext.Provider value={[state, dispatch]}>
      <Router>
        <Switch>
          <Route path={ROOM_ROUTE}>
            <Room />
          </Route>
          <LoginRoute />
        </Switch>
      </Router>
    </MeContext.Provider>
  );
}

export default App;
