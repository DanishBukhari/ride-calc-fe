import React from "react";
import "./Order.css";
import "./Popup.css";
import Page from "../Page/Page";
import DatePicker from "react-datepicker";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import LocationSearch from "../LocationSearch/LocationSearch";
import { getDistance } from "geolib";
import _ from "lodash";
import { AiOutlineDown } from "react-icons/ai";
import SelectSearch from 'react-select-search';
import Select from 'react-select';
import AsyncSelect from 'react-select/async'



const Order = (props) => {
  const navigate = useNavigate();
  const [tariffs, setTarrifs] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSelected, setIsSelected] = React.useState(false);

  const [driverList, setDriverList] = React.useState(false);

  const [tarrifList,setTarrifList] = React.useState([]);


  const [driverName, setDrivername] = React.useState("");


 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }


  const isDriverSelected = () => {
    setIsSelected(!isSelected);
  }

  const [tariff, setTariff] = React.useState(undefined);
  const [selectTariff, setSelectTariff] = React.useState(false);
  const [clientFullName, setClientFullName] = React.useState("");
  const [clientPhoneNumber, setClientPhoneNumber] = React.useState("");
  const [pickUpAddress, setPickUpAddress] = React.useState({
    latitude: "",
    longitude: "",
    address: "",
  });
  const [destinationAddress, setDestinationAddress] = React.useState({
    latitude: "",
    longitude: "",
    address: "",
  });
  const [pickUpDate, setPickUpDate] = React.useState(new Date());
  const [clearLocation, setClearLocation] = React.useState(false);
  const [clientEmail, setClientEmail] = React.useState("");
  const [staffName, setStaffName] = React.useState("");
  const [paymentType, setPaymentType] = React.useState("Cash");
  const [selectPaymentType, setSelectPaymentType] = React.useState(false);
  const paymentTypes = ["Cash", "Payment card"];
  const [note, setNote] = React.useState("");
  const { orderId } = useParams();
  const [kilometers, setKilometers] = React.useState("");

const [optionDrop, setOption] = React.useState([]);

