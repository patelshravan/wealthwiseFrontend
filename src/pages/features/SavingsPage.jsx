import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import {
  getSavings,
  createSavings,
  updateSavings,
  deleteSavings,
} from "../../services/savings.service";
import { PreferencesContext } from "../../context/PreferencesContext";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";

const SavingsPage = () => {
  const [savings, setSavings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSaving, setNewSaving] = useState({
    amount: "",
    note: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const itemsPerPage = 5;

  const { prefs, exchangeRates } = useContext(PreferencesContext);

  const fetchSavings = async (token, search = "", page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await getSavings(token, search, page, limit);
      setSavings(res.data);
      setTotalPages(res.pages);
    } catch (err) {
      console.error("Failed to fetch savings:", err);
      toast.error("Failed to fetch savings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const debouncedFetch = debounce(() => {
      fetchSavings(token, searchTerm, currentPage, itemsPerPage);
    }, 500); // 500ms debounce

    debouncedFetch();

    return () => {
      debouncedFetch.cancel(); // Cleanup on unmount
    };
  }, [searchTerm, currentPage]);

  const handleChange = (e) => {
    setNewSaving((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdateSaving = async () => {
    if (!newSaving.amount) {
      toast.error("Please fill out the amount field.");
      return;
    }
    const token = localStorage.getItem("token");
    setSubmitLoading(true);
    try {
      if (editMode && selectedSaving) {
        const res = await updateSavings(selectedSaving._id, newSaving, token);
        toast.success(res.message);
        setSavings((prev) =>
          prev.map((sav) => (sav._id === selectedSaving._id ? res.data : sav))
        );
      } else {
        const res = await createSavings(newSaving, token);
        toast.success(res.message);
        setSavings((prev) => [...prev, res.data]);
      }
      setShowModal(false);
      setNewSaving({ amount: "", note: "" });
      setEditMode(false);
      setSelectedSaving(null);
    } catch (err) {
      console.error("Failed to save saving:", err);
      toast.error("Failed to save saving");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (saving) => {
    setEditMode(true);
    setSelectedSaving(saving);
    setNewSaving({
      amount: saving.amount,
      note: saving.note,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the saving.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteSavings(id, token);
        toast.success(res.message);
        setSavings((prev) => prev.filter((sav) => sav._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete saving");
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Savings</h4>
          <Form.Control
            type="text"
            placeholder="Search by note"
            className="w-50 w-md-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Add Saving
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
        ) : savings.length === 0 ? (
          <p className="text-muted text-center">No savings added yet.</p>
        ) : (
          <Table responsive hover bordered className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Sr. No.</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {savings.map((sav, index) => (
                <tr key={sav._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{formatDate(sav.date, prefs.dateFormat)}</td>
                  <td>
                    {formatCurrency(sav.amount, prefs.currency, exchangeRates)}
                  </td>
                  <td>{sav.note || "--"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(sav)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(sav._id)}
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
          <Modal.Title>{editMode ? "Edit Saving" : "Add Saving"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Amount (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newSaving.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Note</Form.Label>
              <Form.Control
                as="textarea"
                name="note"
                value={newSaving.note}
                onChange={handleChange}
                rows={2}
                placeholder="Optional note"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdateSaving} disabled={submitLoading}>
            {submitLoading && (
              <Spinner
                animation="border"
                role="status"
                size="sm"
                className="me-2"
              >
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            )}
            {editMode ? "Update" : "Add"} Saving
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SavingsPage;
