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

  const [tarrifTittle, setTarrifTittle] = React.useState("");
  const [tarrifType, setTarrifType] = React.useState("");
  const [tarrifPrice, setTarrifPrice] = React.useState("");

  const username = sessionStorage.getItem("username");
  

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


  const createTarrif = () =>{
      //alert(driverName)
        axios
          .post(
            `/tariffs/add/${username}`,
            {
                tariff_title: tarrifTittle,
                tariff_type: tarrifType,
                tariff_price: tarrifPrice,
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
              navigate("/Tarrif-listing");
            } else {
              //setError("Error placing order, please try again");
            }
          })
          .catch();

  }

  const getOrders = (accountId, startDate, endDate) => {
    axios
      .post(
        "/orders/history",
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
              Title
            </div>
                <input type="text" 
                    value={tarrifTittle}
                    onChange={(e) => setTarrifTittle(e.target.value)}
                ></input>
          </div>
          <div className="d-flex align-items-center col-lg-3 col-md-06 col-xs-06" style={{marginLeft:'-226px'}} >
            <div className="input-label pb-0 text-nowrap pe-1">Type</div>
            <input type="text"
                value={tarrifType}
                onChange={(e) => setTarrifType(e.target.value)}
            ></input>

          </div>
          <div className="d-flex align-items-center col-lg-3 col-md-12 col-xs-12">
            <div className="input-label pb-0 text-nowrap pe-3">Price</div>
            <input type="text"
                value={tarrifPrice}
                onChange={(e) => setTarrifPrice(e.target.value)}
            ></input>

          </div>
        </div>
        
        <div className="d-flex justify-content-end pt-3">
            <button className="green-button" onClick={()=>{createTarrif()}}>Create Tarrif</button>
        </div>
      </>
    );
  };

  return (
    <Page navigations={["Home", "Order history"]} content={getContent()} />
  );
};

export default OrderHistory;
