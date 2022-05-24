import "./Topbar.css";
import { useNavigate } from "react-router-dom";
import ChangePassword from "../ChangePassword/ChangePassword";

const Topbar = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-end topbar p-4">
      <div className="px-2">{sessionStorage.getItem("username")}</div> |{" "}
      <div className="px-2 pointer">
        <ChangePassword />
      </div>{" "}
      |{" "}
      <div
        className="px-2 pointer"
        onClick={() => {
          sessionStorage.clear();
          navigate("/login");
        }}
      >
        Log out
      </div>
    </div>
  );
};
export default Topbar;
