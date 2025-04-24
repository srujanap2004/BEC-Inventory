import React, { useState } from "react";
import { Menu, Spin, Modal, Input } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import axios from "axios";
import moment from "moment";
import ItemsTable from "./ItemsTable"; // Import ItemsTable
import AddUser from "./AddUser"; // Import AddUser

const items = [
  {
    key: "domains",
    label: "Domains",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "hostelCanteen",
        label: "Hostel Canteen",
        children: [
          { key: "dairy", label: "Dairy" },
          { key: "grocery", label: "Grocery" },
        ],
      },
      {
        key: "itStationary",
        label: "IT Stationary",
        children: [{ key: "a4sheets", label: "A4 Sheets" }],
      },
    ],
  },
];

const Dash = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    item: null,
    quantity: "",
    issuedBy: localStorage.getItem("username") || "Unknown User",
    issueDate: moment().format("YYYY-MM-DD"),
    issuedTo: "",
  });
  const [issuedItemsData, setIssuedItemsData] = useState([]);
  const [showIssuedItems, setShowIssuedItems] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false); // State to toggle Add User view

  // Fetch items based on the selected category
  const fetchItems = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/items/${category}`);
      setItemsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch items. Please try again later.");
    }
    setLoading(false);
  };

  // Handle category selection
  const handleClick = (e) => {
    setSelectedCategory(e.key);
    fetchItems(e.key);
    setShowIssuedItems(false); // Hide issued items view when a category is selected
    setShowAddUser(false); // Hide Add User view when a category is selected
  };

  // Show issued items table
  const handleShowIssuedItems = () => {
    setShowIssuedItems(true);
    setShowAddUser(false); // Hide Add User view when issued items are shown
  };

  // Show Add User page
  const handleShowAddUser = () => {
    setShowAddUser(true);
    setShowIssuedItems(false); // Hide issued items view when Add User is shown
  };

  // Fetch issued items data
  const fetchIssuedItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/issued-items");
      setIssuedItemsData(response.data.data);
    } catch (error) {
      console.error("Error fetching issued items:", error);
      alert("Failed to fetch issued items. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 256, background: "#f0f2f5", padding: 10 }}>
        <h3 style={{ textAlign: "center" }}>Inventory</h3>
        <Menu onClick={handleClick} mode="inline" items={items} />
        <button
          style={{
            marginTop: "10px",
            width: "100%",
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={handleShowAddUser} // Show Add User page
        >
          + Add User
        </button>
        <button
          style={{
            marginTop: "10px",
            width: "100%",
            backgroundColor: "#52c41a",
            color: "white",
            border: "none",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
          onClick={() => {
            handleShowIssuedItems();
            fetchIssuedItems(); // Fetch issued items when the button is clicked
          }}
        >
          Issued Items
        </button>
      </div>

      {/* Content Section */}
      <div style={{ padding: 20, flex: 1 }}>
        {loading ? (
          <Spin size="large" />
        ) : showAddUser ? (
          <AddUser /> // Render Add User page
        ) : showIssuedItems ? (
          <ItemsTable itemsData={issuedItemsData} setItemsData={setIssuedItemsData} />
        ) : selectedCategory && itemsData.length > 0 ? (
          <ItemsTable itemsData={itemsData} setItemsData={setItemsData} />
        ) : (
          <h2>{itemsData.length === 0 ? "No items found for this category" : "Select a category to view items"}</h2>
        )}
      </div>

      {/* Modal for Issuing Items */}
      <Modal
        title="Issue Item"
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        okText="Issue"
        cancelText="Cancel"
      >
        <div>
          <p>
            <strong>Item:</strong> {modalData.item}
          </p>
          <Input
            placeholder="Quantity"
            value={modalData.quantity}
            onChange={(e) => setModalData({ ...modalData, quantity: e.target.value })}
            type="number"
          />
          <Input
            placeholder="Issued To"
            value={modalData.issuedTo}
            onChange={(e) => setModalData({ ...modalData, issuedTo: e.target.value })}
            style={{ marginTop: "10px" }}
          />
          <p style={{ marginTop: "10px" }}>
            <strong>Issued By:</strong> {modalData.issuedBy}
          </p>
          <p>
            <strong>Issue Date:</strong> {modalData.issueDate}
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Dash;