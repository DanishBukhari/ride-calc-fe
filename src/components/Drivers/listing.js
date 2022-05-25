import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const RideHistory = () => {
  const [rideHistory, setRideHistory] = React.useState([]);
  const [displayRideHistory, setDisplayRideHistory] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
    //   .get(`/orders/user/${username}`, {
      .get(`https://aridee.herokuapp.com/driver/listing`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
            console.log('=== >> res.data == >> ',res.data)
          setRideHistory(res.data);
          setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10000));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDate = (orderDate) => {
    const date = new Date(orderDate);
    return `${date.getDate()}.${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }.${date.getFullYear()} ${
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
  };

  const navigateToAddDriver = () =>{
        navigate("/drivers-Add");
  }


  const getContent = () => {
    return (
      <>
        {!!displayRideHistory.length ? (
          <>
            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Driver Name</th>
                  <th scope="col">Email</th>
                </tr>
              </thead>
              <tbody>
                {displayRideHistory.map((history, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{history.pickup_date} {history.pickup_time}</td> */}
                      <td>{history.name}</td>
                      <td>{history.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
            <button className="green-button" onClick={()=>{
                navigateToAddDriver()
            }}>
                Add Driver
                </button>
            </div>
            {/* <div className="d-flex align-items-center justify-content-center pt-4 pagination">
              {pageNo !== 1 ? (
                <AiFillCaretLeft
                  className="pointer"
                  onClick={() => {
                    setPageNo(pageNo - 1);
                    setDisplayRideHistory(
                      _.cloneDeep(rideHistory).splice(
                        pageNo - 2 * 10,
                        (pageNo - 1) * 10
                      )
                    );
                  }}
                />
              ) : (
                <div className="box" />
              )}
              <div className="px-2">
                Page {pageNo} /{" "}
                {rideHistory.length < 10
                  ? "1"
                  : Math.ceil(rideHistory.length / 10)}
              </div>
              {pageNo !== Math.ceil(rideHistory.length / 10) ? (
                <AiFillCaretRight
                  className="pointer"
                  onClick={() => {
                    setPageNo(pageNo + 1);
                    setDisplayRideHistory(
                      _.cloneDeep(rideHistory).splice(
                        pageNo * 10,
                        (pageNo + 1) * 10 > rideHistory.length
                          ? rideHistory.length
                          : (pageNo + 1) * 10
                      )
                    );
                  }}
                />
              ) : (
                <div className="box" />
              )}
            </div> */}
          </>
        ) : (
          <div>No ride history available</div>
        )}
      </>
    );
  };


  return <Page navigations={["Home", "Ride history"]} content={getContent()} />;
};

export default RideHistory;
