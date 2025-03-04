import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { reducer } from "./reducer";
import strings from "../utils/constant/stringConstant";
import { getUserInitialState } from "../utils/getInitiateState";
import { userWallet } from "../services/userWallet"; // Ensure this import is correct

const AppContext = createContext();

const initialState = {
  user: getUserInitialState(),
  announcement: [],
  appDrawer: [],
  isLoading: false,
  placeBidding: [],
};

const AppProvider = ({ children }) => {
  const [store, dispatch] = useReducer(reducer, initialState, () => {
    const storedState = localStorage.getItem(strings.LOCAL_STORAGE_KEY);
    return storedState ? JSON.parse(storedState) : initialState;
  });

  // Function to fetch and update wallet balance dynamically
  const fetchWalletBalance = useCallback(async () => {
    const userId = store.user.userId;
    if (!userId) return;

    try {
      const response = await userWallet(userId, false, dispatch);
      if (response?.data) {
        const { balance, walletId, marketListExposure } = response.data;

        // Calculate total exposure from marketListExposure
        const totalExposure = marketListExposure?.reduce((acc, market) => {
          const exposureValue = Object.values(market)[0] || 0;
          return acc + exposureValue;
        }, 0);

        dispatch({
          type: strings.UserWallet,
          payload: {
            balance,
            walletId,
            marketListExposure,
            exposure: totalExposure,
          },
        });
      }
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  }, [store.user.userId, dispatch]);

  // Function to update wallet and exposure after any API call
  const updateWalletAndExposure = () => {
    fetchWalletBalance();
  };

  // Fetch wallet balance after login
  useEffect(() => {
    if (store.user.isLogin) {
      fetchWalletBalance();
    }
  }, [store.user.isLogin, fetchWalletBalance]);

  // Save state to local storage whenever it changes
  useEffect(() => {
    const dummyStore = { ...store };
    localStorage.setItem(strings.LOCAL_STORAGE_KEY, JSON.stringify(dummyStore));
  }, [store]);

  return (
    <AppContext.Provider value={{ store, dispatch, fetchWalletBalance, updateWalletAndExposure }}>
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext };
