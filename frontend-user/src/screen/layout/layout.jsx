import { useEffect, useState } from 'react';
import { useAppContext } from '../../contextApi/context';
import NavBar from '../common/navBar';
import { user_getAllGames_api } from '../../utils/apiService';
import './layout.css';
import strings from '../../utils/constant/stringConstant';

function Layout() {
  const [user_allGames, setUser_allGames] = useState([]);

  const { dispatch } = useAppContext();

  useEffect(() => {
    user_getAllGames();
  }, []);

  async function user_getAllGames() {
    dispatch({
      type: strings.isLoading,
      payload: true,
    });
    const response = await user_getAllGames_api();
    if (response) {
      setUser_allGames(response.data);
    }
    dispatch({
      type: strings.isLoading,
      payload: false,
    });
  }

  function getNavBarOption() {
    return (
      <ul
        className="mb-0 d-flex"
        style={{
          listStyleType: "none",
          overflowX: "auto",
          padding: 0,
          backgroundColor: "rgb(23 101 119)",
        }}
      >
        <li key={0} className="p-2 text-white" style={{ fontWeight: 600 }}>
          <a className=" text-decoration-none" href={`/home`}>
            {"Home"}
          </a>
        </li>
        {user_allGames.map((gameObj, index) => (
          <li
            key={index + 1}
            className="p-2 text-white"
            style={{ fontWeight: 600 }}
          >
            <a
              className={`text-white text-decoration-none text-nowrap ${
                gameObj.isBlink ? "blink_me" : ""
              }`}
              href={`/gameView/${gameObj.gameName.replace(/\s/g, "")}/${
                gameObj.gameId
              }`}
            >
              {gameObj.gameName}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="fixed-top">
      <NavBar />
      {user_allGames && getNavBarOption()}
    </div>
  );
}

export default Layout;
