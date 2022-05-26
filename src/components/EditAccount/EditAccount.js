import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import "./EditAccount.css";
import { useLocation, useNavigate } from "react-router-dom";

const EditAccount = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [account, setAccount] = React.useState(state.account.account_name);
  const [accountAddress, setAccountAddress] = React.useState(
    state.account.account_address
  );
  const [accountEmail, setAccountEmail] = React.useState(
    state.account.account_email
  );
  const [accountPhone, setAccountPhone] = React.useState(
    state.account.account_phone
  );
  const [addFixTariff, setAddFixTariff] = React.useState(false);
  const [addCustomTariff, setAddCustomTariff] = React.useState(false);
  const [tariffs, setTariffs] = React.useState([]);
  const [newTariff, setNewTariff] = React.useState({
    tariffType: "",
    tariffTitle: "",
    tariffPrice: 0,
  });

  React.useState(() => {
    axios
      .get(
        `https://aridee.herokuapp.com/tariffs/account/${state.account.account_name}`
      )
      .then((res) => {
        if (res.status === 200) {
          const defaultTariffs = [];
          res.data.forEach((data) => {
            defaultTariffs.push({
              tariffType: data.tariff_type,
              tariffTitle: data.tariff_title,
              tariffPrice: data.tariff_price,
              tariff_id: data.tariff_id,
            });
          });
          setTariffs(defaultTariffs);
        }
      });
  }, [state.account.account_id]);

  const saveAccount = () => {
    axios
      .put(
        `https://aridee.herokuapp.com/accounts/${state.account.account_id}`,
        {
          account,
          accountAddress,
          accountEmail,
          accountPhone,
          tariffs,
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
          navigate("/accounts");
        }
      });
  };



  const deleteTarrif = (id) =>{
    //alert(driverName)
      axios
        .post(
          `https://aridee.herokuapp.com/tariffs/remove`,
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
            //alert('Tarrif Deleted Successfully')
            //navigate("/Tarrif-listing");
          } else {
            //setError("Error placing order, please try again");
          }
        })
        .catch();
}




  const getContent = () => {
    return (
      <>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div>
              <div className="input-label">Account</div>
              <input
                className="input w-100"
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <div className="input-label">Account address</div>
              <input
                className="input w-100"
                type="text"
                value={accountAddress}
                onChange={(e) => setAccountAddress(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <div className="input-label">Account email</div>
              <input
                className="input w-100"
                type="text"
                value={accountEmail}
                onChange={(e) => setAccountEmail(e.target.value)}
              />
            </div>
            <div className="pt-4">
              <div className="input-label">Account phone</div>
              <input
                className="input w-100"
                type="text"
                value={accountPhone}
                onChange={(e) => setAccountPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="col-lg-6 col-md-12 col-xs-12">
            <div>
              <div className="input-label">Tariff</div>
              <div className={`${!!tariffs.length ? "pb-3" : ""}`}>
                {tariffs.map((tariff, index) => {
                  return (
                    <div
                      key={index}
                      className="input d-flex justify-content-between mb-3"
                    >
                      <div>
                        {tariff.tariffTitle} - {tariff.tariffPrice} CZK
                      </div>
                      <div
                        className="remove pointer"
                        onClick={() => {
                          console.log('=== >>>> tariff === >>> ',tariff)
                          console.log('=== >>>> tariff.tariff_id === >>> ',tariff.tariff_id)
                          
                          deleteTarrif(tariff.tariff_id);
                          setTariffs(
                            tariffs.filter((t) => {
                              console.log('====>> t === >> ',t)
                              return t !== tariff;
                            })
                          );
                        }}
                      >
                        remove
                      </div>
                    </div>
                  );
                })}
              </div>
              {!addFixTariff && !addCustomTariff && (
                <div className="d-flex">
                  <button
                    className="blue-button"
                    onClick={() => {
                      setAddFixTariff(true);
                      setNewTariff({
                        ...newTariff,
                        tariffType: "Fixed",
                      });
                    }}
                  >
                    Add fixed tariff
                  </button>
                  <button
                    className="blue-button ms-4"
                    onClick={() => {
                      setAddCustomTariff(true);
                      setNewTariff({
                        ...newTariff,
                        tariffType: "Custom",
                      });
                    }}
                  >
                    Add custom tariff
                  </button>
                </div>
              )}
              {(addFixTariff || addCustomTariff) && (
                <>
                  <div className="input-label">
                    Add {addFixTariff ? "fixed" : "custom"} tariff
                  </div>
                  <input
                    className="input w-100"
                    type="text"
                    value={newTariff.tariffTitle}
                    onChange={(e) =>
                      setNewTariff({
                        ...newTariff,
                        tariffTitle: e.target.value,
                      })
                    }
                  />
                  <div className="pt-3 d-flex align-items-center">
                    <div className="input-label">
                      Tariff price {addCustomTariff && "for 1 km"}
                    </div>
                    <div className="w-100">
                      <input
                        className="input w-100"
                        type="number"
                        min="0"
                        value={newTariff.tariffPrice}
                        onChange={(e) =>
                          setNewTariff({
                            ...newTariff,
                            tariffPrice: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="ps-3">CZK</div>
                  </div>
                  <div className="d-flex justify-content-end pt-4">
                    <button
                      className="blue-button"
                      onClick={() => {
                        setTariffs([...tariffs, newTariff]);
                        setAddFixTariff(false);
                        setAddCustomTariff(false);
                        setNewTariff({
                          tariffType: "",
                          tariffTitle: "",
                          tariffPrice: 0,
                        });
                      }}
                    >
                      Save tariff
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end pt-4">
          <button className="green-button" onClick={saveAccount}>
            Save account
          </button>
        </div>
      </>
    );
  };

  return <Page navigations={["Home", "Edit account"]} content={getContent()} />;
};

export default EditAccount;
