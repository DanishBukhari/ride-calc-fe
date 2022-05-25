import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

import Icon from "react-crud-icons";

const RideHistory = () => {
  const [rideHistory, setRideHistory] = React.useState([]);
  const [displayRideHistory, setDisplayRideHistory] = React.useState([]);
  const username = "Hotel Praha";//sessionStorage.getItem("username");
  const navigate = useNavigate();

  React.useEffect(() => {
    axios
    //   .get(`http://aridee.cz:8000/orders/user/${username}`, {
      .get(`http://aridee.cz:8000/tariffs/account/${username}`, {
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


  const navigateToAddTarrif = () =>{
        navigate("/Tarrif-Add");
  }

  const deleteTarrif = (id) =>{
    //alert(driverName)
      axios
        .post(
          `http://aridee.cz:8000/tariffs/remove`,
          {
            tarrif_id: id,
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
            alert('Tarrif Deleted Successfully')
            navigate("/Tarrif-listing");
          } else {
            //setError("Error placing order, please try again");
          }
        })
        .catch();

}


  const getContent = () => {
    return (
      <>
      
            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Type</th>
                  <th scope="col">Price</th>
                  <th></th>

                </tr>
              </thead>
              <tbody>
                {displayRideHistory.map((history, index) => {
                  return (
                    <tr key={index}>
                      {/* <td>{history.pickup_date} {history.pickup_time}</td> */}
                      <td>{history.tariff_title}</td>
                      <td>{history.tariff_type}</td>
                      <td>{history.tariff_price}</td>
                      <td style={{height:'20px'}}> <Icon
        name = "delete"
        theme = "light"
        size = "tiny"
        onClick={()=>{deleteTarrif(history.tariff_id)}}
      /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div>
            <button className="green-button" onClick={()=>{
                navigateToAddTarrif()
            }}>
                Add Tarrif
                </button>
            </div>
          </>
        
    );
  };


  return <Page navigations={["Home", "Tarrif Listing"]} content={getContent()} />;
};

export default RideHistory;
