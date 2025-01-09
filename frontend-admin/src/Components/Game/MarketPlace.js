/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import CreateGame from "../modal/CreateGame";
import { useAuth } from "../../Utils/Auth";
import GameService from "../../Services/GameService";
import CreateMarket from "../modal/CreateMarket";
import {
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../Pagination";
import { Link } from "react-router-dom";
import RunnerModal from "../modal/RunnerModal";
import { toast } from "react-toastify";
import Update from "../modal/Update";
import GameMarket from "./GameMarket";
import AccountServices from "../../Services/AccountServices";
import { customErrorHandler } from "../../Utils/helper";

const MarketPlace = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [showRunnerModal, setShowRunnerModal] = useState(false);
  const handleShow = () => setShow(true);
  const [pathdata, setPathData] = useState([]);
  const [gameMarketData, setGameMarketData] = useState([{}]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [totalEntries, setTotalEntries] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const { marketPlace } = useParams();
  const { GameId } = useParams();
  const [marketId, setMarketId] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState(0);
  const [searchParams] = useSearchParams();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  const [marketDeleteRes, setMarketDeleteRes] = useState("");
  const [refresh, setRefresh] = useState(false);

  const ClearPath = () => {
    GameService.getToPathname("clearAll", auth.user, pathdata[0]?.id)

      .then((res) => {
        if (res.status === 200) {
          navigate(`/gameMarket`);
        }
      })

      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  const fetchData = () => {
    GameService.getToPathname("store", auth.user, marketPlace)
      .then((response) => {
        setPathData(response.data.data);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  console.log("temp", pathdata[0]?.id);

  const handleRunnerModalOpen = (Id, participant) => {
    console.log("Id ", Id);
    setShowRunnerModal(true);
    console.log(Id);
    setMarketId(Id);
    setNumberOfParticipants(participant);
    console.log("....", participant);
  };

  const handleSuspensedMarket = (e, data, marketPlace) => {
    // e.preventDefault();
    GameService.suspensedMarket({ status: data }, marketPlace, auth.user)
      .then((res) => {
        toast.success(res.data.message);
        setRefresh((prev) => !prev);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  useEffect(() => {
    if (auth.user && pathdata[0]?.id) {
      GameService.getGameMarketPlace(
        auth.user,
        pathdata[0]?.id,
        currentPage,
        totalEntries,
        search
      ).then(
        (res) => (
          console.log(res),
          setGameMarketData(res.data.data),
          setTotalPages(res.data.pagination.totalPages),
          setTotalData(res.data.pagination.totalItems)
        )
      );
    }
  }, [
    auth,
    currentPage,
    totalEntries,
    search,
    showRunnerModal,
    show,
    pathdata[0]?.id,
    marketDeleteRes,
    showUpdateModal,
    refresh,
  ]);

  console.log("==========> LINE 53", gameMarketData);

  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalData);

  const handlePageChange = (page) => {
    console.log("Changing to page:", page);

    setCurrentPage(page);
    //  setIsLoading(false);
  };
  console.log("=>>>94", gameMarketData);

  const handleShowUpdateModal = (data) => {
    setData(data);
    setShowUpdateModal(true);
  };

  const handleDelete = (e, marketId) => {
    e.preventDefault();
    console.log("=============....>>>>>", marketId);
    const flag = true;

    const data = {
      isApproved: flag,
    };
    AccountServices.DeleteMarket(auth.user, marketId)
      .then((response) => {
        toast.success(response.data.message);
        setMarketDeleteRes(response.data);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  const handleVoidMarket = (e, marketId) => {
    e.preventDefault();
    console.log("=============....>>>>>", marketId);
    const flag = true;

    const data = {
      isVoid: flag,
      marketId: marketId,
    };
    GameService.voidMarket(data, auth.user)
      .then((response) => {
        toast.success(response.data.message);
        setMarketDeleteRes(response.data);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  return (
    <div className="main_content_iner overly_inner ">
      <div className="container-fluid p-0 ">
        <div className="row">
          <div className="col-12">
            <div className="page_title_box d-flex align-items-center justify-content-between">
              <div className="page_title_left">
                <h3 className="f_s_30 f_w_700 dark_text text-white">
                  <span href="#" onClick={ClearPath}>
                    GameMarket
                  </span>
                  {pathdata.map((data) => (
                    <Link
                      to={{
                        pathname: `/gameMarket/${data.id}`,
                      }}
                    >
                      <span style={{ cursor: "pointer" }}>
                        &nbsp;/&nbsp;{data.name}
                      </span>
                    </Link>
                  ))}
                </h3>
              </div>
              <button className="btn btn-primary" onClick={handleShow}>
                <span className="mx-1">
                  <i className="fa fa-plus " aria-hidden="true"></i>
                </span>
                Market Place
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
                      {" "}
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
                            <h3 className="m-0 text-white">
                              Available {pathdata[0]?.name} Market
                            </h3>
                          </div>
                        </div>
                      </div>
                      {gameMarketData.length > 0 ? (
                        <div
                          className="board_card_list"
                          style={{
                            background: "#FFFDD0",
                            borderRadius: "20px",
                          }}
                        >
                          {gameMarketData.map((market, index) => {
                            console.log(market);
                            return (
                              <div
                                className="card shadow-lg"
                                key={index}
                                style={{
                                  background: "#FFFDD0",
                                  borderRadius: "20px",
                                }}
                              >
                                <div className="card-body">
                                  <div className="row align-items-center">
                                    <div
                                      className="col-md-6 d-flex gap-2"
                                      style={{
                                        minWidth: "15%",
                                        alignItems: "center",
                                      }}
                                    >
                                      <i
                                        className="fas fa-chart-line fa-bounce"
                                        style={{
                                          color: "#6f42c1",
                                          fontSize: "20px",
                                        }}
                                      ></i>

                                      <h5 className="f_s_16 f_w_500 mb-0 text-start px-2 fw-bold">
                                        {market.marketName}
                                      </h5>
                                    </div>

                                    <div className="col-md-4">
                                      <span
                                        className={`status-text fw-bold fs-5 position-relative ${
                                          market.isActive
                                            ? "text-success"
                                            : "text-danger"
                                        }`}
                                        style={{ top: "1px", right: "10px" }}
                                      >
                                        {market.isActive
                                          ? "Active"
                                          : "Inactive"}
                                      </span>
                                    </div>

                                    <div className="col-md-2">
                                      <div className="header_more_tool d-flex justify-content-end">
                                        <div className="dropdown">
                                          <span
                                            className="dropdown-toggle"
                                            id="dropdownMenuButton"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                            style={{ cursor: "pointer" }}
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
                                            {market.isDisplay && (
                                              <a
                                                className="dropdown-item"
                                                href="#"
                                                onClick={() =>
                                                  handleRunnerModalOpen(
                                                    market.marketId,
                                                    market.participants
                                                  )
                                                }
                                              >
                                                <i className="fas fa-edit"></i>{" "}
                                                Create Runner
                                              </a>
                                            )}
                                            <a
                                              className="dropdown-item"
                                              href="#"
                                              onClick={(e) =>
                                                handleDelete(e, market.marketId)
                                              }
                                            >
                                              <i className="ti-trash"></i>{" "}
                                              Delete
                                            </a>

                                            {!market.isDisplay && (
                                              <>
                                                {market.isActive ? (
                                                  <a
                                                    className="dropdown-item"
                                                    onClick={(e) =>
                                                      handleSuspensedMarket(
                                                        e,
                                                        false,
                                                        market.marketId
                                                      )
                                                    }
                                                  >
                                                    <i className="fa-solid fa-lock"></i>{" "}
                                                    Suspensed
                                                  </a>
                                                ) : (
                                                  <>
                                                    <a
                                                      className="dropdown-item"
                                                      href="#"
                                                      onClick={() =>
                                                        handleShowUpdateModal(
                                                          gameMarketData[index]
                                                        )
                                                      }
                                                    >
                                                      <i className="fas fa-edit"></i>{" "}
                                                      Edit
                                                    </a>
                                                    <a
                                                      className="dropdown-item"
                                                      onClick={(e) =>
                                                        handleSuspensedMarket(
                                                          e,
                                                          true,
                                                          market.marketId
                                                        )
                                                      }
                                                    >
                                                      <i className="fa-solid fa-lock"></i>{" "}
                                                      Active
                                                    </a>
                                                  </>
                                                )}
                                                <Link
                                                  to={`${market.marketId}`}
                                                  state={{
                                                    status: market.isActive,
                                                    gameid: pathdata[0]?.id,
                                                  }}
                                                  className="dropdown-item"
                                                >
                                                  <i className="ti-eye"></i>{" "}
                                                  View runner
                                                </Link>
                                                <a
                                                  className="dropdown-item"
                                                  href="#"
                                                  onClick={(e) =>
                                                    handleVoidMarket(
                                                      e,
                                                      market.marketId
                                                    )
                                                  }
                                                >
                                                  <i className="fas fa-edit"></i>{" "}
                                                  Void
                                                </a>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
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
                                  No Market Available
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

      <CreateMarket show={show} setShow={setShow} id={pathdata[0]?.id} />
      <Update
        show={showUpdateModal}
        setShow={setShowUpdateModal}
        data={data}
        Update={"Market"}
      />

      <RunnerModal
        show={showRunnerModal}
        setShow={setShowRunnerModal}
        gameName={pathdata[0]?.id}
        marketId={marketId}
        numberOfParticipants={numberOfParticipants}
      />
    </div>
  );
};

export default MarketPlace;
