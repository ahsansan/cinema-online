import { useState } from "react";
import { Form, Modal, Alert } from "react-bootstrap";
import { API } from "../config/api";

export default ({ isVisible, onHide, filmId, title }) => {
  const [form, setForm] = useState({
    accountNumber: "",
    transferProof: "",
    idFilm: `${filmId}`,
  });

  const [status, setStatus] = useState({});
  const [preview, setPreview] = useState("");

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleOnSubmit = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set(
        "transferProof",
        form.transferProof[0],
        form.transferProof[0].name
      );
      formData.set("accountNumber", form.accountNumber);

      await API.post(`/transaction/${filmId}`, formData, config);

      setStatus({
        message:
          "Thank you for buying this film, please wait 1x24 hours because your transaction is in process",
        error: false,
      });

      setTimeout(() => {
        onHide();
        setStatus({});
      }, 1500);
    } catch (error) {
      console.log(error);
      setStatus({
        message: "Something went wrong with the server, please try again later",
        error: true,
      });
    }
  };

  return (
    <Modal
      centered
      show={isVisible}
      onHide={onHide}
      dialogClassName="info-modal-purchase"
    >
      <Modal.Body className="container-modal">
        {status.message && (
          <Alert variant={status.error ? "danger" : "success"}>
            {status.message}
          </Alert>
        )}
        <h3 style={{ textAlign: "center", marginBottom: "50px" }}>
          Cinema
          <span style={{ color: "#CD2E71" }}>Online</span> : 0981312323
        </h3>
        <h3 className="mb-3">{title}</h3>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnSubmit();
          }}
        >
          <Form.Group controlId="formBasicaccountNumber">
            <Form.Control
              name="accountNumber"
              onChange={handleOnChange}
              type="number"
              placeholder="Input your account number"
              className="input-account-number"
            />
          </Form.Group>
          {preview && (
            <img
              src={preview}
              className="img-fluid rounded preview-payment"
              width="25%"
            />
          )}
          <div>
            <label
              htmlFor="input-photo"
              className="d-flex flex-row tombol-upload-payment"
            >
              <p>Attach Payment</p>
              <img
                src="/attachment.svg"
                width={25}
                height={25}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <input
              type="file"
              id="input-photo"
              onChange={handleOnChange}
              name="transferProof"
              hidden
            />
          </div>
          <button type="submit" className="tombol-add-payment">
            Pay
          </button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
