import { useEffect, useState } from "react";
import {
  Table,
  Container,
  DropdownButton,
  Dropdown,
  Alert,
} from "react-bootstrap";
import { API } from "../config/api";
import NotFound from "../components/NotFound";
import "../styles/transaction.css";
import Aos from "aos";
import "aos/dist/aos.css";

export default () => {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const [transactions, setTransactions] = useState([]);
  const [isError, setIsError] = useState(false);
  const [msg, setMsg] = useState({ error: false, text: "" });

  const getTransactions = async () => {
    try {
      const resp = await API.get(`/transactions`);
      setTransactions(resp.data.data);
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
  };

  useEffect(() => {
    getTransactions();
  }, [msg.text]);

  if (isError) {
    return <NotFound />;
  }

  const updateStatus = async (id, val) => {
    try {
      await API.patch(`/transaction/${id}`, { status: val });
      setMsg({ error: false, text: "Transaction status update successfully" });
      getTransactions();
    } catch (err) {
      setMsg({
        error: true,
        text: "Something wrong with the server, please try again",
      });
    }

    setTimeout(() => {
      setMsg({ error: false, text: "" });
    }, 1500);
  };

  return (
    <Container
      className="mt-5"
      data-aos="fade-up"
      style={{ minHeight: "71vh" }}
    >
      <h1 className="mb-4 judul-transaksi">Incoming Transaction</h1>
      {msg.text && (
        <Alert variant={msg.error ? "danger" : "success"}>{msg.text}</Alert>
      )}
      <Table className="table table-striped table-dark table-hover">
        <thead>
          <tr style={{ color: "red" }}>
            <th>No</th>
            <th>User</th>
            <th>Transfer Proof</th>
            <th>Film</th>
            <th>Number Account</th>
            <th>Status Payment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((trans, index) => (
            <tr key={trans.id}>
              <td>{index + 1}</td>
              <td>{trans.user.fullName}</td>
              <td>
                <a
                  href={`http://localhost:5000/uploads/${trans.transferProof}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {trans.transferProof}
                </a>
              </td>
              <td>{trans.film.title}</td>
              <td>{trans.accountNumber}</td>
              <td
                style={{
                  color:
                    trans.status === "Approved"
                      ? "green"
                      : trans.status === "Pending"
                      ? "orange"
                      : "red",
                }}
              >
                <strong>{trans.status}</strong>
              </td>
              <td>
                <DropdownButton
                  id="dropdown-button"
                  bsPrefix="btn-action-menu"
                  title=""
                >
                  {trans.status === "Approved" ? (
                    <Dropdown.Item
                      className="action-container"
                      style={{ color: "red" }}
                      onClick={() => updateStatus(trans.id, "Canceled")}
                    >
                      Cancel
                    </Dropdown.Item>
                  ) : trans.status === "Pending" ? (
                    <div>
                      <Dropdown.Item
                        className="action-container"
                        style={{ color: "green" }}
                        onClick={() => updateStatus(trans.id, "Approved")}
                      >
                        Approve
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="action-container"
                        style={{ color: "red" }}
                        onClick={() => updateStatus(trans.id, "Canceled")}
                      >
                        Cancel
                      </Dropdown.Item>
                    </div>
                  ) : (
                    <Dropdown.Item
                      className="action-container"
                      style={{ color: "green" }}
                      onClick={() => updateStatus(trans.id, "Approved")}
                    >
                      Approve
                    </Dropdown.Item>
                  )}
                </DropdownButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
