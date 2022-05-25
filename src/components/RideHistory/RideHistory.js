import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import moment from 'moment'

const RideHistory = () => {
  const [rideHistory, setRideHistory] = React.useState([]);
  const [displayRideHistory, setDisplayRideHistory] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();

  
  const [orders, setOrders] = React.useState([]);
  const [displayOrders, setDisplayOrders] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [account, setAccount] = React.useState(undefined);
  const [selectAccount, setSelectAccount] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const [tempStartDate, setTempStartDate] = React.useState(new moment().format('DD-MM-YYYY'));
  const [tempEndDate, setTempEndDate] = React.useState(new moment().format('DD-MM-YYYY'));

  let value;

  React.useEffect(() => {
    axios
      .get(`/orders/user/${username}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setRideHistory(res.data);
          setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // React.useEffect(() => {
  //   axios
  //     .get(`/orders/v2/user`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         setRideHistory(res.data);
  //         setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10));
  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  React.useEffect(() => {
    let userType = sessionStorage.getItem("role");
    console.log('=== >> >userType === >> ',userType)
    if(userType==="User")
    {
      account && getOrders(account.account_id, startDate, endDate);
    }
    else{
      account && getOrders_v2(account.account_id, startDate, endDate);
    }
  }, [account, startDate, endDate]);

  const getAccounts = () => {
    axios
      .get("/accounts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAccounts(res.data);
          setAccount(res.data[0]);
        }
      });
  };

  React.useEffect(() => {
    getAccounts();
  }, []);



  // const getOrders = (accountId, startDate, endDate) => {
  //   axios
  //     .post(
  //       "/orders/history",
  //       {
  //         accountId,
  //         startDate: startDate.getDate()  + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear(),
  //         endDate: endDate.getDate()  + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
  //         // startDate: tempStartDate,
  //         // endDate: tempEndDate,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  //         },
  //       }
  //     )
  //     .then((res) => {
  //       if (res.status === 200) {

  //         setRideHistory([]);
  //         // setDisplayRideHistory(_.cloneDeep(res.data).splice(-1,-1));

  //         setRideHistory(res.data);
  //         setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10));

  //       }
  //     });
  // };


  const getOrders_v2 = (accountId, startDate, endDate) => {
    axios
      .post(
        "/orders/v2/history",
        {
          startDate: startDate.getDate()  + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear(),
          endDate: endDate.getDate()  + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {

          setRideHistory([]);
          // setDisplayRideHistory(_.cloneDeep(res.data).splice(-1,-1));

          setRideHistory(res.data);
          setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10));

        }
      });
  };


  const getOrders = (accountId, startDate, endDate) => {
    axios
      .post(
        "/orders/v3/history",
        {
          username: sessionStorage.getItem("username"),
          startDate: startDate.getDate()  + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear(),
          endDate: endDate.getDate()  + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
          // startDate: tempStartDate,
          // endDate: tempEndDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {

          setRideHistory([]);
          // setDisplayRideHistory(_.cloneDeep(res.data).splice(-1,-1));

          setRideHistory(res.data);
          setDisplayRideHistory(_.cloneDeep(res.data).splice(0, 10));

        }
      });
  };



  const getDate = (orderDate) => {
    const date = new Date(orderDate);
    return `${date.getDate()}.${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }.${date.getFullYear()} ${
      date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
  };


  const useOutsideClick = (ref) => {
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setSelectAccount(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const ref = React.useRef(null);
  useOutsideClick(ref);

  const getContent = () => {
    return (
      <>
        {/* {!!displayRideHistory.length ? (
          <>

            <div className="row pb-4">
              <div className="d-flex align-items-center col-lg-6 col-md-12 col-xs-12">
                <div className="input-label pb-0 text-nowrap pe-3">
                  Select account
                </div>
                <div className="w-100" ref={ref}>
                  <div
                    className="input-select pointer"
                    onClick={() => setSelectAccount(true)}
                  >
                    {account?.account_name}
                  </div>
                  {selectAccount && (
                    <div className={`${accounts.length > 2 ? "dropdown" : ""}`}>
                      {accounts.map((acc, index) => {
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectAccount(false);
                              setAccount(acc);
                            }}
                          >
                            {acc?.account_name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div> 


          
              

              <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
                <div className="input-label pb-0 text-nowrap pe-3">From</div>
                <DatePicker
                  className="input-select pointer w-100 ps-3"
                  selected={startDate}
                  dateFormat="dd.MM.yyyy"
                  // onChange={(date) => setStartDate(date)}
                  onChange={(date) => {setStartDate(date);account && getOrders(account.account_id, startDate, endDate)}}
                />
              </div>
              <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
                <div className="input-label pb-0 text-nowrap pe-3">To</div>
                <DatePicker
                  className="input-select pointer w-100 ps-3"
                  selected={endDate}
                  dateFormat="dd.MM.yyyy"
                  // onChange={(date) => setEndDate(date)}

                  onChange={(date) => {setEndDate(date);account && getOrders(account.account_id, startDate, endDate)}}


                />
              </div>
            </div>


            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Ride Date and Time</th>
                  <th scope="col">Client name</th>
                  <th scope="col">Tariff</th>
                  <th scope="col">KM</th>
                  <th scope="col">Price</th>
                  <th scope="col">status</th>

                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {displayRideHistory.map((history, index) => {
                  return (
                    <tr key={index}>
                      <td>{history.pickup_date} {history.pickup_time}</td>
                      <td>{history.client_name}</td>
                      <td>{`${history.tariff_title} - ${
                        history.tariff_price
                      } CZK ${
                        history.tariff_type === "Custom" ? "/ km" : ""
                      }`}</td>
                      <td>{history.kilometers} km</td>
                      <td>{history.total_price} CZK</td>
                      <td>{history.orderStatus}</td>

                      <td
                        className="ps-3 pointer"
                        onClick={() =>
                          navigate(`/edit-order/${history.order_id}`)
                        }
                      >
                        Edit order
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex align-items-center justify-content-center pt-4 pagination">
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
            </div>
          </>
        )
         :
         (
          <div>No ride history available</div>
        )
        } */}

          <>

            <div className="row pb-4">
              <div className="d-flex align-items-center col-lg-6 col-md-12 col-xs-12">
                {/* <div className="input-label pb-0 text-nowrap pe-3">
                  Select account
                </div> */}
                <div className="w-100" ref={ref}>
                  {/* <div
                    className="input-select pointer"
                    onClick={() => setSelectAccount(true)}
                  >
                    {account?.account_name}
                  </div> */}
                  {selectAccount && (
                    <div className={`${accounts.length > 2 ? "dropdown" : ""}`}>
                      {accounts.map((acc, index) => {
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectAccount(false);
                              setAccount(acc);
                            }}
                          >
                            {acc?.account_name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div> 




              <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
            <div className="input-label pb-0 text-nowrap pe-3">From</div>
            <DatePicker
              className="input-select pointer w-100 ps-3"
              selected={startDate}
              dateFormat="dd.MM.yyyy"
              onChange={(date) => setStartDate(date)}
            />
          </div>
          <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
            <div className="input-label pb-0 text-nowrap pe-3">To</div>
            <DatePicker
              className="input-select pointer w-100 ps-3"
              selected={endDate}
              dateFormat="dd.MM.yyyy"
              onChange={(date) => setEndDate(date)}
            />
          </div>

          
              

              {/* <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
                <div className="input-label pb-0 text-nowrap pe-3">From</div>
                
                <DatePicker
              className="input-select pointer w-100 ps-3"
              selected={startDate}
              dateFormat="dd.MM.yyyy"
              onChange={(date) => {setStartDate(date);
                setStartDate(date);account && getOrders(account.account_id, startDate, endDate)
              }}
            />



                {/* <DatePicker
                  className="input-select pointer w-100 ps-3"
                  selected={startDate}
                  dateFormat="dd.MM.yyyy"
                  // onChange={(date) => setStartDate(date)}
                  onChange={(date) => {console.log('=== >>>DATE === >> ',date);
                  const tempStartDate = moment(date).format('DD-MM-YYYY');
                   setTempStartDate(tempStartDate);
                   setStartDate(date);account && getOrders(account.account_id, startDate, endDate)}}
                  // onChange={(date) => {console.log('=== >>>DATE === >> ',date); 
                  //   const tempStartDate = moment(date).format('DD-MM-YYYY');
                  //  setStartDate(tempStartDate);
                  //  account && getOrders(account.account_id, startDate, endDate)}}
                    
                /> 
              </div>
              <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
                <div className="input-label pb-0 text-nowrap pe-3">To</div>
                <DatePicker
                  className="input-select pointer w-100 ps-3"
                  selected={endDate}
                  dateFormat="dd.MM.yyyy"
                  // onChange={(date) => setEndDate(date)}

                  // onChange={(date) => {setEndDate(date);account && getOrders(account.account_id, startDate, endDate)}}

                  onChange={(date) => {
                    const tempEndDate = moment(date).format('DD-MM-YYYY');
                    setTempEndDate(tempEndDate)
                    setEndDate(date);account && getOrders(account.account_id, startDate, endDate)}}


                />
              </div> */}

              
            </div>


            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Ride Date and Time</th>
                  <th scope="col">Client name</th>
                  <th scope="col">Tariff</th>
                  <th scope="col">KM</th>
                  <th scope="col">Price</th>
                  <th scope="col">status</th>

                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {displayRideHistory.map((history, index) => {
                  return (
                    <tr key={index}>
                      <td>{history.pickup_date} {history.pickup_time}</td>
                      <td>{history.client_name}</td>
                      <td>{`${history.tariff_title} - ${
                        history.tariff_price
                      } CZK ${
                        history.tariff_type === "Custom" ? "/ km" : ""
                      }`}</td>
                      <td>{history.kilometers} km</td>
                      <td>{history.total_price} CZK</td>

                      {/* {history.orderStatus ==="accepted"  ? (
                <td style={{color: 'green'}}>
                {
                  value = history.orderStatus.charAt(0).toUpperCase() + history.orderStatus.slice(1)
                }
                </td>
              ) : (
                <td style={{color: '#d2d23a'}}>
                  {
                    value = history.orderStatus.charAt(0).toUpperCase() + history.orderStatus.slice(1)
                  }
                  </td>
              )} */}



{history.orderStatus ==="accepted"  && (
                <td style={{color: 'green'}}>
                {
                  value = history.orderStatus.charAt(0).toUpperCase() + history.orderStatus.slice(1)
                }
                </td>
              )} 
              {history.orderStatus ==="pending"  && (
                <td style={{color: '#d2d23a'}}>
                {
                  value = history.orderStatus.charAt(0).toUpperCase() + history.orderStatus.slice(1)
                }
                </td>
              )} 
              {history.orderStatus ==="rejected"  && (
                <td style={{color: 'red'}}>
                {
                  value = history.orderStatus.charAt(0).toUpperCase() + history.orderStatus.slice(1)
                }
                </td>
              )} 



                      <td
                        className="ps-3 pointer"
                        onClick={() =>
                          navigate(`/edit-order/${history.order_id}`)
                        }
                      >
                        Edit order
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex align-items-center justify-content-center pt-4 pagination">
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
                // <div className="box" />
                <div />
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
                // <div className="box" />
                <div />
              )}
            </div>
          </>

      </>
    );
  };

  return <Page navigations={["Home", "Ride history"]} content={getContent()} />;
};

export default RideHistory;
