import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import _ from "lodash";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = React.useState([]);
  const [displayOrders, setDisplayOrders] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const [accounts, setAccounts] = React.useState([]);
  const [driverName, setDriverName] = React.useState("");
  const [driverEmail, setDriverEmail] = React.useState("");
  const [account, setAccount] = React.useState(undefined);
  const [selectAccount, setSelectAccount] = React.useState(false);
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());
  const navigate = useNavigate();

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

  const createDriver = () =>{
      //alert(driverName)
        axios
          .post(
            "https://aridee.herokuapp.com/driver/add",
            {
              name: driverName,
              email: driverEmail
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
              },
            }
          )
          .then((res) => {
            if (res.status === 201) {
              navigate("/drivers-listing");
            } else {
              //setError("Error placing order, please try again");
            }
          })
          .catch();

  }

  const getOrders = (accountId, startDate, endDate) => {
    axios
      .post(
        "https://aridee.herokuapp.com/orders/history",
        {
          accountId,
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
          setOrders(res.data);
          setDisplayOrders(_.cloneDeep(res.data).splice(0, 10));
        }
      });
  };

  const getAccounts = () => {
    axios
      .get("https://aridee.herokuapp.com/accounts", {
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

    console.log('== >> here 22 == ??')

    navigate(`/order-history/${orderId}`);
  };

  const getContent = () => {
    return (
      <>
        <div className="row pb-4">
          <div className="d-flex align-items-center col-lg-6 col-md-12 col-xs-12">
            <div className="input-label pb-0 text-nowrap pe-3">
              Driver Name
            </div>
            {/* <div className="w-100" ref={ref}>
              <div
                className="input-select pointer"
                onClick={() => setSelectAccount(true)}
              >
                {account?.account_name}
              </div>
            </div> */}

                <input type="text" 
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                ></input>

                {/* <div className="w-100" ref={ref}>
              <div
                className="input-select pointer"
                onClick={() => setSelectAccount(true)}
              >
                {account?.account_name}
              </div>
              
            </div> */}



          </div>
          <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
            <div className="input-label pb-0 text-nowrap pe-3">Driver Email</div>
            <input type="text"
                value={driverEmail}
                onChange={(e) => setDriverEmail(e.target.value)}
            ></input>

          </div>
        </div>
        
        <div className="d-flex justify-content-end pt-3">
            <button className="green-button" onClick={()=>{createDriver()}}>Create Driver</button>
        </div>
      </>
    );
  };

  return (
    <Page navigations={["Home", "Order history"]} content={getContent()} />
  );
};

export default OrderHistory;
