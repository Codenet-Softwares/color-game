import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
        window.location.href = `/lottery/${marketId}`;
      } else {
        setShowLogin(true);
      }
    };

    return (
      <div className="">
        {loading ? (
          <div className="text-center py-5">
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
              style={{
                backgroundColor: "#2CB3D1", 
                borderRadius: "16px",
                // boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                // transition: "transform 0.3s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                overflow: "hidden",
                // borderLeft: "8px solid #F1C40F",
              }}
              // onMouseEnter={(e) => {
              //   e.currentTarget.style.transform = "scale(1.05)";
              //   e.currentTarget.style.boxShadow =
              //     "0 16px 32px rgba(0, 0, 0, 0.15)";
              // }}
              // onMouseLeave={(e) => {
              //   e.currentTarget.style.transform = "scale(1)";
              //   e.currentTarget.style.boxShadow =
              //     "0 8px 16px rgba(0, 0, 0, 0.1)";
              // }}
            >
              {/* Market Header */}
              <div
                className="row mx-0 px-2 align-items-center"
                onClick={() => handleMarketClick(marketDataItem.marketId)}
                style={{
                  cursor: "pointer",
                }}
              >
                <span
                  className="col-12 text-light font-weight-bold text-uppercase text-center"
                  style={{
                    fontSize: "22px", 
                    color: "#F1C40F", 
                    borderBottom: "2px solid #ddd",
                    paddingBottom: "12px",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#E67E22")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#F1C40F")
                  }
                >
               <h6 className="fw-bold text-warning">Market: {marketDataItem?.marketName ?? "Unknown"}</h6> 
                </span>
              </div>

              {/* Range Details */}
              <div className="row mx-0 px-2 mt-3 text-muted">
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
                  <p className="m-0 text-dark">
                    {marketDataItem?.price
                      ? `₹ ${marketDataItem.price}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              {showLogin && <Login showLogin={showLogin} setShowLogin={setShowLogin} />}

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
    <div className="mt-5 mb-2">
      <AppDrawer showCarousel={true}>
        <Layout />
        {getBody()}
      </AppDrawer>
    </div>
  );
};

export default LotteryMarketDashBoard;
