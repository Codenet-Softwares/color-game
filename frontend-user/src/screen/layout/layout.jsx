import { useEffect, useState } from "react";
import { useAppContext } from "../../contextApi/context";
import NavBar from "../common/navBar";
import { user_getAllGames_api } from "../../utils/apiService";
import "./layout.css";
import strings from "../../utils/constant/stringConstant";
import SubFooter from "../common/SubFooter";
import { Link } from 'react-router-dom';

function Layout() {
  const [user_allGames, setUser_allGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { dispatch, store } = useAppContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        className="mb-0 d-flex bg-hover"
        style={{
          listStyleType: "none",
          overflowX: "auto",
          padding: 0,
          backgroundColor: "rgb(23 101 119)",
          fontSize: "18px",
        }}
      >
        <li
          key={0}
          className="p-2 text-white"
          style={{
            fontWeight: 600,
            backgroundColor: activeIndex === 0 ? "#5ECBDD" : "transparent",
            cursor: "pointer",
          }}
          onClick={() => setActiveIndex(0)}
        >
          <Link 
            className=" text-decoration-none text-white"
            to={`/home`}
            style={{}}
            >
            {"Home"}
          </Link>
        </li>
        {user_allGames.map((gameObj, index) => (
          <li
            key={index + 1}
            className="p-2 text-white"
            style={{
              fontWeight: 600,
              backgroundColor:
                activeIndex === index + 1 ? "#5ECBDD" : "transparent",
              cursor: "pointer",
            }}
            onClick={() => setActiveIndex(index + 1)}
          >
            <Link
              className={`text-white text-decoration-none text-nowrap ${
                gameObj.isBlink ? "blink_me" : ""
              }`}
              to={`/gameView/${gameObj.gameName.replace(/\s/g, "")}/${
                gameObj.gameId
              }`}
            >
              {gameObj.gameName}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <div className="fixed-top">
        <NavBar />
        {user_allGames && getNavBarOption()}
      </div>
      {store?.user?.isLogin && (
        <div className="fixed-bottom">
          <SubFooter />
        </div>
      )}
    </div>
  );
}

export default Layout;
