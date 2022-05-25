import { Modal } from "react-bootstrap";
import React from "react";
import axios from "axios";

const ChangePassword = () => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [newPassword, setNewPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const change = () => {
    axios
      .post(
        "http://aridee.cz:8000/users/changePassword",
        {
          username: sessionStorage.getItem("username"),
          newPassword,
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
          handleClose();
          setError("");
        } else {
          setError("Error changing password, please try again");
        }
      })
      .catch((err) => setError("Error changing password, please try again"));
  };

  return (
    <>
      <div onClick={handleShow}>Change password</div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="input-label">New password</div>
            <input
              className="input w-100"
              type="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="error pt-2">{error}</div>
          <div className="d-flex justify-content-center pt-4">
            <div className="blue-button" onClick={change}>
              Change
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
export default ChangePassword;
