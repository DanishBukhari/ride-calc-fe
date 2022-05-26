import DatePicker from "react-datepicker";
import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";


const RideHistory = () => {
  const [rideHistory, setRideHistory] = React.useState([]);
  const [displayRideHistory, setDisplayRideHistory] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const username = sessionStorage.getItem("username");
  const navigate = useNavigate();
  let value;
  let color;
  React.useEffect(() => {
    axios
      .get(`http://aridee.cz:8000/orders/user/${username}`, {
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

  // const getDate = (orderDate) => {
  //   const date = new Date(orderDate);
  //   return `${date.getDate()}.${
  //     date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  //   }.${date.getFullYear()} ${
  //     date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  //   }:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`;
  // };

  const [orders, setOrders] = React.useState([]);
  const [displayOrders, setDisplayOrders] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [account, setAccount] = React.useState(undefined);
  const [selectAccount, setSelectAccount] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const getDisplayDate = (date) => {
    return `${date.getDate()}.${
      date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    }.${date.getFullYear()}`;
  };

  const getDisplayTime = (date) => {
    return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
      date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    }`;
  };

  const getExportData = () => {
    const data = [];
    orders.forEach((order) => {
      data.push({
        created: `${order.order_date}`,
        account_name: order.account_name,
        tariff: `${order.tariff_title} - ${order.tariff_price} CZK ${
          order.tariff_type === "Custom" ? "/ km" : ""
        }`,
        pickup_address: `${order.pickup_address}`,
        delivery_address: `${order.destination_address}`,
        pickup_date_time: `${order.pickup_date} ${order.pickup_time}`,
        staff: `${order.staff_name}`,
        note: order.note,
        kilometers: `${order.kilometers} km`,
        total_price: `${order.total_price} CZK`,
      });
    });
    return data;
  };

  const getOrders = (accountId, startDate, endDate) => {
    axios
      .post(
        "http://aridee.cz:8000/orders/history",
        {
          accountId,
          // startDate: startDate.getDate()  + "." + (startDate.getMonth() + 1) + "." + startDate.getFullYear(),
          // endDate: endDate.getDate()  + "." + (endDate.getMonth() + 1) + "." + endDate.getFullYear(),
          startDate: startDate.getDate()  + "." + (startDate.getMonth()+1) + "." + startDate.getFullYear(),
          endDate: endDate.getDate()  + "." + (endDate.getMonth()+1) + "." + endDate.getFullYear(),
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
          setOrders(res.data);
          setDisplayOrders(_.cloneDeep(res.data).splice(0, 10));
        }
      });
  };

  const getAccounts = () => {
    axios
      .get("http://aridee.cz:8000/accounts", {
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

  React.useEffect(() => {
    account && getOrders(account.account_id, startDate, endDate);
  }, [account, startDate, endDate]);

  const getDate = (orderDate) => {
    const date = new Date(orderDate);
    return (
      <>
        <div>{getDisplayDate(date)}</div>
        <div>{getDisplayTime(date)}</div>
      </>
    );
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

  const moreInfo = (orderId) => {
    // navigate(`/order-history/${orderId}`);
    navigate(`/approve-order/${orderId}`);
    //navigate(`/drivers-listing`);

  };






//   const getContent = () => {
//     return (
//       <>
//         {!!displayRideHistory.length ? (
//           <>


//         <div className="row pb-4">
//           <div className="d-flex align-items-center col-lg-6 col-md-12 col-xs-12">
//             <div className="input-label pb-0 text-nowrap pe-3">
//               Select account
//             </div>
//             <div className="w-100" ref={ref}>
//               <div
//                 className="input-select pointer"
//                 onClick={() => setSelectAccount(true)}
//               >
//                 {account?.account_name}
//               </div>
//               {selectAccount && (
//                 <div className={`${accounts.length > 2 ? "dropdown" : ""}`}>
//                   {accounts.map((acc, index) => {
//                     return (
//                       <div
//                         className="option"
//                         key={index}
//                         onClick={() => {
//                           setSelectAccount(false);
//                           setAccount(acc);
//                         }}
//                       >
//                         {acc?.account_name}
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
//             <div className="input-label pb-0 text-nowrap pe-3">From</div>
//             <DatePicker
//               className="input-select pointer w-100 ps-3"
//               selected={startDate}
//               dateFormat="dd.MM.yyyy"
//               onChange={(date) => setStartDate(date)}
//             />
//           </div>
//           <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
//             <div className="input-label pb-0 text-nowrap pe-3">To</div>
//             <DatePicker
//               className="input-select pointer w-100 ps-3"
//               selected={endDate}
//               dateFormat="dd.MM.yyyy"
//               onChange={(date) => setEndDate(date)}
//             />
//           </div>
//         </div>
//         {!!displayOrders.length ? (
//           <>
//             <table className="table table-striped table-responsive mt-3">
//               <thead>
//                 <tr>
//                   <th scope="col">Ride Date and Time</th>
//                   <th scope="col">Account</th>
//                   <th scope="col">Tariff</th>
//                   <th scope="col">Note</th>
//                   <th scope="col">KM</th>
//                   <th scope="col">Total</th>
//                   <th scope="col">Status</th>
//                   <th scope="col"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayOrders.map((order, index) => {
//                   return (
//                     <tr key={index}>
//                       <td>{order.pickup_date} {order.pickup_time}</td>
//                       <td>{order.account_name}</td>
//                       <td>{`${order.tariff_title} - ${order.tariff_price} CZK ${
//                         order.tariff_type === "Custom" ? "/ km" : ""
//                       }`}</td>
//                       <td>{order.note}</td>
//                       <td>{order.kilometers} km</td>
//                       <td>{order.total_price} CZK</td>

                  
//               {/* {order.orderStatus ==="accepted"  ? (
//                 <td style={{color: 'green'}}>
//                 {
//                   value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
//                 }
//                 </td>
//               ) :
//               (
//                 <td style={{color: '#d2d23a'}}>
//                   {
//                     value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
//                   }
//                   </td>
//               )}  */}



// {order.orderStatus ==="accepted"  && (
//                 <td style={{color: 'green'}}>
//                 {
//                   value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
//                 }
//                 </td>
//               )} 
//               {order.orderStatus ==="pending"  && (
//                 <td style={{color: '#d2d23a'}}>
//                 {
//                   value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
//                 }
//                 </td>
//               )} 
//               {order.orderStatus ==="rejected"  && (
//                 <td style={{color: 'red'}}>
//                 {
//                   value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
//                 }
//                 </td>
//               )} 



                      
//                       <td>
//                         <div
//                           className="pointer"
//                           onClick={
//                             //navigate(`/edit-order/${order.order_id}`)
//                             () => moreInfo(order.order_id)
//                           }
//                         >
//                           MORE INFO
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="d-flex align-items-center justify-content-center pt-4 pagination">
//               {pageNo !== 1 ? (
//                 <AiFillCaretLeft
//                   className="pointer"
//                   onClick={() => {
//                     setPageNo(pageNo - 1);
//                     setDisplayOrders(
//                       _.cloneDeep(orders).splice(
//                         pageNo - 2 * 10,
//                         (pageNo - 1) * 10
//                       )
//                     );
//                   }}
//                 />
//               ) : (
//                 // <div className="box" />
//                 <div/>

//               )}
//               <div className="px-2">
//                 Page {pageNo} /{" "}
//                 {orders.length < 10 ? "1" : Math.ceil(orders.length / 10)}
//               </div>
//               {pageNo !== Math.ceil(orders.length / 10) ? (
//                 <AiFillCaretRight
//                   className="pointer"
//                   onClick={() => {
//                     setPageNo(pageNo + 1);
//                     setDisplayOrders(
//                       _.cloneDeep(orders).splice(
//                         pageNo * 10,
//                         (pageNo + 1) * 10 > orders.length
//                           ? orders.length
//                           : (pageNo + 1) * 10
//                       )
//                     );
//                   }}
//                 />
//               ) : (
//                 // <div className="box" />
//                 <div/>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="pt-4">No orders available</div>
//         )}
//         <div className="d-flex justify-content-end pt-3">
//            <CSVLink data={getExportData()} filename={"Order history"}>
//              <button className="green-button">Export</button>
//            </CSVLink>
//          </div>
        

            




//             {/* <table className="table table-striped table-responsive">
//               <thead>
//                 <tr>
//                   <th scope="col">Ride Date and Time</th>
//                   <th scope="col">Client name</th>
//                   <th scope="col">Tariff</th>
//                   <th scope="col">KM</th>
//                   <th scope="col">Price</th>
//                   <th scope="col">status</th>

//                   <th scope="col" />
//                 </tr>
//               </thead>
//               <tbody>
//                 {displayRideHistory.map((history, index) => {
//                   return (
//                     <tr key={index}>
//                       <td>{history.pickup_date} {history.pickup_time}</td>
//                       <td>{history.client_name}</td>
//                       <td>{`${history.tariff_title} - ${
//                         history.tariff_price
//                       } CZK ${
//                         history.tariff_type === "Custom" ? "/ km" : ""
//                       }`}</td>
//                       <td>{history.kilometers} km</td>
//                       <td>{history.total_price} CZK</td>
//                       <td>{history.orderStatus}</td>

//                       <td
//                         className="ps-3 pointer"
//                         onClick={() =>
//                           navigate(`/approve-order/${history.order_id}`)

                          
//                           // navigate(`/edit-order/${history.order_id}`)
//                         }
//                       >
//                         Edit order
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//             <div className="d-flex align-items-center justify-content-center pt-4 pagination">
//               {pageNo !== 1 ? (
//                 <AiFillCaretLeft
//                   className="pointer"
//                   onClick={() => {
//                     setPageNo(pageNo - 1);
//                     setDisplayRideHistory(
//                       _.cloneDeep(rideHistory).splice(
//                         pageNo - 2 * 10,
//                         (pageNo - 1) * 10
//                       )
//                     );
//                   }}
//                 />
//               ) : (
//                 // <div className="box" />
//                 <div/>
//               )}
//               <div className="px-2">
//                 Page {pageNo} /{" "}
//                 {rideHistory.length < 10
//                   ? "1"
//                   : Math.ceil(rideHistory.length / 10)}
//               </div>
//               {pageNo !== Math.ceil(rideHistory.length / 10) ? (
//                 <AiFillCaretRight
//                   className="pointer"
//                   onClick={() => {
//                     setPageNo(pageNo + 1);
//                     setDisplayRideHistory(
//                       _.cloneDeep(rideHistory).splice(
//                         pageNo * 10,
//                         (pageNo + 1) * 10 > rideHistory.length
//                           ? rideHistory.length
//                           : (pageNo + 1) * 10
//                       )
//                     );
//                   }}
//                 />
//               ) : (
//                 // <div className="box" />
//                 <div/>
//               )}
//             </div> */}
//           </>
//         ) : (
//           <div>No ride history available</div>
//         )}
//       </>
//     );
//   };


const getContent = () => {
  return (
    <>
      {/* {!!displayRideHistory.length ? ( */}
        {/* <> */}


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
      </div>
      {!!displayOrders.length ? (
        <>
          <table className="table table-striped table-responsive mt-3">
            <thead>
              <tr>
                <th scope="col">Ride Date and Time</th>
                <th scope="col">Account</th>
                <th scope="col">Tariff</th>
                <th scope="col">Note</th>
                <th scope="col">KM</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {displayOrders.map((order, index) => {
                return (
                  <tr key={index}>
                    <td>{order.pickup_date} {order.pickup_time}</td>
                    <td>{order.account_name}</td>
                    <td>{`${order.tariff_title} - ${order.tariff_price} CZK ${
                      order.tariff_type === "Custom" ? "/ km" : ""
                    }`}</td>
                    <td>{order.note}</td>
                    <td>{order.kilometers} km</td>
                    <td>{order.total_price} CZK</td>

                
            {/* {order.orderStatus ==="accepted"  ? (
              <td style={{color: 'green'}}>
              {
                value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
              }
              </td>
            ) :
            (
              <td style={{color: '#d2d23a'}}>
                {
                  value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
                }
                </td>
            )}  */}



{order.orderStatus ==="accepted"  && (
              <td style={{color: 'green'}}>
              {
                value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
              }
              </td>
            )} 
            {order.orderStatus ==="pending"  && (
              <td style={{color: '#d2d23a'}}>
              {
                value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
              }
              </td>
            )} 
            {order.orderStatus ==="rejected"  && (
              <td style={{color: 'red'}}>
              {
                value = order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)
              }
              </td>
            )} 



                    
                    <td>
                      <div
                        className="pointer"
                        onClick={
                          //navigate(`/edit-order/${order.order_id}`)
                          () => moreInfo(order.order_id)
                        }
                      >
                        MORE INFO
                      </div>
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
                  setDisplayOrders(
                    _.cloneDeep(orders).splice(
                      pageNo - 2 * 10,
                      (pageNo - 1) * 10
                    )
                  );
                }}
              />
            ) : (
              // <div className="box" />
              <div/>

            )}
            <div className="px-2">
              Page {pageNo} /{" "}
              {orders.length < 10 ? "1" : Math.ceil(orders.length / 10)}
            </div>
            {pageNo !== Math.ceil(orders.length / 10) ? (
              <AiFillCaretRight
                className="pointer"
                onClick={() => {
                  setPageNo(pageNo + 1);
                  setDisplayOrders(
                    _.cloneDeep(orders).splice(
                      pageNo * 10,
                      (pageNo + 1) * 10 > orders.length
                        ? orders.length
                        : (pageNo + 1) * 10
                    )
                  );
                }}
              />
            ) : (
              // <div className="box" />
              <div/>
            )}
          </div>
        </>
      ) : (
        <div className="pt-4">No orders available</div>
      )}
      <div className="d-flex justify-content-end pt-3">
         <CSVLink data={getExportData()} filename={"Order history"}>
           <button className="green-button">Export</button>
         </CSVLink>
       </div>
      

          




          {/* <table className="table table-striped table-responsive">
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
                        navigate(`/approve-order/${history.order_id}`)

                        
                        // navigate(`/edit-order/${history.order_id}`)
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
              <div/>
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
              <div/>
            )}
          </div> */}
        </>
    //   ) : (
    //     <div>No ride history available</div>
    //   )}
    // </>
  );
};

  return <Page navigations={["Home", "Order history"]} content={getContent()} />;
};

export default RideHistory;


