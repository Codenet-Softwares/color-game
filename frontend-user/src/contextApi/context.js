import { createContext, useContext, useReducer, useEffect } from 'react';
import { reducer } from './reducer';
import strings from '../utils/constant/stringConstant';
import { getUserInitialState, getUserWalletInitialState, getUserPlaceBidding } from '../utils/getInitiateState';

const AppContext = createContext();

const initialState = {
  user: getUserInitialState(),
  announcement: [],
  appDrawer: [],
  isLoading: false,
  placeBidding: getUserPlaceBidding(),
};

const AppProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState, () => {
    // Load state from local storage if available
    const storedState = localStorage.getItem(strings.LOCAL_STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : initialState;
  });

  // Save state to local storage whenever it changes
  useEffect(() => {
    const dummyStore = { ...store };
    // delete dummyStore.isLoading
    localStorage.setItem(strings.LOCAL_STORAGE_KEY, JSON.stringify(dummyStore));
  }, [store]);

  return <AppContext.Provider value={{ store, dispatch }}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
