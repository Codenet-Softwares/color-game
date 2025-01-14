import React, { useEffect, useState } from "react";
import "../common.css";
import { user_getAllGamesWithMarketData_api } from "../../../utils/apiService";
import { useAppContext } from "../../../contextApi/context";
import strings from "../../../utils/constant/stringConstant";
import { toast } from "react-toastify";
import AppDrawer from "../appDrawer";
import { Link } from "react-router-dom";

const GetwholeMarket = () => {
  const [user_allGamesWithMarketData, setUser_allGamesWithMarketData] =
    useState([]);

  const { store, dispatch } = useAppContext();
  console.log("store", store);

  useEffect(() => {
    user_getAllGamesWithMarketData();
  }, []);

  const handleGameId = (id) => {
    dispatch({
      type: strings.placeBidding,
      payload: { gameId: id },
    });
  };

  async function user_getAllGamesWithMarketData() {
    const response = await user_getAllGamesWithMarketData_api();
    if (response) {
      setUser_allGamesWithMarketData(response.data);
    }
  }

  return (
    <>
      {/* <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}> */}
      <div className="row p-0 m-0">
        {user_allGamesWithMarketData &&
          user_allGamesWithMarketData.slice(0, 3).map((gameWithMarketData) => {
            return (
              <>
                <div
                  className="col-12 p-1 mt-2"
                  style={{ backgroundColor: "#a1aed4" }}
                >
                  {gameWithMarketData.gameName}
                </div>
                {gameWithMarketData &&
                  gameWithMarketData.markets.slice(0, 3).map((marketData) => {
                    return (
                      <div
                        className="row p-0 m-0"
                        style={{ backgroundColor: "white" }}
                      >
                        <div className="row py-1 px-0 m-0 ">
                          {/* Runner Name and Balance */}
                          <span className="col-4 text-dark text-decoration-none text-nowrap">
                            {marketData?.marketName}
                          </span>

                          {/* Back and Lay Rates */}
                          <div
                            className="col-4"
                            style={{ backgroundColor: "lightblue" }}
                          >
                            {marketData?.runners[0]?.rate[0]?.back ?? "N/A"}
                          </div>

                          <div
                            className="col-4"
                            style={{ backgroundColor: "pink" }}
                          >
                            {marketData?.runners[0]?.rate[0]?.lay ?? "N/A"}
                          </div>
                        </div>
                        {/* );
                            }
                          )} */}
                      </div>
                    );
                  })}
                {gameWithMarketData.markets.length > 0 ? (
                  <Link
                    className={`col-12 text-dark text-decoration-none text-nowrap`}
                    to={`/gameView/${gameWithMarketData?.gameName?.replace(
                      /\s/g,
                      ""
                    )}/${gameWithMarketData?.gameId}`}
                    style={{ textAlign: "right" }}
                    onClick={() => handleGameId(gameWithMarketData?.gameId)}
                  >
                    View more
                  </Link>
                ) : (
                  <p
                    className="text-center pt-1"
                    style={{ backgroundColor: "orange" }}
                  >
                    No market
                  </p>
                )}
              </>
            );
          })}
      </div>
      {/* </AppDrawer> */}
    </>
  );
};

export default GetwholeMarket;
