/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import {
  useParams,
  useLocation,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import AccountServices from "../../Services/AccountServices";
import Pagination from "../../Components/Pagination";
import { useAuth } from "../../Utils/Auth";
import CreateRate from "../../Components/modal/CreateRate";
import "./runnerView.css";
import ViewRate from "../../Components/modal/ViewRate";
import Update from "../../Components/modal/Update";
import RunnerModal from "../../Components/modal/RunnerModal";
import { toast } from "react-toastify";
import GameService from "../../Services/GameService";
import { Badge } from "react-bootstrap";
import { customErrorHandler } from "../../Utils/helper";

const RunnerView = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { runner } = useParams();
  const [runners, setRunners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [rateShow, setRateShow] = useState({
    createRate: false,
    viewRate: false,
  });
  const [runnerName, setRunnerName] = useState("");
  const [gameid, setGameId] = useState("");
  const [searchParams] = useSearchParams();
  const [pathdata, setPathData] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [data, setData] = useState([]);
  const [toggleCase, setToggleCase] = useState("");

  const [runnerRates, setRunnerRates] = useState({ back: [], lay: [] });
  const [isWin, setIsWin] = useState(true);
  const [runnerIdentity, setRunnerIdentity] = useState("");
  const [runnerDeleteRes, setRunnerDeleteRes] = useState("");
  const [mostRecentPath, setMostRecentPath] = useState(pathdata[1] || "");

  console.log("=========>>>>> runner data", runners);

  const [runnerId, setRunnerId] = useState("");
  console.log("=========>>>> RUnnerid", runnerId);

  const marketid = searchParams.get("marketId");
  console.log("==========> line 44", marketid);

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

  const fetchDataPathName = () => {
    GameService.getToPathname("store", auth.user, runner)
      .then((response) => {
        setPathData(response.data.data);
        // setMostRecentPath();
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };
  useEffect(() => {
    fetchDataPathName();
  }, []);

  const location = useLocation();
  console.log("location===>", location.state);

  const fetchdataViewRunner = () => {
    if (auth.user && pathdata[1]?.id) {
      AccountServices.ViewRunner(
        auth.user,
        currentPage,
        totalEntries,
        pathdata[1]?.id,
        search
      )
        .then((res) => {
          console.log("============>>> line 48", res.data.data);
          const { data } = res.data;
          console.log("===========> marketId", data);
          setRunners(res.data.data); // Update the state with the received runners
          setTotalPages(res.data.pagination.totalPages); // Update the total pages
          setTotalData(res.data.pagination.totalItems); // Update the total data count

          const rates = [];
          data.forEach((runner) => {
            runner.rates.forEach((rate) => {
              rates.push({ back: rate.Back, lay: rate.Lay });
            });
          });
          setRunnerRates(rates);

          // Log rates for back and lay here
          console.log("Rates for back and lay:", rates);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            // Handle 404 Not Found error here
            console.log("Runner not found.");
          } else {
            // Handle other errors
            console.error("Error fetching data:", error);
          }
        });
    }
  };
  const handleCreateRateModalOpen = (name) => {
    setRateShow({ ...rateShow, createRate: true });
    setRunnerName(name);
    // setGameId(id);
    // setRunnerId(id);
  };
  console.log(gameid);

  useEffect(() => {
    fetchdataViewRunner();
  }, [
    auth,
    currentPage,
    totalEntries,
    pathdata[1]?.id,
    search,
    showUpdateModal,
    runnerDeleteRes,
    rateShow.createRate,
  ]);

  const handleViewRateModal = (runnerName, rates) => {
    setRateShow({ ...rateShow, viewRate: true });
    setRunnerName(runnerName);
    setRunnerRates(rates);
  };
  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalData);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleShowUpdateModal = (data, toggle) => {
    console.log("============> line 112", data);
    setToggleCase(toggle);
    setData(data);
    setShowUpdateModal(true);
  };

  const handleAnnounceWin = (runnerId) => {
    console.log("onClicked RunnerId:", runnerId);

    const data = {
      marketId: pathdata[1]?.id,
      runnerId: runnerId,
      isWin: isWin,
    };

    AccountServices.announceWin(data, auth.user)
      .then((res) => {
        console.log(res);
        toast.success(res.data.message);
        setIsWin(true);
        navigate(`/gameMarket`);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  const handleSetGameInactive = (marketId) => {
    AccountServices.setGameInactive({ marketId }, auth.user)
      .then((res) => {
        console.log("Game set to inactive:", res);
        // Trigger re-render or state update if needed
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  // delete api fetch for runner
  const handleDelete = (runnerId) => {
    console.log("=============....>>>>> runnerId onclick", runnerId);

    AccountServices.DeleteRunner(auth.user, runnerId)
      .then((response) => {
        toast.success(response.data.message);
        setRunnerDeleteRes(response.data);
      })
      .catch((err) => {
        toast.error(customErrorHandler(err));
      });
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="page_title_box d-flex align-items-center justify-content-between">
            <div className="page_title_left">
              <h3 className="f_s_30 f_w_700 dark_text">
                <span href="#" onClick={ClearPath}>
                  GameMarket
                </span>
                <span>
                  {pathdata.slice(0, pathdata.length - 1).map((data) => (
                    <Link
                      key={data.id} // Adding a key prop for each element in the array
                      to={{
                        pathname: `/gameMarket/${data.id}`,
                      }}
                    >
                      <span style={{ cursor: "pointer" }}>
                        &nbsp;/&nbsp;{data.name}
                      </span>
                    </Link>
                  ))}
                  <span style={{ color: "" }}>
                    &nbsp;/&nbsp;{pathdata[1]?.name}
                  </span>
                </span>
              </h3>
            </div>
          </div>
        </div>
      </div>
      <>
        <div className="row">
          <div className="col-md-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="form-control mb-3"
              placeholder="Search Content Here..."
            />
          </div>
          <div className="col-md-6">
            <select
              className="form-select mb-3"
              onChange={(e) => setTotalEntries(parseInt(e.target.value))}
            >
              <option value="10">Showing 10 Entries </option>
              <option value="25">25 Entries</option>
              <option value="50">50 Entries</option>
              <option value="100">100 Entries</option>
            </select>
          </div>
        </div>
        <div className="board_card_list">
          {runners.length > 0 ? (
            runners.map((runner, index) => (
              <div key={index} className="col">
                <div className="card h-100">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <h5
                      className="card-title text-nowrap "
                      style={{ width: "85px" }}
                    >
                      {runner.runnerName}
                    </h5>

                    <div
                      style={{
                        minWidth: "170px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center", // Ensures vertical alignment
                        fontSize: "14px",
                      }}
                    >
                      <Badge
                        bg="success "
                        style={{ width: "65px", padding: "4px 0" }}
                      >
                        {" "}
                        Back: {runner.rates[0].Back}{" "}
                      </Badge>
                      <Badge
                        bg="danger "
                        style={{ width: "65px", padding: "4px 0" }}
                      >
                        {" "}
                        Lay: {runner.rates[0].Lay}{" "}
                      </Badge>
                    </div>

                    <div className="dropdown">
                      <span
                        className="three-dots"
                        id={`dropdownMenuButton${index}`}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="ti-more-alt"></i>
                      </span>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby={`dropdownMenuButton${index}`}
                      >
                        {runner.rates &&
                          (runner.rates.every(
                            (rate) => rate.Back === null && rate.Lay === null
                          ) ? (
                            // <a
                            //   className="dropdown-item"
                            //   href="#"
                            //   onClick={() => {
                            //     handleCreateRateModalOpen(runner.runnerId);
                            //   }}
                            // >
                            //   <i className="ti-arrow-circle-right"></i> Create
                            //   Rate for {runner.runnerName}
                            // </a>
                            <></>
                          ) : (
                            <>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  handleShowUpdateModal(runner, "rate");
                                }}
                              >
                                <i className="ti-arrow-circle-right"></i> Update
                                Rate for {runner.runnerName}
                              </a>
                              <a
                                className="dropdown-item"
                                href="#"
                                onClick={() => {
                                  handleViewRateModal(
                                    runner.runnerName,
                                    runner.rates
                                  );
                                  console.log(
                                    "Rates for",
                                    runner.runnerName,
                                    ":",
                                    runner.rates
                                  );
                                }}
                              >
                                <i className="ti-arrow-circle-right"></i> View
                                Rate for {runner.runnerName}
                              </a>
                            </>
                          ))}

                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => {
                            handleShowUpdateModal(runners[index], "runner");
                          }}
                        >
                          {" "}
                          <i className="ti-arrow-circle-right"></i>&nbsp;Edit
                          Runner Name
                        </a>
                        {runner.isBidding && (
                          <a
                            // key={runner.runnerId}
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleAnnounceWin(runner.runnerId)}
                          >
                            {" "}
                            <i className="ti-arrow-circle-right"></i>
                            &nbsp;Announce Win for {runner.runnerName}
                          </a>
                        )}

                        <a
                          key={runner.runnerId}
                          className="dropdown-item"
                          href="#"
                          onClick={() => handleDelete(runner.runnerId)}
                        >
                          {" "}
                          <i className="ti-arrow-circle-right"></i>
                          &nbsp;Delete {runner.runnerName}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col">
              <p className="text-muted">No runners found.</p>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            startIndex={startIndex}
            endIndex={endIndex}
            totalData={totalData}
          />
        </div>
      </>
      {/* {console.log(location.state.gameid)} */}
      <CreateRate
        show={rateShow.createRate}
        setShow={(value) => setRateShow({ ...rateShow, createRate: value })}
        runnerName={runnerName}
      />

      <ViewRate
        show={rateShow.viewRate}
        setShow={(value) => setRateShow({ ...rateShow, createRate: value })}
        onHide={() => setRateShow(false)}
        runnerName={runnerName}
        rates={runnerRates}
      />
      {toggleCase === "runner" ? (
        <Update
          show={showUpdateModal}
          setShow={setShowUpdateModal}
          data={data}
          Update={"Runner"}
        />
      ) : (
        <Update
          show={showUpdateModal}
          setShow={setShowUpdateModal}
          data={data}
          Update={"Rate"}
        />
      )}
    </div>
  );
};

export default RunnerView;
