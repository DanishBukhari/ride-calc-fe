import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [invalidCredentials, setInvalidCredentials] = React.useState("");

  const login = () => {
    if (username && password) {
      axios
        .post("https://aridee.herokuapp.com/users/login", {
          username,
          password,
        })
        .then((res) => {
          if (res.status === 200) {
            sessionStorage.setItem("accessToken", res.data.accessToken);
            sessionStorage.setItem("username", res.data.username);
            sessionStorage.setItem("role", res.data.role);
            navigate(res.data.role === "User" ? "/order" : "/accounts");
          }
        })
        .catch((err) => {
          setInvalidCredentials(err.response.data || "Error, please try again");
        });
    }
  };

  React.useEffect(() => {
    if (invalidCredentials) {
      setTimeout(() => setInvalidCredentials(""), 5000);
    }
  }, [invalidCredentials]);

  return (
    <div className="background">
      <div className="d-flex h-100 p-4">
        <div className="w-50 d-flex align-items-center">
          <div className="app-logo" />
          <div className="d-flex flex-column w-100 align-items-center">
            <div className="title">Let's order a ride</div>
            <div className="sub-title">Private system for ride order</div>
          </div>
        </div>
        <div className="w-50 d-flex align-items-center login-form">
          <div className="d-flex flex-column w-100">
            <div className="login-title">Login</div>
            <div className="login-fields w-100">
              <div>
                <div className="login-input-label">Your Username</div>
                <input
                  className="login-input w-100"
                  type="text"
                  onChange={(e) => setUserName(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      login();
                    }
                  }}
                />
              </div>
              <div className="pt-5">
                <div className="login-input-label">Your Password</div>
                <input
                  className="login-input w-100"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      login();
                    }
                  }}
                />
              </div>
              <div className="error pt-3">{invalidCredentials}</div>
            </div>
            <div>
              <button className="green-button" onClick={login}>
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
