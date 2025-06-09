import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserLotteryMarket_api } from "../../../utils/apiService";
import AppDrawer from "../appDrawer";
import Layout from "../../layout/layout";
import { useAppContext } from "../../../contextApi/context";
import Login from "../../loginModal/loginModal";

const LotteryMarketDashBoard = () => {
  const { dispatch, store } = useAppContext();
  const { gameName, marketId } = useParams();
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
   const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const navigate = useNavigate();

  // Fetch market data
  const fetchMarketData = async () => {
    setLoading(true);

    const response = await getUserLotteryMarket_api({ marketId });
    if (response && response.success) {
      setMarketData(response.data);
    } else {
      setMarketData(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchMarketData();
  }, [marketId]);

  // Function to render the body
  const getBody = () => {

  const handleMarketClick = (marketId) => {
      if (store.user.isLogin) {
        navigate(`/lottoPurchase/${marketId}`);
      } else {
        setShowLogin(true);
        localStorage.setItem(
          "lotteryPath",
          JSON.stringify({
            isLotterypath: true,
            pathName: `/lottoPurchase/${marketId}`,
          })
        );
      }
    };

    return (
      <div className=" p-3 mt-5 mt-sm-2">
        {loading ? (
          <div className="text-center ">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-3">Loading market data...</p>
          </div>
        ) : marketData?.length > 0 ? (
          marketData?.map((marketDataItem, index) => (
            <div
              key={index}
              className="row mx-0 my-3 p-4"
              onClick={() => handleMarketClick(marketDataItem.marketId)}
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
              style={{
                backgroundColor: "#2CB3D1",
                borderRadius: "16px",
                cursor: "pointer",
                overflow: "hidden",
              }}
            >
              {/* Market Header */}
              <div className="row mx-0 px-2 align-items-center">
                <span className="col-12 text-light font-weight-bold text-center">
                  <h6
                    className="fw-bold text-wrap"
                    style={{
                      fontSize: "22px",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                      borderBottom: "2px solid #ddd",
                      paddingBottom: "12px",
                      transition: "color 0.3s ease",
                      color: hoveredCardIndex === index ? "#E67E22" : "#F1C40F",
                    }}
                  >
                    Market: {marketDataItem?.marketName ?? "Unknown"}
                  </h6>
                </span>
              </div>

              {/* Range Details */}
              <div className="row mx-0 px-2 mt-3 text-muted text-center">
                <div className="col-md-3 col-sm-6 mb-3">
                  <p className="m-0">
                    <strong className="text-dark">Group Range:</strong>
                  </p>
                  <p className="m-0 text-dark">
                    {marketDataItem?.group_start ?? "N/A"} -{" "}
                    {marketDataItem?.group_end ?? "N/A"}
                  </p>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <p className="m-0 text-dark">
                    <strong className="text-dark">Series Range:</strong>
                  </p>
                  <p className="m-0 text-dark">
                    {marketDataItem?.series_start ?? "N/A"} -{" "}
                    {marketDataItem?.series_end ?? "N/A"}
                  </p>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <p className="m-0 text-dark">
                    <strong className="text-dark">Number Range:</strong>
                  </p>
                  <p className="m-0 text-dark">
                    {marketDataItem?.number_start ?? "N/A"} -{" "}
                    {marketDataItem?.number_end ?? "N/A"}
                  </p>
                </div>
                <div className="col-md-3 col-sm-6 mb-3">
                  <p className="m-0 text-dark">
                    <strong className="text-dark">Price:</strong>
                  </p>
                  <p
                    className="m-0 fw-bold"
                    style={{
                      color: "#b846a7",
                      fontWeight: "bold",
                      animation: "blinker 1s linear infinite",
                    }}
                  >
                    {marketDataItem?.price
                      ? `₹ ${marketDataItem.price}`
                      : "N/A"}
                  </p>
                </div>
              </div>

              {showLogin && (
                <Login showLogin={showLogin} setShowLogin={setShowLogin} />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-5">
            <p className="text-danger" style={{ fontSize: "18px" }}>
              No market data found.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Main return
  return (
    <>
      <div style={{ marginTop: `${!store.user.isLogin ? "150px" : ""}` }}>
        <Layout />
      </div>
      <div>
        <AppDrawer showCarousel={true} isMobile={false} isHomePage={true}>
          {getBody()}
        </AppDrawer>
      </div>
    </>
  );
};

export default LotteryMarketDashBoard;
