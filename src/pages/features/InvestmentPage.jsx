import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import {
  getInvestment,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from "../../services/investment.service";

const InvestmentPage = () => {
  const [investments, setInvestments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    startDate: "",
    type: "",
    name: "",
    amountInvested: "",
    currentValue: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  const fetchInvestment = async (token, search = "", page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await getInvestment(token, search, page, limit);
      setInvestments(res.data);
      setTotalPages(res.pages);
    } catch (err) {
      console.error("Failed to fetch investments:", err);
      toast.error("Failed to fetch investments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const debouncedFetch = debounce(() => {
      fetchInvestment(token, searchTerm, currentPage, itemsPerPage);
    }, 500); // 500ms debounce

    debouncedFetch();

    return () => {
      debouncedFetch.cancel(); // Cleanup on unmount
    };
  }, [searchTerm, currentPage]);

  const handleChange = (e) => {
    setNewInvestment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdateInvestment = async () => {
    const token = localStorage.getItem("token");

    try {
      if (editMode && selectedInvestment) {
        const res = await updateInvestment(
          selectedInvestment._id,
          newInvestment,
          token
        );
        toast.success(res.message);
        setInvestments((prev) =>
          prev.map((inv) =>
            inv._id === selectedInvestment._id ? res.data : inv
          )
        );
      } else {
        const res = await createInvestment(newInvestment, token);
        toast.success(res.message);
        setInvestments((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      setNewInvestment({ category: "", amount: "", note: "" });
      setEditMode(false);
      setSelectedInvestment(null);
    } catch (err) {
      console.error("Failed to save investment:", err);
      toast.error("Failed to save investment");
    }
  };

  const handleEdit = (investment) => {
    setEditMode(true);
    setSelectedInvestment(investment);

    // Format the startDate to YYYY-MM-DD
    const formattedStartDate = investment.startDate
      ? new Date(investment.startDate).toISOString().split("T")[0]
      : "";

    setNewInvestment({
      startDate: formattedStartDate,
      type: investment.type,
      name: investment.name,
      amountInvested: investment.amountInvested,
      currentValue: investment.currentValue,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the investment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteInvestment(id, token);
        toast.success(res.message);
        setInvestments((prev) => prev.filter((inv) => inv._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete investment");
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h4 className="mb-0">Investment</h4>
          <Form.Control
            type="text"
            placeholder="Search by name"
            className="w-50 w-md-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setShowModal(true)} className="ms-auto">
            <FaPlus className="me-2" /> Add Investment
          </Button>
        </div>
      </Card>

      <Card className="p-3 shadow-sm">
        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : investments.length === 0 ? (
          <p className="text-muted text-center">No investments added yet.</p>
        ) : (
          <Table responsive hover bordered className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Start Date</th>
                <th>Type</th>
                <th>Name</th>
                <th>Amount Invested</th>
                <th>Current Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, index) => (
                <tr key={inv._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{new Date(inv.startDate).toDateString()}</td>{" "}
                  <td>{inv.type}</td>
                  <td>{inv.name}</td>
                  <td>₹ {inv.amountInvested}</td>
                  <td>₹ {inv.currentValue}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(inv)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(inv._id)}
                    >
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <div className="d-flex justify-content-end mt-3 align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Edit Investment" : "Add Investment"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newInvestment.startDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={newInvestment.type}
                onChange={handleChange}
                placeholder="Enter type"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newInvestment.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Amount Invested (₹)</Form.Label>
              <Form.Control
                type="number"
                name="amountInvested"
                value={newInvestment.amountInvested}
                onChange={handleChange}
                placeholder="Enter amount invested"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Current Value (₹)</Form.Label>
              <Form.Control
                type="number"
                name="currentValue"
                value={newInvestment.currentValue}
                onChange={handleChange}
                rows={2}
                placeholder="Enter current value"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateInvestment}>
            {editMode ? "Update" : "Add"} Investment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvestmentPage;
