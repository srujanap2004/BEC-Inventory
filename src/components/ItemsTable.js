import React, { useState, useEffect } from "react";
import { Input, Button, Modal, message, DatePicker, Select } from "antd";
import axios from "axios";
import moment from 'moment';

const { Option } = Select;

const ItemsTable = ({ itemsData, setItemsData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Track modal visibility
  const [modalData, setModalData] = useState({}); // Track data for issuing an item
  const [issueQuantity, setIssueQuantity] = useState(""); // Track the quantity to be issued
  const [issuedTo, setIssuedTo] = useState(""); // Track the person to whom the item is issued
  const [issuedBy, setIssuedBy] = useState(localStorage.getItem("username") || "Unknown User"); // Track the person issuing the item
  const [editingRow, setEditingRow] = useState(null); // Track the row being edited
  const [updatedRow, setUpdatedRow] = useState({}); // Track the updated row data

  useEffect(() => {
    // Function to periodically check and delete items with zero quantity
    const checkAndDeleteZeroQuantityItems = async () => {
      try {
        // Fetch all items
        const response = await axios.get("http://localhost:5000/items");
        const items = response.data;

        // Filter items with quantity equal to zero
        const zeroQuantityItems = items.filter((item) => item.quantity === 0);

        // Delete each item with quantity equal to zero
        for (const item of zeroQuantityItems) {
          await axios.delete(`http://localhost:5000/items/${item.id}`);
          console.log(`Deleted item with ID ${item.id} due to zero quantity.`);
        }

        // Refresh the items table
        fetchItems();
      } catch (error) {
        console.error("Error checking and deleting zero quantity items:", error);
        message.error("Failed to check and delete zero quantity items. Please try again later.");
      }
    };

    // Call the function initially
    checkAndDeleteZeroQuantityItems();

    // Set interval to run the function periodically (e.g., every 5 minutes)
    const intervalId = setInterval(checkAndDeleteZeroQuantityItems, 300000); // 300000 ms = 5 minutes

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const fetchItems = async (category) => {
    try {
      console.log("Selected category:", category); // Debugging log
      const response = await axios.get("http://localhost:5000/items");
      console.log("Fetched items:", response.data); // Debugging log
      // Filter items based on the selected category (case-insensitive)
      const filteredItems = response.data.filter(
        (item) => item.category_name === category
      );
      setItemsData(filteredItems);
      console.log("Filtered items:", filteredItems); // Debugging log
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to fetch items. Please try again later.");
    }
  };
  
  // Handle Issue button click
  const handleIssue = (item) => {
    setModalData(item); // Set the item data for the modal
    setIssueQuantity(""); // Reset the issue quantity
    setIssuedTo(""); // Reset the issuedTo field
    setIssuedBy(localStorage.getItem("username") || "Unknown User"); // Reset the issuedBy field
    setIsModalVisible(true); // Show the modal
  };

  // Handle Modal OK button click
  const handleModalOk = async () => {
    if (!issueQuantity || issueQuantity <= 0) {
      message.error("Please enter a valid quantity to issue.");
      return;
    }
  
    if (issueQuantity > modalData.quantity) {
      message.error("Issued quantity cannot exceed available quantity.");
      return;
    }
  
    const payload = {
      item_id: modalData.id,
      item: modalData.name,
      quantity: issueQuantity,
      issued_by: issuedBy,
      issue_date: new Date().toISOString().split("T")[0],
      issued_to: issuedTo,
      brand: modalData.brand,
      units: modalData.units,
      unit_price: modalData.unit_price,
      domain: modalData.domain,
      category_name: modalData.category_name,
    };
  
    try {
      const response = await axios.post("http://localhost:5000/issue", payload);
  
      if (response.data.success) {
        message.success("Item issued successfully!");
        fetchItems(); // Refresh the items table
        setIsModalVisible(false); // Close the modal
      } else {
        message.error(response.data.message || "Failed to issue item. Please try again.");
      }
    } catch (error) {
      console.error("Error issuing item:", error);
      message.error("Failed to issue item. Please try again later.");
    }
  };

  // Handle Modal Cancel button click
  const handleModalCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  // Handle Modify button click
  const handleModify = (item) => {
    setEditingRow(item.id); // Set the row being edited
    setUpdatedRow(item); // Set the initial data for the row being edited
  };

  // Handle Save button click
  const handleSave = async () => {
    try {
      // Send the updated row data to the backend
      const response = await axios.put(`http://localhost:5000/items/${editingRow}`, updatedRow);
      if (response.data.success) {
        message.success("Item updated successfully!");
        // Update the itemsData state with the modified row
        setItemsData((prev) =>
          prev.map((item) => (item.id === editingRow ? { ...item, ...updatedRow } : item))
        );
        setEditingRow(null); // Exit editing mode
        setUpdatedRow({});
      } else {
        message.error("Failed to update item. Please try again.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      message.error("Failed to update item. Please try again later.");
    }
  };

  // Handle Cancel button click for editing
  const handleCancelEdit = () => {
    setEditingRow(null); // Exit editing mode without saving
    setUpdatedRow({});
  };

  const getRowStyle = (item) => {
    if (item.expiry_date) {
      const expiry = moment(item.expiry_date);
      const now = moment();
      const diff = expiry.diff(now, 'days');
      if (diff <= 7 && diff >= 0) {
        return { backgroundColor: '#ffcccc' }; // Red background for expiry within 1 week
      }
    }
    return {}; // No special styling
  };

  return (
    <div>
      <h2>Items</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Quantity</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Units</th>
             <th style={{ border: "1px solid #ddd", padding: 8 }}>Expiry Date</th>
            <th style={{ border: "1px solid #ddd", padding: 8 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {itemsData.map((item) => (
            <tr
              key={item.id}
              style={getRowStyle(item)}
            >
              {editingRow === item.id ? (
                <>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.id}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <Input
                      value={updatedRow.name}
                      onChange={(e) => setUpdatedRow({ ...updatedRow, name: e.target.value })}
                    />
                  </td>
                  
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <Input
                      value={updatedRow.quantity}
                      onChange={(e) =>
                        setUpdatedRow({ ...updatedRow, quantity: e.target.value })
                      }
                    />
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>
                    <Input
                      value={updatedRow.units}
                      onChange={(e) => setUpdatedRow({ ...updatedRow, units: e.target.value })}
                    />
                  </td>
                   <td style={{ border: "1px solid #ddd", padding: 8 }}>
                     <DatePicker
                      value={updatedRow.expiry_date ? moment(updatedRow.expiry_date) : null}
                      onChange={(date) =>
                       setUpdatedRow({
                       ...updatedRow,
                       expiry_date: date ? date.format("YYYY-MM-DD") : null,
                       })
                       }
                       style={{ width: "100%" }}
                       />
                   </td>
                  
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                    <Button type="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button type="default" onClick={handleCancelEdit} style={{ marginLeft: 8 }}>
                      Cancel
                    </Button>
                  </td>
                </>
              ) : (
                <>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>{item.id}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.name}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.units}</td>
                   <td style={{ border: "1px solid #ddd", padding: 8 }}>
                     {item.expiry_date ? moment(item.expiry_date).format("DD-MM-YYYY ") : "N/A"}
                   </td>
                  <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                      <Button
                        type="primary"
                        onClick={() => handleModify(item)} // Trigger handleModify with the item
                      >
                        Modify
                      </Button>
                      <Button
                        type="default"
                        onClick={() => handleIssue(item)} // Trigger handleIssue with the item
                      >
                        Issue
                      </Button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Issuing Items */}
      <Modal
        title="Issue Item"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Issue"
        cancelText="Cancel"
      >
        <p>
          <strong>Item:</strong> {modalData.name}
        </p>
        <p>
          <strong>Available Quantity:</strong> {modalData.quantity}
        </p>
        <div style={{ marginBottom: "10px" }}>
          <strong>Quantity to Issue:</strong>
          <Input
            placeholder="Enter quantity to issue"
            value={issueQuantity}
            onChange={(e) => setIssueQuantity(Number(e.target.value))}
            type="number"
            style={{ marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Issued To:</strong>
          <Input
            placeholder="Enter recipient name"
            value={issuedTo}
            onChange={(e) => setIssuedTo(e.target.value)}
            style={{ marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <strong>Issued By:</strong>
          <Select
            placeholder="Select issuer"
            value={issuedBy}
            style={{ width: "100%" }}
            onChange={(value) => setIssuedBy(value)}
          >
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </div>
        <p>
          <strong>Issue Date:</strong> {new Date().toISOString().split("T")[0]}
        </p>
      </Modal>
    </div>
  );
};

export default ItemsTable;