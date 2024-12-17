import { useAppContext } from '../contextApi/context';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { store } = useAppContext();
  const isLoginFromStore = store.user.isLogin;

  if (!isLoginFromStore) {
    return <Navigate to="/home" />;
  }

  return children;
}

export default PrivateRoute;
