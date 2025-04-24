import React, { useState } from "react";
import { Menu, Spin, message } from "antd";
import {
  AppstoreOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  DeliveredProcedureOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import axios from "axios";
import StaffItemsTable from "./staffitemstable"; // Updated import
import AddUser from "../AddUser";
import IssuedItemsTable from "../IssuedItems";
import AddItems from "../AddItems";
import Purchases from "../Purchases";
import AddSupplier from "../AddSupplier";
import PurchasesList from "../PurchasesList";
import Users from "../Users";
import Home from "../Home";
import Profile from "../Profile";

const items = [
  {
    key: "domains",
    label: "Domains",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "hostelCanteen",
        label: "Hostel Canteen",
        icon: "🏢",
        children: [
          { key: "Dairy", icon: <span style={{ fontSize: "24px" }}>🐄</span>, label: "Dairy" },
          { key: "Grocery", icon: <span style={{ fontSize: "24px" }}>🛒</span>, label: "Grocery" },
          { key: "Flours", icon: <span style={{ fontSize: "24px" }}>🌼</span>, label: "Flours" },
          { key: "Grains", icon: <span style={{ fontSize: "24px" }}>🌾</span>, label: "Grains" },
          { key: "Masalas", icon: <span style={{ fontSize: "24px" }}>🍛</span>, label: "Masalas" },
          { key: "nuts", icon: <span style={{ fontSize: "24px" }}>🥜</span>, label: "nuts" },
          { key: "Oils", icon: <span style={{ fontSize: "24px" }}>🍶</span>, label: "Oils" },
          { key: "peas", icon: <span style={{ fontSize: "24px" }}>🫛</span>, label: "peas" },
          { key: "Provisions", icon: <span style={{ fontSize: "24px" }}>🛍️</span>, label: "Provisions" },
          { key: "Pulses", icon: <span style={{ fontSize: "24px" }}>🫘</span>, label: "Pulses" },
          { key: "ravas", icon: <span style={{ fontSize: "24px" }}>🥘</span>, label: "ravas" },
          { key: "sauses", icon: <span style={{ fontSize: "24px" }}>🌯</span>, label: "sauses" },
          { key: "seeds", icon: <span style={{ fontSize: "24px" }}>𓇢</span>, label: "seeds" },
          { key: "Soap", icon: <span style={{ fontSize: "24px" }}>🧼</span>, label: "Soap" },
          { key: "Vegetable", icon: <span style={{ fontSize: "24px" }}>🥬</span>, label: "Vegetable" },
          { key: "Other", icon: <span style={{ fontSize: "24px" }}></span>, label: "Other" },
        ],
      },
      {
        key: "itStationary",
        label: "IT Stationary",
        icon: "✏️",
        children: [{ key: "A4Sheets", label: "A4 Sheets" }],
      },
    ],
  },
];

const StaffDash = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [itemsData, setItemsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("home");

  // Fetch items based on the selected category
  const fetchItems = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/items/${category}`);
      setItemsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch items. Please try again later.");
    }
    setLoading(false);
  };

  // Handle category selection
  const handleClick = (e) => {
    setSelectedCategory(e.key);
    fetchItems(e.key);
    setActivePage(null); // Reset active page
  };

  // Navigation handlers
  const handleShowHome = () => setActivePage("home");
  const handleShowIssuedItems = () => setActivePage("issuedItems");
  const handleShowAddUser = () => setActivePage("addUser");
  const handleShowAddItems = () => setActivePage("addItems");
  const handleShowPurchases = () => setActivePage("purchases");
  const handleShowAddSupplier = () => setActivePage("addSupplier");
  const handleShowPurchasesList = () => setActivePage("purchasesList");
  const handleShowUsers = () => setActivePage("users");
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const handleShowProfile = () => setActivePage("profile");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 256, background: "#f0f2f5", padding: 10, overflowY: "auto" }}>
        <h3 style={{ textAlign: "center" }}>Staff Dashboard</h3>

        <Menu mode="inline">
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={handleShowHome}>
            Home
          </Menu.Item>
        </Menu>
        <Menu onClick={handleClick} mode="inline" items={items} />

        {/* Other menu items */}
        <Menu mode="inline">
          <Menu.Item key="profile" icon={<UserOutlined />} onClick={handleShowProfile}>
            Profile
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Menu.Item>
        </Menu>
      </div>

      {/* Content Section */}
      <div style={{ padding: 20, flex: 1 }}>
        {loading ? (
          <Spin size="large" />
        ) : activePage === "home" ? (
          <Home />
        ) : activePage === "addUser" ? (
          <AddUser />
        ) : activePage === "issuedItems" ? (
          <IssuedItemsTable />
        ) : activePage === "addItems" ? (
          <AddItems />
        ) : activePage === "purchases" ? (
          <Purchases />
        ) : activePage === "purchasesList" ? (
          <PurchasesList />
        ) : activePage === "addSupplier" ? (
          <AddSupplier />
        ) : activePage === "users" ? (
          <Users />
        ) : activePage === "profile" ? (
          <Profile />
        ) : selectedCategory && itemsData.length > 0 ? (
          <StaffItemsTable itemsData={itemsData} /> 
        ) : (
          <h2>No items found for this category</h2>
        )}
      </div>
    </div>
  );
};

export default StaffDash;