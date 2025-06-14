/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import CreateGame from "../modal/CreateGame";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import Update from "../modal/Update";
import AccountServices from "../../Services/AccountServices";
import CreateAnnouncement from "../modal/CreateAnnouncement";
import LatestAnnouncementModal from "../modal/LatestAnnouncementModal";
import UpdateAnnouncement from "../modal/updateAnnouncement ";
import { toast } from "react-toastify";
import { customErrorHandler } from "../../Utils/helper";

const GameMarket = ({ marketId }) => {
  const auth = useAuth();
  const [show, setShow] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [games, setGames] = useState([]);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [gameId, setGameId] = useState("");
  const [gameDeleteRes, setGameDeleteRes] = useState("");

  const [showCreateAnnouncementModal, setShowCreateAnnouncementModal] =
    useState(false);
  const [gameName, setGameName] = useState(""); // passing the game name to create announcement modal
  const [gameNameForUpdate, setGameNameForUpdate] = useState(""); // passing the game name to Update announcement modal
  const [showUpdateAnnouncementModal, setShowUpdateAnnouncementModal] =
    useState(false);
  const [announcementId, setAnnouncementId] = useState("");
  const [announceData, setAnnounceData] = useState("");
  const [announcementData, setAnnouncementData] = useState(null); // State to hold announcement data

  const [showLatestAnnouncementModal, setShowLatestAnnouncementModal] =
    useState(false);
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);

  useEffect(() => {
    if (auth.user) {
      GameService.GameInfo(auth.user, currentPage, totalEntries, search)
        .then((res) => {
          setGames(res.data.data.games);
          setTotalPages(res.data.data.pagination.totalPages);
          setTotalData(res.data.data.pagination.totalItems);
        })
        .catch((err) => {
          console.error("An error occurred:", err);
          toast.error(customErrorHandler(err));
        });
    }
  }, [
    auth,
    currentPage,
    totalEntries,
    search,
    show,
    showUpdateModal,
    showUpdateAnnouncementModal,
    showCreateAnnouncementModal,
    gameDeleteRes,
  ]);

  const ClearPath = () => {
    if (games[0]?.gameId) {
      GameService.getToPathname("clearAll", auth.user, games[0]?.gameId)
        .then((res) => {
          if (res.status === 200) {
            // navigate(`/gameMarket`);
          }
        })

        .catch((err) => {
          toast.error(customErrorHandler(err));
        });
    }
  };

  useEffect(() => {
    ClearPath();
  }, [games[0]?.gameId]);
  const handleShow = () => setShow(true);
  const handleShowUpdateModal = (id, data) => {
    setData(data);
    setShowUpdateModal(true);
    setGameId(id);
  };

  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalData);

  const handlePageChange = (page) => {

    setCurrentPage(page);
    //    setIsLoading(false);
  };

  const handleDelete = (e, gameId) => {
    e.preventDefault();
    const gameDeleteConfirmation = window.confirm(
      "Are You Sure You Want To Delete This Game"
    );
    const flag = true;

    const data = {
      isApproved: flag,
    };
    if (gameDeleteConfirmation) {
      GameService.DeleteGame(auth.user, gameId)
        .then((response) => {
          toast.success(response.data.message);
          setGameDeleteRes(response.data);
        })
        .catch((err) => {
          toast.error(customErrorHandler(err));
        });
    }
    return;
  };

  const handleCreateAnnounceClick = (e, id, gamename) => {
    e.preventDefault();
    setShowCreateAnnouncementModal(true);
    setGameName(gamename);
  };

  const handleAnnouncementCreate = (data) => {
    setAnnouncementData(data);
    // Assuming the API response contains the gameId and announceId
    const updatedGames = games.map((game) => {
      if (game.gameId === data.gameId) {
        return {
          ...game,
          announceId: data.announceId,
          announcement: data.announcement,
        };
      }
      return game;
    });
    setGames(updatedGames);
  };

  const handleUpdateAnnouncementClick = (
    e,
    gameId,
    gameName,
    announceId,
    announce
  ) => {
    e.preventDefault();
    setGameNameForUpdate(gameName);
    setAnnouncementId(announceId);
    setShowUpdateAnnouncementModal(true);
    setAnnounceData(announce);
  };

  const handleShowLatestAnnouncementModal = (e, announcement) => {
    e.preventDefault();
    setShowLatestAnnouncementModal(true);
    setLatestAnnouncements(announcement);
  };

  const handleCloseLatestAnnouncementModal = () => {
    setShowLatestAnnouncementModal(false);
  };

  return (
    <div className="main_content_iner overly_inner ">
      <div className="container-fluid p-5 ">
        <div className="row">
          <div className="col-12">
            <div className="page_title_box d-flex align-items-center justify-content-between">
              <div className="page_title_left">
                <h3 className="f_s_30 f_w_700 dark_text text-uppercase text-center">
                  Game Market
                </h3>
              </div>


            </div>
          </div>
        </div>
        <div className="row ">
          <div className="col-12">
            <div className="white_box_tittle list_header">
              <div className="col-2 text-center">
                <select
                  className="form-select form-select-sm"
                  aria-label=".form-select-sm example"
                  onChange={(e) => setTotalEntries(e.target.value)}
                >
                  <option selected value="10">
                    Showing 10 Entries
                  </option>
                  <option value="25">25 Entries</option>
                  <option value="50">50 Entries</option>
                  <option value="100">100 Entries</option>
                </select>
              </div>

              <div
                className="serach_field_2 ms-auto"
                style={{ marginLeft: "-10px" }}
              >
                <div className="search_inner">
                  <div className="search_field">
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                      }}
                      type="text"
                      placeholder="Search Content Here..."
                    />
                  </div>
                  <button type="submit">
                    <i className="ti-search"></i>{" "}
                  </button>
                </div>
              </div>
            </div>
            <div className="white_card">
              <div className="card-body">
                <div className="board_wrapper">
                  <div className="single_board">
                    <div className="main_board_card">
                      <h3 className="m-0 text-center fw-bold mb-2 text-uppercase">
                        Available Games
                      </h3>
                      {games.length > 0 ? (
                        <div className="board_card_list">
                          {games.map((game, index) => {
                            return (
                              <div className="card border-0" key={index}>
                                <div className="card-body m-0 p-3">
                                  <div className="card_head d-flex justify-content-between align-items-center">
                                    <div className="d-flex justify-content-between align-items-center">
                                      <i className="far fa-circle f_s_14 text_color_4 me-2"></i>
                                      <h5 className="f_s_16 f_w_500 mb-0 text-decoration-none">
                                        <Link to={`${game.gameId}`}>
                                          {game.gameName}
                                        </Link>
                                      </h5>
                                    </div>
                                    <div
                                      className="header_more_tool"
                                      style={{ cursor: "pointer" }}
                                    >
                                      <div className="dropdown">
                                        {auth.user.roles === "admin" && <><span
                                          className="dropdown-toggle"
                                          id="dropdownMenuButton"
                                          data-bs-toggle="dropdown"
                                          aria-expanded="false"
                                        >
                                          <i className="ti-more-alt"></i>
                                        </span>
                                          <div
                                            className="dropdown-menu dropdown-menu-right"
                                            aria-labelledby="dropdownMenuButton"
                                            x-placement="bottom-end"
                                           
                                            style={{
                                              position: "absolute",
                                              right: 0, // Align dropdown to the right of its container
                                              top: "100%", // Position it directly below the button
                                              zIndex: 1050, // Ensure it is above other elements
                                              overflow: "visible", // Allow overflow to ensure visibility
                                            }}
                                          >
                                            <a
                                              className="dropdown-item"
                                              onClick={(e) =>
                                                handleDelete(e, game.gameId)
                                              }
                                            >
                                              {" "}
                                              <i className="ti-trash"></i> Delete
                                            </a>
                                            <a
                                              className="dropdown-item"
                                              href="#"
                                              onClick={() => {
                                                handleShowUpdateModal(
                                                  data.gameId,
                                                  games[index]
                                                );
                                              }}
                                            >
                                              {" "}
                                              <i className="fas fa-edit"></i> Edit
                                            </a>

                                          </div></>}

                                      </div>
                                    </div>
                                    {/* Side Nav 3 dots Ending here */}
                                  </div>
                                  <p className="text-muted mb-0 text-decoration-none">
                                    {" "}
                                    {game.Description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                          
                        </div>
                      ) : (
                        <div className="board_card_list">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="card_head d-flex justify-content-center align-items-center ">
                                <h2 className="f_s_16 f_w_500 mb-0 fw-bold text-danger">
                                  No Game Available
                                </h2>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateAnnouncement
        show={showCreateAnnouncementModal}
        setShow={setShowCreateAnnouncementModal}
        gamename={gameName}
        onAnnouncementCreate={handleAnnouncementCreate}
      />
      <UpdateAnnouncement
        show={showUpdateAnnouncementModal}
        setShow={setShowUpdateAnnouncementModal}
        announceId={announcementId}
        gamename={gameNameForUpdate}
        announce={announceData}
      />
      <LatestAnnouncementModal
        show={showLatestAnnouncementModal}
        handleClose={handleCloseLatestAnnouncementModal}
        latestAnnouncements={latestAnnouncements}
      />
      <Update
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        data={data}
        Update={"Game"}
      />
    </div>
  );
};
export default GameMarket;
