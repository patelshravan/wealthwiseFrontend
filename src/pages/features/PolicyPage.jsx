import React, { useEffect, useState } from "react";
import { Card, Table, Button, Form, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import {
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../../services/policy.service";

const PolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPolicy, setNewPolicy] = useState({
    policyNumber: "",
    policyName: "",
    premiumAmount: "",
    dueDate: "",
    premiumMode: "monthly",
    lastPaidDate: "",
    maturityDate: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const itemsPerPage = 5;

  const fetchPolicies = async (token, search = "", page = 1, limit = 5) => {
    setLoading(true);
    try {
      const res = await getPolicy(token, search, page, limit);
      setPolicies(res.data);
      setTotalPages(res.pages);
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      toast.error("Failed to fetch policies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const debouncedFetch = debounce(() => {
      fetchPolicies(token, searchTerm, currentPage, itemsPerPage);
    }, 500); // 500ms debounce

    debouncedFetch();

    return () => {
      debouncedFetch.cancel(); // Cleanup on unmount
    };
  }, [searchTerm, currentPage]);

  const handleChange = (e) => {
    setNewPolicy((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdatePolicy = async () => {
    const { policyNumber, policyName, premiumAmount, dueDate, maturityDate } =
      newPolicy;

    if (
      !policyNumber ||
      !policyName.trim() ||
      !premiumAmount ||
      !dueDate ||
      !maturityDate
    ) {
      toast.error("Please fill out all policy fields before submitting.");
      return;
    }
    const token = localStorage.getItem("token");
    setSubmitLoading(true);
    try {
      if (editMode && selectedPolicy) {
        const res = await updatePolicy(selectedPolicy._id, newPolicy, token);
        toast.success(res.message);
        setPolicies((prev) =>
          prev.map((lic) => (lic._id === selectedPolicy._id ? res.data : lic))
        );
      } else {
        const res = await createPolicy(newPolicy, token);
        toast.success(res.message);
        setPolicies((prev) => [...prev, res.data]);
      }

      setShowModal(false);
      setNewPolicy({
        policyNumber: "",
        policyName: "",
        premiumAmount: "",
        dueDate: "",
        premiumMode: "monthly",
        lastPaidDate: "",
        maturityDate: "",
      });
      setEditMode(false);
      setSelectedPolicy(null);
    } catch (err) {
      console.error("Failed to save policy:", err);
      toast.error("Failed to save policy");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (policy) => {
    setEditMode(true);
    setSelectedPolicy(policy);

    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : "";

    setNewPolicy({
      policyNumber: policy.policyNumber,
      policyName: policy.policyName,
      premiumAmount: policy.premiumAmount,
      dueDate: formatDate(policy.dueDate),
      premiumMode: policy.premiumMode,
      lastPaidDate: formatDate(policy.lastPaidDate),
      maturityDate: formatDate(policy.maturityDate),
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the policy.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deletePolicy(id, token);
        toast.success(res.message);
        setPolicies((prev) => prev.filter((lic) => lic._id !== id));
      } catch (err) {
        console.error("Delete failed:", err);
        toast.error("Failed to delete policy");
      }
    }
  };

  return (
    <>
      <Card className="p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">LIC Policies</h4>
          <Form.Control
            type="text"
            placeholder="Search by policy number, name or premium amount"
            className="w-50 w-md-75"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => setShowModal(true)}>
            <FaPlus className="me-2" /> Add Policy
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
        ) : policies.length === 0 ? (
          <p className="text-muted text-center">No policies added yet.</p>
        ) : (
          <Table responsive hover bordered className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Sr. No.</th>
                <th>Policy Number</th>
                <th>Policy Name</th>
                <th>Premium Amount</th>
                <th>Due Date</th>
                <th>Next Due Date</th>
                <th>Maturity Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((lic, index) => (
                <tr key={lic._id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{lic.policyNumber}</td>
                  <td>{lic.policyName}</td>
                  <td>₹ {Number(lic.premiumAmount).toLocaleString("en-IN")}</td>
                  <td>{new Date(lic.dueDate).toDateString()}</td>
                  <td>{new Date(lic.nextDueDate).toDateString()}</td>
                  <td>{new Date(lic.maturityDate).toDateString()}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEdit(lic)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(lic._id)}
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
          <Modal.Title>{editMode ? "Edit Policy" : "Add Policy"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Policy Number <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="policyNumber"
                value={newPolicy.policyNumber}
                onChange={handleChange}
                placeholder="e.g., 561394567"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Policy Name <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="policyName"
                value={newPolicy.policyName}
                onChange={handleChange}
                placeholder="e.g., Jeevan Labh"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Premium Amount (₹) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="premiumAmount"
                value={newPolicy.premiumAmount}
                onChange={handleChange}
                placeholder="Enter premium amount"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Due Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="dueDate"
                value={newPolicy.dueDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                Premium Mode <span className="text-danger">*</span>
              </Form.Label>
              <Form.Select
                name="premiumMode"
                value={newPolicy.premiumMode}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half-yearly">Half-Yearly</option>
                <option value="yearly">Yearly</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Paid Date</Form.Label>
              <Form.Control
                type="date"
                name="lastPaidDate"
                value={newPolicy.lastPaidDate}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>
                Maturity Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                name="maturityDate"
                value={newPolicy.maturityDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            disabled={submitLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleAddOrUpdatePolicy} disabled={submitLoading}>
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
            {editMode ? "Update" : "Add"} Policy
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PolicyPage;
