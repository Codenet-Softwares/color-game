import { useEffect, useState } from "react";
import { useAppContext } from "../../contextApi/context";
import NavBar from "../common/navBar";
import {
  getInnerAnnouncement,
  user_getAllGames_api,
} from "../../utils/apiService";
import "./layout.css";
import strings from "../../utils/constant/stringConstant";
import SubFooter from "../common/SubFooter";
import { Link, useLocation } from "react-router-dom";

function Layout({ openBetData, handleOpenBetsSelectionMenu }) {
  const [user_allGames, setUser_allGames] = useState([]);
  const [announcementInnerData, setAnnouncemenInnertData] = useState([]);
  const { dispatch, store } = useAppContext();
  const location = useLocation();

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

  const fetchInnerAnnouncement = async () => {
    try {
      const response = await getInnerAnnouncement();
      if (response && response.data) {
        setAnnouncemenInnertData(response.data);
      } else {
        console.error("Error fetching announcements", response);
        setAnnouncemenInnertData([]);
      }
    } catch (error) {
      console.error("Error fetching announcements", error);
      setAnnouncemenInnertData([]);
    }
  };

  useEffect(() => {
    fetchInnerAnnouncement;
  }, []);

  function getNavBarOption() {
    return (
      <ul
        className="mb-0 d-flex bg-hover"
        style={{
          listStyleType: "none",
          overflowX: "auto",
          padding: 0,
          backgroundImage: "linear-gradient(-180deg, #F6A21E 0%, #F6A21E 100%)",
          fontSize: "15px",
        }}
      >
        <li
          key={0}
          className="p-2 text-black"
          style={{
            fontWeight: 600,
            backgroundColor:
              location.pathname === "/home" ? "#e9f4a6" : "transparent",
            cursor: "pointer",
          }}
        >
          <Link className=" text-decoration-none text-black" to={`/home`}>
            {"Home"}
          </Link>
        </li>
        {user_allGames.map((gameObj) => {
          const gamePath = `/gameView/${gameObj.gameName.replace(/\s/g, "")}/${
            gameObj.gameId
          }`;
          return (
            <li
              key={gameObj.gameId}
              className="p-2 text-black"
              style={{
                fontWeight: 600,
                backgroundColor:
                  location.pathname === gamePath ? "#e9f4a6" : "transparent",
                cursor: "pointer",
              }}
            >
              <Link
                className={`text-black text-decoration-none text-nowrap ${
                  gameObj.isBlink ? "blink_me" : ""
                }`}
                to={gamePath}
              >
                {gameObj.gameName}
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div>
      <div className="fixed-top">
        <NavBar
          handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
          openBetData={openBetData}
        />

        {store?.user?.isLogin &&user_allGames && getNavBarOption()}

      </div>
      {store?.user?.isLogin && ["/home", "/"].includes(location?.pathname) && (
        <div className="fixed-bottom">
          <SubFooter />
        </div>
      )}
    </div>
  );
}

export default Layout;
