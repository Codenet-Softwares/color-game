import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LotteryPage.css"; // Add custom styles here
import {
  Get_Lotteries,
  lottery_Amount_Alert,
  Purchase_lottery,
  userWallet,
} from "../../utils/apiService";
import LotteryTicket from "./LotteryTicket";
import Pagination from "../common/Pagination";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";

const LotteryPage = () => {
  const { store, dispatch } = useAppContext();
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalItems: 0,
  });
  const userId = store.user?.userId;
  // Fetch lottery data
  async function fetchLotteries() {
    setLoading(true);
    try {
      const response = await Get_Lotteries({
        page: pagination.page,
        pageLimit: pagination.limit,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
      });

      console.log("======>>> response for lotteries", response);

      if (response.success) {
        // Replace the lotteries instead of appending
        const uniqueLotteries = Array.from(
          new Set(response.data.map((a) => a.lotteryId))
        ).map((id) => {
          return response.data.find((a) => a.lotteryId === id);
        });
        setLotteries(uniqueLotteries);

        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          totalPages: response.pagination.totalPages,
          totalItems: response.pagination.totalItems,
        });
      }
    } catch (error) {
      console.error("Failed to fetch lotteries", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLotteries();
  }, [pagination.page, pagination.limit]);

  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.totalItems
  );
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle the Buy Now button click
  const handleBuyNow = async (lotteryId, lotteryName) => {
    console.log("========>>>> lottery id", lotteryId);

    const response = await lottery_Amount_Alert({ lotteryId });
    console.log("===>>> ALERT RESPONSE FROM API", response);
    // Extract the message from the API response
    const lotteryAmountMessage =
      response?.message || "Lottery amount information unavailable.";

    const isConfirmed = window.confirm(
      `Are you sure you want to buy this ${lotteryAmountMessage} for  ${lotteryName}?`
    );

    if (isConfirmed) {
      try {
        const response = await Purchase_lottery({ lotteryId });
        console.log("===>> response for purchase", response);
        alert("Ticket purchase successful!");
        // Remove the purchased lottery from the lotteries state
        setLotteries((prevLotteries) =>
          prevLotteries.filter((lottery) => lottery.lotteryId !== lotteryId)
        );
        // const handleUserWallet = async () => {
        console.log("userId", userId);
        const walletResponse = await userWallet(userId, true);
        // console.log("response wallet=>>>>", response);
        if (walletResponse) {
          dispatch({
            type: strings.UserWallet,
            payload: {
              ...walletResponse.data,
            },
          });
          console.log("===>> exposure update", walletResponse);
        }
        // };
      } catch (error) {
        console.error("===>> error in purchase", error);
        alert("Ticket purchase failed. Please try again.");
      }
    } else {
      console.log("Purchase canceled");
    }
  };

  // Loading state
  if (loading && lotteries.length === 0) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
        <p>Loading lotteries...</p>
      </div>
    );
  }

  return (
    <div
      className="container lottery-page-container text-center py-5 mt-3"
      style={{ minHeight: "400px" }}
    >
      {/* Development Notice */}
      <div className="alert alert-info">
        <p>This page is currently under development. Some features may not be fully functional yet.</p>
      </div>
      {/* Blinking "Coming Soon" Message */}
      {/* <div className="coming-soon alert alert-warning" role="alert">
        <p>
          The Game is <span className="blink">Coming Soon</span>!
        </p>
      </div> */}

      {/* Lottery Carousel */}
      <div className="carousel-container position-relative">
        {/* Left Arrow */}
        {/* <a
          className="carousel-control-prev"
          role="button"
          onClick={handlePrev}
          style={{ opacity: page === 1 ? 0.5 : 1 }} // Disable previous arrow if on the first page
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Previous</span>
        </a> */}

        {/* Lottery Cards */}
        {lotteries.length > 0 ? (
          <div className="carousel-container position-relative">
            <div className="container-fluid">
              <div className="row justify-content-center">
                {lotteries.map((lottery, index) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
                    <LotteryTicket
                      lotteryName={lottery.name}
                      drawDate={new Date(lottery.drawDate).toISOString().split('T')[0]}
                      drawTime={lottery.drawTime}
                      firstPrize={lottery.firstPrize}
                      ticketNumbers={lottery.ticketNumber}
                      price={lottery.price}
                      sem={lottery.sem}
                      onBuyClick={() =>
                        handleBuyNow(lottery.lotteryId, lottery.name)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          !loading &&
          lotteries.length === 0 && (
            <div className="no-lotteries-found mt-5">
              <h2>No lotteries found</h2>
              <p>Please check back later for available lotteries.</p>
            </div>
          )
        )}

        {/* Right Arrow */}
        {/* <a
          className="carousel-control-next"
          role="button"
          onClick={handleNext}
          style={{ opacity: page === totalPages ? 0.5 : 1 }} // Disable next arrow if on the last page
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only">Next</span>
        </a> */}
      </div>

      {/* Loading Spinner for Pagination */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading more lotteries...</span>
          </div>
        </div>
      )}

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        handlePageChange={handlePageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalData={pagination.totalItems}
      />
    </div>
  );
};

export default LotteryPage;
