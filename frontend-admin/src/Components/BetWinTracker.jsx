import React from 'react'
import { FaSearch, FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import SingleCard from './common/singleCard';
const BetWinTracker = () => {

    
  return (
       <div>
      <div className="container my-5 p-5 ">
        <div className="card shadow-lg" style={{ background: "#E1D1C7" }}>
          <div
            className="card-header text-white"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background:"#3E5879",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                color: "#333",
                fontSize: "20px",
                cursor: "pointer",
              }}
            //   onClick={handleNavigation}
            >
              <FaArrowLeft />
            </div>
            <h3
              className="mb-0 fw-bold text-uppercase"
              style={{ flexGrow: 1, textAlign: "center" }}
            >
                Bet History 
              {/* Bet History For - {marketName} */}
            </h3>
          </div>

          <div className="card-body">
            {/* Search and Entries Selection */}
            <div className="row mb-4">
              <div className="col-md-6 position-relative">
                <FaSearch
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "20px",
                    transform: "translateY(-50%)",
                    color: "#3E5879",
                    fontSize: "18px",
                  }}
                />
                <input
                  type="text"
                  className="form-control fw-bold"
                  placeholder="Search By User Or Market Name..."
                //   value={searchTerm} 
                //   onChange={handleSearchChange}
                  style={{
                    paddingLeft: "40px",
                    borderRadius: "30px",
                    border: "2px solid #3E5879",
                  }}
                />
              </div>
              <div className="col-md-6 text-end">
                <label className="me-2 fw-bold">Show</label>
                <select
                  className="form-select d-inline-block w-auto"
                  style={{
                    borderRadius: "50px",
                    border: "2px solid #3E5879",
                  }}
                //   value={betAfterWin.totalEntries}
                //   onChange={handleEntriesChange}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <label className="ms-2 fw-bold">Entries</label>
              </div>
            </div>

            {/* Table */}
            <SingleCard
              className="mb-5 text-center"
              style={{
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 1)",
              }}
            >
            <div className="table-responsive ">
              <table className="table table-striped table-hover text-center" style={{
                  borderRadius: "50px",
                  border: "2px solid #3E5879",
                }}>
                <thead className="table-primary text-uppercase">
                  <tr>
                    <th>Serial Number</th>
                    <th>User Name</th>
                    {/* <th>Market Name</th> */}
                    <th>Runner Name</th>
                    <th>Odds</th>
                    <th>Type</th>
                    <th>Stake</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
             
              </table>
            </div>
            </SingleCard>
            {/* Pagination */}
            {/* <Pagination
              currentPage={betAfterWin.currentPage}
              totalPages={betAfterWin.totalPages}
              handlePageChange={handlePageChange}
              startIndex={startIndex}
              endIndex={endIndex}
              totalData={betAfterWin.totalData}
            /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BetWinTracker;
