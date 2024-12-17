import strings from '../utils/constant/stringConstant';
import { getUserInitialState, getUserPlaceBidding, getUserWalletInitialState } from '../utils/getInitiateState';

export const reducer = (state, action) => {
  switch (action.type) {
    case strings.LOG_IN:
      return {
        ...state, user: getUserInitialState(action.payload) 
        
      };
      
    case strings.LOG_OUT:
      return {
        ...state,
        user: getUserInitialState({ isLogin: false }),
      };

    case strings.Name:
      return {
        ...state,
        user: action.payload,
      };

    case strings.Announcement:
      return {
        ...state,
        announcement: action.payload,
      };

    case strings.UserWallet:
      return {
        ...state,
        user: getUserInitialState({
          ...state.user,
          wallet: action.payload,
        }),
      };

    case strings.placeBidding:
      return {
        ...state,
        placeBidding: getUserPlaceBidding({
          ...state.placeBidding,
          ...action.payload,
        }),
      };

    // case strings.isLoading:
    //   return {
    //     ...state,
    //     isLoading: action?.payload ? [...state?.isLoading, true] : state?.isLoading?.slice(0, -1),
    //   };

    case strings.isLoading:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};
