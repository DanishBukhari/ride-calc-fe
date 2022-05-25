import React from "react";
import Page from "../Page/Page";
import axios from "axios";
import { AiFillCaretLeft } from "react-icons/ai";
import { AiFillCaretRight } from "react-icons/ai";
import _ from "lodash";
import { useNavigate } from "react-router-dom";

const Accounts = () => {
  const [accounts, setAccounts] = React.useState([]);
  const [displayAccounts, setDisplayAccounts] = React.useState([]);
  const [pageNo, setPageNo] = React.useState(1);
  const navigate = useNavigate();

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
          setDisplayAccounts(
            _.cloneDeep(res.data).splice(
              (pageNo - 1) * 10,
              (pageNo - 1) * 10 > res.data.length
                ? accounts.length
                : pageNo * 10
            )
          );
        }
      });
  };

  React.useEffect(() => {
    getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteAccount = (accountId) => {
    axios
      .delete(`http://aridee.cz:8000/accounts/${accountId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          getAccounts();
        }
      });
  };

  const getContent = () => {
    return (
      <>
        {!!displayAccounts.length ? (
          <>
            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Account name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col" />
                </tr>
              </thead>
              <tbody>
                {displayAccounts.map((account, index) => {
                  return (
                    <tr key={index}>
                      <td>{account.account_name}</td>
                      <td>{account.account_email}</td>
                      <td>{account.account_phone}</td>
                      <td>
                        <div className="d-flex">
                          <span
                            className="pointer"
                            onClick={() =>
                              navigate("/edit-account", {
                                state: {
                                  account,
                                },
                              })
                            }
                          >
                            Edit account
                          </span>
                          <span
                            className="ps-3 pointer"
                            onClick={() => deleteAccount(account.account_id)}
                          >
                            Remove account
                          </span>
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
                    setDisplayAccounts(
                      _.cloneDeep(accounts).splice(
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
                {accounts.length < 10 ? "1" : Math.ceil(accounts.length / 10)}
              </div>
              {pageNo !== Math.ceil(accounts.length / 10) ? (
                <AiFillCaretRight
                  className="pointer"
                  onClick={() => {
                    setPageNo(pageNo + 1);
                    setDisplayAccounts(
                      _.cloneDeep(accounts).splice(
                        pageNo * 10,
                        (pageNo + 1) * 10 > accounts.length
                          ? accounts.length
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
          <div>No accounts available</div>
        )}
        <div className="d-flex justify-content-end pt-3">
          <button
            className="green-button"
            onClick={() => navigate("/create-account")}
          >
            Add account
          </button>
        </div>
      </>
    );
  };

  return <Page navigations={["Home", "Accounts"]} content={getContent()} />;
};

export default Accounts;
