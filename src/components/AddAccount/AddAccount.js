import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddAccount.css";
import { baseURL } from '../../config';

const AddAccount = () => {
  const navigate = useNavigate();
  const [account, setAccount] = React.useState("");
  const [accountAddress, setAccountAddress] = React.useState("");
  const [accountEmail, setAccountEmail] = React.useState("");
  const [accountPhone, setAccountPhone] = React.useState("");
  const [addFixTariff, setAddFixTariff] = React.useState(false);
  const [addCustomTariff, setAddCustomTariff] = React.useState(false);
  const [tariffs, setTariffs] = React.useState([]);
  const [newTariff, setNewTariff] = React.useState({
    tariffType: "",
    tariffTitle: "",
    tariffPrice: 0,
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (error) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  const createAccount = () => {
    axios
      .post(
        "http://aridee.cz:8000/accounts",
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
      })
      .catch((err) => setError("Error creating account, please try again"));
  };

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
                          setTariffs(
                            tariffs.filter((t) => {
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
                    <div className="input-label text-nowrap">
                      Tariff price {addCustomTariff && "for 1 km"}
                    </div>
                    <div className="w-100 ms-3">
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
          <button className="green-button" onClick={createAccount}>
            Create account
          </button>
        </div>
        {!error && (
          <div className="d-flex justify-content-end pt-3 error">{error}</div>
        )}
      </>
    );
  };

  return <Page navigations={["Home", "Add account"]} content={getContent()} />;
};

export default AddAccount;
