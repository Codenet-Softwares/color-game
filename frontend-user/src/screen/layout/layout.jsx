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
import ansmt from "../../asset/ancmntv.png";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Lottery/firebaseStore/lotteryFirebase";

function Layout({ openBetData, handleOpenBetsSelectionMenu }) {
  const [user_allGames, setUser_allGames] = useState([]);
  const [announcementInnerData, setAnnouncemenInnertData] = useState([]);
  const [isAnnnoucementUpadte, setIsAnnnoucementUpadte] = useState(null);
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

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "whitelabel"), (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      messagesData.map((message) => {
        setIsAnnnoucementUpadte(message.updatedAt);
      });
    });

    return () => unsubscribe();
  }, []);

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
    fetchInnerAnnouncement();
  }, [isAnnnoucementUpadte]);

  return (
    <div>
      <div className="fixed-top">
        <NavBar
          handleOpenBetsSelectionMenu={handleOpenBetsSelectionMenu}
          openBetData={openBetData}
        />

        {/* {store?.user?.isLogin &&user_allGames && getNavBarOption()} */}
        {store.user.isLogin && ["/home", "/"].includes(location?.pathname) && (
          <div
            className="w-100 d-flex justify-content-between "
            style={{ background: "#294253" }}
          >
            <img src={ansmt} alt="Announcement" className="announcementImg" />
            <marquee className="text-white" style={{ fontSize: "18px" }}>
              {announcementInnerData
                .map((item) => item.announcement)
                .join(" | ")}
            </marquee>
            <span
              className="text-nowrap text-black px-2"
              style={{ fontSize: "14px" }}
            >
              {/* {formattedDate} */}
            </span>
          </div>
        )}
      </div>
      {store?.user?.isLogin && ["/home", "/"].includes(location?.pathname) && (
        <div className="fixed-bottom">
          <SubFooter isAnnnoucementUpadte ={isAnnnoucementUpadte}/>
        </div>
      )}
    </div>
  );
}

export default Layout;