const [acceptButton, setAcceptButton] = React.useState("Accept");





  const getPickUpTimings = () => {
    const interval = 10;
    var times = [];
    var tt = 0;

    for (var i = 0; tt < 24 * 60; i++) {
      var hh = Math.floor(tt / 60);
      var mm = tt % 60;
      times[i] = (hh < 10 ? "0" + hh : hh) + ":" + ("0" + mm).slice(-2);
      tt = tt + interval;
    }
    return times;
  };

  const [pickUpTime, setPickUpTime] = React.useState(getPickUpTimings()[0]);
  const [selectPickUpTime, setSelectPickUpTime] = React.useState(false);
  const [error, setError] = React.useState("");
  const username = "Hotel Praha";//sessionStorage.getItem("username");



  const getTariffs = (hasTariff = false) => {
    axios
      .get(
        `http://aridee.cz:8000/tariffs/account/${sessionStorage.getItem(
          "username"
        )}`,
        //`/tariffs/account/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {

          let temp=[]

            for(let i=0;i<res.data.length;i++)
            {
              if(res.data[i].isDeleted===0)
              {
                temp.push(res.data[i])
              }
            }

          setTarrifs(temp);


          //setTarrifs(res.data);
          setTariff(res.data[0]);


          console.log('=== >>> tarriffs',tariffs)
          console.log('=== >>> tariff',tariff)



        }
      });
  };

  React.useEffect(() => {
    if (orderId) {
      getTariffs(true);
      axios
        .get(`http://aridee.cz:8000/orders/${orderId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          if (res.status === 200) {
            const orderData = res.data[0];

            console.log('=== >> orderData == >>>',orderData)

            setTariff({
              account_id: orderData.account_id,
              tariff_id: orderData.tariff_id,
              tariff_type: orderData.tariff_type,
              tariff_title: orderData.tariff_title,
              tariff_price: orderData.tariff_price,
            });
            const orderPickUpDate = orderData.pickup_date.split(".");
            setClientFullName(orderData.client_name);
            setClientPhoneNumber(orderData.client_phone_number);
            setClientEmail(orderData.client_email);
            setStaffName(orderData.staff_name);
            orderPickUpDate.length === 3 &&
              setPickUpDate(
                new Date(
                  `${orderPickUpDate[2]}`,
                  `${orderPickUpDate[1] - 1}`,
                  `${orderPickUpDate[0]}`
                )
              );
            setPickUpTime(orderData.pickup_time);
            setPaymentType(orderData.payment_type);
            setNote(orderData.note);
            setPickUpAddress({
              latitude: "",
              longitude: "",
              address: orderData.pickup_address,
            });
            setDestinationAddress({
              latitude: "",
              longitude: "",
              address: orderData.destination_address,
            });
            setKilometers(orderData.kilometers);
          }
        });
    } else {
      clear();
      getTariffs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);


  React.useEffect(() => {
    axios
      .get(`http://aridee.cz:8000/driver/listing`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          let temp =[]
          for(let i=0;i<res.data.length;i++)
          {
            temp.push({
              label:res.data[i].name,
              value:res.data[i].name
            })
          }
          setOption(temp)
          
          setDriverList(res.data)

        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  
  React.useEffect(() => {
        
    if(sessionStorage.getItem('role')!=="User")
    { 
        
      axios
      .get(`http://aridee.cz:8000/tariffs`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          let temp =[]
          for(let i=0;i<res.data.length;i++)
          {
            temp.push({
              label:res.data[i].tariff_title,
              value:res.data[i].tariff_id
            })
          }
          setTarrifs(res.data);
          setTariff(res.data[0]);
          setTarrifList(temp)

        }
      });

    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // React.useEffect(() => {
  //   axios
  //     .get(`/tariffs`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
  //       },
  //     })
  //     .then((res) => {
  //       if (res.status === 200) {
  //         let temp =[]
  //         for(let i=0;i<res.data.length;i++)
  //         {
  //           temp.push({
  //             label:res.data[i].tariff_title,
  //             value:res.data[i].tariff_id
  //           })
  //         }
  //         setTarrifs(res.data);
  //         setTariff(res.data[0]);
  //         setTarrifList(temp)

  //       }
  //     });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);


  const getDriversList = () => {
    axios
      .get(`http://aridee.cz:8000/driver/listing`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.data
         
        }
      });
  }



  const useTariffOutsideClick = (ref) => {
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setSelectTariff(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const tariffRef = React.useRef(null);
  useTariffOutsideClick(tariffRef);

  const usePickupOutsideClick = (ref) => {
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setSelectPickUpTime(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const pickupRef = React.useRef(null);
  usePickupOutsideClick(pickupRef);

  const usePaymentTypeOutsideClick = (ref) => {
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setSelectPaymentType(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  const paymentTypeRef = React.useRef(null);
  usePaymentTypeOutsideClick(paymentTypeRef);

  const clear = () => {
    setTariff(tariffs[0]);
    setSelectTariff(false);
    setClientFullName("");
    setClientPhoneNumber("");
    setPickUpAddress({
      latitude: "",
      longitude: "",
      address: "",
    });
    setDestinationAddress({
      latitude: "",
      longitude: "",
      address: "",
    });
    setPickUpDate(new Date());
    setPickUpTime(getPickUpTimings()[0]);
    setClearLocation(true);
    setClientEmail("");
    setStaffName("");
    setPaymentType("Cash");
    setNote("");
  };

  

  React.useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  const calculateDistance = () => {
    const distance = Math.ceil(
      getDistance(
        {
          latitude: pickUpAddress.latitude,
          longitude: pickUpAddress.longitude,
        },
        {
          latitude: destinationAddress.latitude,
          longitude: destinationAddress.longitude,
        }
      ) / 1000
    );
    return _.isNaN(distance) ? 0 : distance;
  };

  const order = () => {
    axios
      .post(
        "http://aridee.cz:8000/orders",
        {
          orderStatus: 'pending',
          orderId,
          clientFullName,
          clientPhoneNumber,
          pickUpDate: `${pickUpDate.getDate()}.${
            pickUpDate.getMonth() + 1 < 10
              ? `0${pickUpDate.getMonth() + 1}`
              : pickUpDate.getMonth() + 1
          }.${pickUpDate.getFullYear()}`,
          pickUpTime,
          pickUpAddress: pickUpAddress.address,
          destinationAddress: destinationAddress.address,
          accountId: tariff?.account_id,
          tariffId: tariff?.tariff_id,
          kilometers:
            orderId && !calculateDistance() ? kilometers : calculateDistance(),
          totalPrice:
            tariff?.tariff_type === "Custom"
              ? tariff?.tariff_price *
                (orderId && !calculateDistance()
                  ? kilometers
                  : calculateDistance())
              : tariff?.tariff_price,
          clientEmail,
          staffName,
          paymentType,
          note,
          username: sessionStorage.getItem("username"),
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
          navigate("/ride-history");
        } else {
          setError("Error placing order, please try again");
        }
      })
      .catch((err) => setError("Error placing order, please try again"));
  };

  const getContent = () => {
    return (
      <>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div ref={tariffRef}>
              <div className="input-label">
                {props.viewOnly ? "Tariff" : "Select tariff"}
              </div>
              {props.viewOnly ? (
                <div className="input-select">{`${tariff?.tariff_title} - ${
                  tariff?.tariff_price
                } CZK ${tariff?.tariff_type === "Custom" ? "/ km" : ""}`}</div>
              ) : (
                <>
                  <div
                    className="d-flex justify-content-between input-select pointer w-100"
                    onClick={() => setSelectTariff(true)}
                  >
                    <div>{`${tariff?.tariff_title} - ${
                      tariff?.tariff_price
                    } CZK ${
                      tariff?.tariff_type === "Custom" ? "/ km" : ""
                    }`}</div>
                    <div>
                      <AiOutlineDown />
                    </div>
                  </div>
                  {selectTariff && (
                    <div className={`${tariffs.length > 2 ? "dropdown" : ""}`}>
                      {tariffs.map((tariff, index) => {
                        console.log('==== >>> tariff === ',tariff);
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectTariff(false);
                              setTariff(tariff);
                            }}
                          >
                            {`${tariff?.tariff_title} - ${
                              tariff?.tariff_price
                            } CZK ${
                              tariff?.tariff_type === "Custom" ? "/ km" : ""
                            }`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client full name</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientFullName) ? (
                    <span>&mdash;</span>
                  ) : (
                    clientFullName
                  )}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientFullName}
                  onChange={(e) => setClientFullName(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client phone number</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientPhoneNumber) ? (
                    <span>&mdash;</span>
                  ) : (
                    clientPhoneNumber
                  )}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientPhoneNumber}
                  onChange={(e) => setClientPhoneNumber(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client email</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientEmail) ? <span>&mdash;</span> : clientEmail}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Staff name</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(staffName) ? <span>&mdash;</span> : staffName}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div>
              <div className="input-label">Pickup address</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(pickUpAddress.address) ? (
                    <span>&mdash;</span>
                  ) : (
                    pickUpAddress.address
                  )}
                </div>
              ) : (
                <LocationSearch
                  address={pickUpAddress.address}
                  clearLocation={clearLocation}
                  onSelect={(latitude, longitude, address) =>
                    setPickUpAddress({ latitude, longitude, address })
                  }
                  onLocationCleared={() => setClearLocation(false)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Destination address</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(destinationAddress.address) ? (
                    <span>&mdash;</span>
                  ) : (
                    destinationAddress.address
                  )}
                </div>
              ) : (
                <LocationSearch
                  address={destinationAddress.address}
                  clearLocation={clearLocation}
                  onSelect={(latitude, longitude, address) =>
                    setDestinationAddress({ latitude, longitude, address })
                  }
                  onLocationCleared={() => setClearLocation(false)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-xs-12">
                  <div className="input-label">Pickup date</div>
                  {props.viewOnly ? (
                    <div className="input">
                      {`${new Date(pickUpDate).getDate()}.${
                        new Date(pickUpDate).getMonth() + 1 < 10
                          ? `0${new Date(pickUpDate).getMonth() + 1}`
                          : new Date(pickUpDate).getMonth() + 1
                      }.${new Date(pickUpDate).getFullYear()}`}
                    </div>
                  ) : (
                    <DatePicker
                      className="date-picker"
                      selected={pickUpDate}
                      dateFormat="dd.MM.yyyy"
                      onChange={(date) => setPickUpDate(date)}
                    />
                  )}
                </div>
                <div className="col-lg-6 col-md-12 col-xs-12">
                  <div className="input-label">Pickup time</div>
                  {props.viewOnly ? (
                    <div className="input">{pickUpTime}</div>
                  ) : (
                    <div ref={pickupRef}>
                      <div
                        className="pick-up-time w-100"
                        onClick={() => setSelectPickUpTime(true)}
                      >
                        {pickUpTime}
                      </div>
                      {selectPickUpTime && (
                        <div className="dropdown">
                          {getPickUpTimings().map((timing, index) => {
                            return (
                              <div
                                className="option"
                                key={index}
                                onClick={() => {
                                  setSelectPickUpTime(false);
                                  setPickUpTime(timing);
                                }}
                              >
                                {timing}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4" ref={paymentTypeRef}>
              <div className="input-label">Payment type</div>
              {props.viewOnly ? (
                <div className="input">{paymentType}</div>
              ) : (
                <>
                  <div
                    className="d-flex justify-content-between payment-type w-100"
                    onClick={() => setSelectPaymentType(true)}
                  >
                    <div>{paymentType}</div>
                    <div>
                      <AiOutlineDown />
                    </div>
                  </div>
                  {selectPaymentType && (
                    <div
                      className={`${paymentTypes.length > 2 ? "dropdown" : ""}`}
                    >
                      {paymentTypes.map((type, index) => {
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectPaymentType(false);
                              setPaymentType(type);
                            }}
                          >
                            {type}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Note</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(note) ? <span>&mdash;</span> : note}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="row order">
          <div className="col-lg-6 col-md-12 col-xs-12">
            {tariff?.tariff_type === "Custom" && (
              <>
                <div className="d-flex justify-content-between kilometers">
                  <div className="total-price-title">Kilometers:</div>
                  <div>
                    {orderId && !calculateDistance()
                      ? kilometers
                      : calculateDistance()}{" "}
                    km
                  </div>
                </div>
                <div className="d-flex justify-content-between kilometers">
                  <div className="total-price-title">Price per kilometer:</div>
                  <div>{tariff?.tariff_price} CZK / km</div>
                </div>
              </>
            )}
            <div className="d-flex justify-content-between total-price">
              <div className="total-price-title">Total price:</div>
              <div>
                {tariff?.tariff_type === "Custom"
                  ? tariff?.tariff_price *
                    (orderId && !calculateDistance()
                      ? kilometers
                      : calculateDistance())
                  : tariff?.tariff_price}{" "}
                CZK
              </div>
            </div>
          </div>

    {/* {isOpen && <Popup
      content={<>
        <button>Ok</button>
      </>}
      handleClose={togglePopup}
    />} */}

{isOpen && <>
  <div className="popup-box">
      <div className="box">
        <h1>Driver</h1>


      


      <Select
      
          options={optionDrop} 
      // current
            // onChange={(opt, meta) => {setDrivername(opt.value);isDriverSelected() } }
            onChange={(opt, meta) => {setDrivername(opt.value) } }
            
      />
      <button onClick={()=>{isDriverSelected();togglePopup();order(); setAcceptButton("Accepted") }}>Ok </button>

        <span className="close-icon" onClick={props.handleClose}>x</span>
        {/* <span className="close-icon" onClick={togglePopup()}>x</span> */}

        {props.content}
        
      </div>
    </div>
</>
}


          {!props.viewOnly && (
            <div className="col-lg-6 col-md-12 col-xs-12 d-flex align-items-end">
              
              <div className="d-flex">
           
                {/* <button className="green-button" onClick={togglePopup}> */}

                <button className="green-button"

                onClick={() => {order()}}
                > 

                  {orderId ? "Save" : "Order Now"}
                  {/* {orderId ? "Accept1" : "Order Now"} */}
                  {/* {orderId ? acceptButton : "Order Now"} */}

                  

                </button>

                {(!isSelected) && <>
                  <button className="blue-button ms-4" onClick={clear}>
                  Clear
                </button>
</>
}


{(isOpen || isSelected) && <>
                  <label>
                  {driverName}
                </label>
</>
}

                {/* <button className="blue-button ms-4" onClick={clear}>
                  Reject
                </button> */}
              
              
              
              </div>
            </div>
          )}
        </div>
        {!props.viewOnly && error && (
          <div className="row pt-3">
            <div className="col-lg-6 col-md-12 col-xs-12"></div>
            <div className="col-lg-6 col-md-12 col-xs-12">
              <div className="error">{error}</div>
            </div>
          </div>
        )}
      </>
    );
  };


  const getDrivers = () =>{
    return (
      <>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div ref={tariffRef}>
              <div className="input-label">
                {props.viewOnly ? "Tariff" : "Select tariff"}
              </div>
              {props.viewOnly ? (
                <div className="input-select">{`${tariff?.tariff_title} - ${
                  tariff?.tariff_price
                } CZK ${tariff?.tariff_type === "Custom" ? "/ km" : ""}`}</div>
              ) : (
                <>
                  <div
                    className="d-flex justify-content-between input-select pointer w-100"
                    onClick={() => setSelectTariff(true)}
                  >
                    <div>{`${tariff?.tariff_title} - ${
                      tariff?.tariff_price
                    } CZK ${
                      tariff?.tariff_type === "Custom" ? "/ km" : ""
                    }`}</div>
                    <div>
                      <AiOutlineDown />
                    </div>
                  </div>
                  {selectTariff && (
                    <div className={`${tariffs.length > 2 ? "dropdown" : ""}`}>
                      {tariffs.map((tariff, index) => {
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectTariff(false);
                              setTariff(tariff);
                            }}
                          >
                            {`${tariff?.tariff_title} - ${
                              tariff?.tariff_price
                            } CZK ${
                              tariff?.tariff_type === "Custom" ? "/ km" : ""
                            }`}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client full name</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientFullName) ? (
                    <span>&mdash;</span>
                  ) : (
                    clientFullName
                  )}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientFullName}
                  onChange={(e) => setClientFullName(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client phone number</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientPhoneNumber) ? (
                    <span>&mdash;</span>
                  ) : (
                    clientPhoneNumber
                  )}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientPhoneNumber}
                  onChange={(e) => setClientPhoneNumber(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Client email</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(clientEmail) ? <span>&mdash;</span> : clientEmail}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Staff name</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(staffName) ? <span>&mdash;</span> : staffName}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div>
              <div className="input-label">Pickup address</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(pickUpAddress.address) ? (
                    <span>&mdash;</span>
                  ) : (
                    pickUpAddress.address
                  )}
                </div>
              ) : (
                <LocationSearch
                  address={pickUpAddress.address}
                  clearLocation={clearLocation}
                  onSelect={(latitude, longitude, address) =>
                    setPickUpAddress({ latitude, longitude, address })
                  }
                  onLocationCleared={() => setClearLocation(false)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Destination address</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(destinationAddress.address) ? (
                    <span>&mdash;</span>
                  ) : (
                    destinationAddress.address
                  )}
                </div>
              ) : (
                <LocationSearch
                  address={destinationAddress.address}
                  clearLocation={clearLocation}
                  onSelect={(latitude, longitude, address) =>
                    setDestinationAddress({ latitude, longitude, address })
                  }
                  onLocationCleared={() => setClearLocation(false)}
                />
              )}
            </div>
            <div className="pt-4">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-xs-12">
                  <div className="input-label">Pickup date</div>
                  {props.viewOnly ? (
                    <div className="input">
                      {`${new Date(pickUpDate).getDate()}.${
                        new Date(pickUpDate).getMonth() + 1 < 10
                          ? `0${new Date(pickUpDate).getMonth() + 1}`
                          : new Date(pickUpDate).getMonth() + 1
                      }.${new Date(pickUpDate).getFullYear()}`}
                    </div>
                  ) : (
                    <DatePicker
                      className="date-picker"
                      selected={pickUpDate}
                      dateFormat="dd.MM.yyyy"
                      onChange={(date) => setPickUpDate(date)}
                    />
                  )}
                </div>
                <div className="col-lg-6 col-md-12 col-xs-12">
                  <div className="input-label">Pickup time</div>
                  {props.viewOnly ? (
                    <div className="input">{pickUpTime}</div>
                  ) : (
                    <div ref={pickupRef}>
                      <div
                        className="pick-up-time w-100"
                        onClick={() => setSelectPickUpTime(true)}
                      >
                        {pickUpTime}
                      </div>
                      {selectPickUpTime && (
                        <div className="dropdown">
                          {getPickUpTimings().map((timing, index) => {
                            return (
                              <div
                                className="option"
                                key={index}
                                onClick={() => {
                                  setSelectPickUpTime(false);
                                  setPickUpTime(timing);
                                }}
                              >
                                {timing}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4" ref={paymentTypeRef}>
              <div className="input-label">Payment type</div>
              {props.viewOnly ? (
                <div className="input">{paymentType}</div>
              ) : (
                <>
                  <div
                    className="d-flex justify-content-between payment-type w-100"
                    onClick={() => setSelectPaymentType(true)}
                  >
                    <div>{paymentType}</div>
                    <div>
                      <AiOutlineDown />
                    </div>
                  </div>
                  {selectPaymentType && (
                    <div
                      className={`${paymentTypes.length > 2 ? "dropdown" : ""}`}
                    >
                      {paymentTypes.map((type, index) => {
                        return (
                          <div
                            className="option"
                            key={index}
                            onClick={() => {
                              setSelectPaymentType(false);
                              setPaymentType(type);
                            }}
                          >
                            {type}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="pt-4">
              <div className="input-label">Note</div>
              {props.viewOnly ? (
                <div className="input">
                  {_.isEmpty(note) ? <span>&mdash;</span> : note}
                </div>
              ) : (
                <input
                  className="input w-100"
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        <div className="row order">
          <div className="col-lg-6 col-md-12 col-xs-12">
            {tariff?.tariff_type === "Custom" && (
              <>
                <div className="d-flex justify-content-between kilometers">
                  <div className="total-price-title">Kilometers:</div>
                  <div>
                    {orderId && !calculateDistance()
                      ? kilometers
                      : calculateDistance()}{" "}
                    km
                  </div>
                </div>
                <div className="d-flex justify-content-between kilometers">
                  <div className="total-price-title">Price per kilometer:</div>
                  <div>{tariff?.tariff_price} CZK / km</div>
                </div>
              </>
            )}
            <div className="d-flex justify-content-between total-price">
              <div className="total-price-title">Total price:</div>
              <div>
                {tariff?.tariff_type === "Custom"
                  ? tariff?.tariff_price *
                    (orderId && !calculateDistance()
                      ? kilometers
                      : calculateDistance())
                  : tariff?.tariff_price}{" "}
                CZK
              </div>
            </div>
          </div>
          {!props.viewOnly && (
            <div className="col-lg-6 col-md-12 col-xs-12 d-flex align-items-end">
              <div className="d-flex">
                <button className="green-button" onClick={order}>
                  {/* {orderId ? "Save" : "Order Now"} */}
                  {orderId ? "Accept" : "Order Now"}

                </button>
                <button className="blue-button ms-4" onClick={clear}>
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
        {!props.viewOnly && error && (
          <div className="row pt-3">
            <div className="col-lg-6 col-md-12 col-xs-12"></div>
            <div className="col-lg-6 col-md-12 col-xs-12">
              <div className="error">{error}</div>
            </div>
          </div>
        )}
      </>
    );
  }

  // const isDriverSelected = () => {


    
  // }




  return <Page navigations={["Home", "Order a ride"]} content={getContent()} />;



};

export default Order;
