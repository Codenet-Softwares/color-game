/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link, useSearchParams } from 'react-router-dom';
import AccountServices from '../../Services/AccountServices';
import Pagination from '../../Components/Pagination';
import { useAuth } from '../../Utils/Auth';
import CreateRate from '../../Components/modal/CreateRate';
import './runnerView.css';

const RunnerView = () => {
  const auth = useAuth();
  const { runner, marketPlace, marketId } = useParams();
  const [runners, setRunners] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(5);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState('');
  const [rateShow, setRateShow] = useState(false);
  const [runnerName, setRunnerName] = useState('');
  const [gameid, setGameId] = useState('');
  const [searchParams] = useSearchParams();

  console.log(runner, marketPlace, runners);

  const marketid = searchParams.get('marketId');

  const location = useLocation();
  const gameidManage = location.state === null ? gameid : location.state.gameid;
  console.log('gameid===>', location.state);
  console.log('manageGameid===>', gameidManage);

  const fetchdata = () => {
    AccountServices.ViewRunner(auth.user, currentPage, totalEntries, marketid, gameidManage, search)
      .then((res) => {
        console.log(res);
        setRunners(res.data.data); // Update the state with the received runners
        setTotalPages(res.data.pagination.totalPages); // Update the total pages
        setTotalData(res.data.pagination.totalItems); // Update the total data count
      })
      .catch((err) => console.log(err));
  };

  const handleRateModalOpen = (name, id) => {
    setRateShow(true);
    setRunnerName(name);
    setGameId(id);
  };
  console.log(gameid);
  useEffect(() => {
    fetchdata();
  }, [auth, rateShow, currentPage, totalEntries, marketId, search]);

  let startIndex = Math.min((currentPage - 1) * totalEntries + 1);
  let endIndex = Math.min(currentPage * totalEntries, totalData);

  const handlePageChange = (page) => {
    console.log('page', page);
    setCurrentPage(page);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="page_title_box d-flex align-items-center justify-content-between">
            <div className="page_title_left">
              <h3 className="f_s_30 f_w_700 dark_text">
                <Link to="/gameMarket">GameMarket</Link>&nbsp;/&nbsp;
                <Link to={`/gameMarket/${marketPlace}?gameId=${gameidManage}`}>{marketPlace}&nbsp;</Link>
                /&nbsp;<Link>{runner}</Link>
              </h3>
            </div>
          </div>
        </div>
      </div>
      {location?.state?.status || location?.state === null ? (
        <>
          <div className="row">
            <div className="col-md-6">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="form-control mb-3"
                placeholder="Search content here..."
              />
            </div>
            <div className="col-md-6">
              <select className="form-select mb-3" onChange={(e) => setTotalEntries(parseInt(e.target.value))}>
                <option value="5">Show 5 entries</option>
                <option value="10">10 entries</option>
                <option value="15">15 entries</option>
                <option value="25">25 entries</option>
                <option value="50">50 entries</option>
                <option value="75">75 entries</option>
              </select>
            </div>
          </div>
          <div className="board_card_list">
            {runners.length > 0 ? (
              runners.map((runner, index) => (
                <div key={index} className="col">
                  <div className="card h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <h5 className="card-title">{runner.runnerName}</h5>
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
                          <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => {
                              handleRateModalOpen(
                                runner.runnerId,
                                location.state === null ? gameid : location.state.gameid,
                              );
                              console.log(runner.runnerName);
                            }}
                          >
                            {' '}
                            <i className="ti-arrow-circle-right"></i> Create Rate
                          </a>
                          <a
                            className="dropdown-item"
                            href="#"
                            // onClick={() => {
                            //   handleRateModalOpen(runner.runnerName);
                            //   console.log(runner.runnerName);
                            // }}
                          >
                            <i className="ti-arrow-circle-right"></i>View Rate
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
      ) : (
        <div class="background">
          <h1>Suspended</h1>
        </div>
      )}
      {/* {console.log(location.state.gameid)} */}
      <CreateRate show={rateShow} setShow={setRateShow} gameName={gameid} runner={marketid} runnerName={runnerName} />
    </div>
  );
};

export default RunnerView;
