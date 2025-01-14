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
  console.log("==========> marketId line 11", marketId);
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
  console.log(announceData);
  const [announcementData, setAnnouncementData] = useState(null); // State to hold announcement data
  console.log("========> announce data line 34", announcementData);

  const [showLatestAnnouncementModal, setShowLatestAnnouncementModal] =
    useState(false);
  const [latestAnnouncements, setLatestAnnouncements] = useState([]);
  console.log("===========>>>> line ", latestAnnouncements);
  console.log("==========> data for games", games);
  console.log("========> data line 23", data);

  useEffect(() => {
    if (auth.user) {
      GameService.GameInfo(auth.user, currentPage, totalEntries, search)
        .then((res) => {
          console.log("==========> line 26", res);
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
    console.log("===========> gameId data", id);
    setData(data);
    setShowUpdateModal(true);
    setGameId(id);
  };

  console.log("=>>>>", games);

  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalData);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page);

    setCurrentPage(page);
    //    setIsLoading(false);
  };

  const handleDelete = (e, gameId) => {
    e.preventDefault();
    const gameDeleteConfirmation = window.confirm(
      "Are You Sure You Want To Delete This Game"
    );
    console.log("=============....>>>>> gameId onclick", gameId);
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
    console.log("onclick game id ====> line 82", id, gamename);
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
    console.log(
      "onclick game id ====> line ",
      gameId,
      gameName,
      announceId,
      announce
    );
    e.preventDefault();
    setGameNameForUpdate(gameName);
    setAnnouncementId(announceId);
    setShowUpdateAnnouncementModal(true);
    setAnnounceData(announce);
  };

  const handleShowLatestAnnouncementModal = (e, announcement) => {
    console.log("=====> announcement from props onclick", announcement);
    e.preventDefault();
    setShowLatestAnnouncementModal(true);
    setLatestAnnouncements(announcement);
  };

  const handleCloseLatestAnnouncementModal = () => {
    setShowLatestAnnouncementModal(false);
  };

  return (
    <div className="main_content_iner overly_inner ">
      <div className="container-fluid p-0 ">
        <div className="row">
          <div className="col-12">
            <div className="page_title_box d-flex align-items-center justify-content-between">
              <div className="page_title_left">
                <h3 className="f_s_30 f_w_700 dark_text">Game Market</h3>
              </div>
              <button className="btn btn-primary" onClick={handleShow}>
                <span className="me-2">
                  <i className="fa fa-plus " aria-hidden="true"></i>
                </span>
                Create Game
              </button>
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
                  <form Active="#">
                    <div className="search_field">
                      <input
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                        }}
                        type="text"
                        placeholder="Search Content Here..."
                      />
                    </div>
                    <button type="submit">
                      <i className="ti-search"></i>{" "}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className="white_card">
              <div className="card-body">
                <div className="board_wrapper">
                  <div className="single_board">
                    <div className="main_board_card">
                      <div className="white_card_header ps-0 pe-0 pt-0">
                        <div className="box_header m-0">
                          <div className="main-title">
                            <h3 className="m-0">Available Games</h3>
                          </div>
                        </div>
                      </div>
                      {games.length > 0 ? (
                        <div className="board_card_list">
                          {games.map((game, index) => {
                            return (
                              <div className="card border-0" key={index}>
                                <div className="card-body m-0 p-2">
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
                                        <span
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
                                            transform:
                                              "translate3d(-148px, 20px, 0px)",
                                            top: "0px",
                                            left: "0px",
                                          }}
                                        >
                                          <a className="dropdown-item" href="#">
                                            {" "}
                                            <i className="ti-eye"></i> Action
                                          </a>
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

                                          {/* {!game.announceId ? (
                                            <a
                                              className="dropdown-item"
                                              onClick={(e) =>
                                                handleCreateAnnounceClick(
                                                  e,
                                                  game.gameId,
                                                  game.gameName
                                                )
                                              }
                                            >
                                              {" "}
                                              <i className="ti-announcement"></i>{" "}
                                              Create Announcement for{" "}
                                              {game.gameName}
                                            </a>
                                          ) : (
                                            <a
                                              className="dropdown-item"
                                              onClick={(e) =>
                                                handleUpdateAnnouncementClick(
                                                  e,
                                                  game.gameId,
                                                  game.gameName,
                                                  game.announceId,
                                                  game.announcement
                                                )
                                              }
                                            >
                                              {" "}
                                              <i className="ti-announcement"></i>{" "}
                                              Update Announcement for{" "}
                                              {game.gameName}
                                            </a>
                                          )} */}

                                          {/* <a
                                            className="dropdown-item"
                                            onClick={(e) =>
                                              handleShowLatestAnnouncementModal(
                                                e,
                                                game.announcement
                                              )
                                            }
                                          >
                                            {" "}
                                            <i className="ti-announcement"></i>
                                            Latest Announcement for{" "}
                                            {game.gameName}
                                          </a> */}
                                        </div>
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
                          <div>
                            <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              handlePageChange={handlePageChange}
                              startIndex={startIndex}
                              endIndex={endIndex}
                              totalData={totalData}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="board_card_list">
                          <div className="card border-0">
                            <div className="card-body">
                              <div className="card_head d-flex justify-content-center align-items-center ">
                                <h2 className="f_s_16 f_w_500 mb-0">
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
      <CreateGame show={show} setShow={setShow} />
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
