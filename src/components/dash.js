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
  FontSizeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import ItemsTable from "./ItemsTable";
import AddUser from "./AddUser";
import IssuedItemsTable from "./IssuedItems";
import AddItems from "./AddItems";
import Purchases from "./Purchases";
import AddSupplier from "./AddSupplier";
import PurchasesList from "./PurchasesList";
import Users from "./Users";
import Home from "./Home";
import Profile from "./Profile";

const items = [
  {
    key: "domains",
    label: "Domains",
    icon: <AppstoreOutlined />,
    children: [
      {
        key: "hostelCanteen",
        label: "Hostel Canteen",
        icon:"🏢",
        children: [
          { key: "Dairy", icon: <span style={{ fontSize: "24px" }}>🐄</span>, label: "Dairy" },
          { key: "Vegetables",icon: <span style={{ fontSize: "24px" }}>🥬</span>, label: "Vegetables" },
          //{ key: "Dairy", icon:<span style={{fontsize:24px}}>🐄 </span>,label: "Dairy" },
          { key: "Grocery",icon: <span style={{ fontSize: "24px" }}>🛒</span>, label: "Grocery" },
          { key: "Flours", icon: <span style={{ fontSize: "24px" }}>🌼</span>,label: "Flours" },
          { key: "Grains",icon: <span style={{ fontSize: "24px" }}>🌾</span>, label: "Grains" },
          { key: "Masalas",icon: <span style={{ fontSize: "24px" }}>🍛</span>,label: "Masalas" },
          { key: "nuts", icon: <span style={{ fontSize: "24px" }}>🥜</span>,label: "nuts" },
          { key: "Oils",icon: <span style={{ fontSize: "24px" }}>🍶</span>, label: "Oils" },
          
          { key: "peas", icon: <span style={{ fontSize: "24px" }}>🫛</span>,label: "peas" },
          { key: "Provisions",icon: <span style={{ fontSize: "24px" }}>🛍️</span>, label: "Provisions" },
          { key: "Pulses",icon: <span style={{ fontSize: "24px" }}>🫘</span>, label: "Pulses" },
          { key: "ravas",icon: <span style={{ fontSize: "24px" }}>🥘</span>, label: "ravas" },
          { key: "sauses",icon: <span style={{ fontSize: "24px" }}>🌯</span>, label: "sauses" },
          { key: "seeds", icon: <span style={{ fontSize: "24px" }}>𓇢</span>,label: "seeds" },
          { key: "Soap", icon: <span style={{ fontSize: "24px" }}>🧼</span>,label: "Soap" },
    
          { key: "Other",icon: <span style={{ fontSize: "24px" }}></span>, label: "Other" },
        ],
      },
      {
        key: "itStationary",
        label: " IT Stationary",
        icon:"✏️",
        children: [{ key: "A4Sheets", label: "A4 Sheets" }],
      },
    ],
  },
];

const Dash = () => {
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

  // Show Home page
  const handleShowHome = () => {
    setActivePage("home");
  };

  // Show Issued Items page
  const handleShowIssuedItems = () => {
    setActivePage("issuedItems");
  };

  // Show Add User page
  const handleShowAddUser = () => {
    setActivePage("addUser");
  };

  // Show Add Items page
  const handleShowAddItems = () => {
    setActivePage("addItems");
  };

  // Show Purchases page
  const handleShowPurchases = () => {
    setActivePage("purchases");
  };

  // Show Add Supplier page
  const handleShowAddSupplier = () => {
    setActivePage("addSupplier");
  };

  // Show Purchases List page
  const handleShowPurchasesList = () => {
    setActivePage("purchasesList");
  };

  // Show Users page
  const handleShowUsers = () => {
    setActivePage("users");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.clear(); // Clear user session data
    window.location.href = "/"; // Redirect to the login page
  };

  // Show Profile page
  const handleShowProfile = () => {
    setActivePage("profile");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: 256, background: "#f0f2f5", padding: 10 }}>
        <h3 style={{ textAlign: "center" }}>Inventory</h3>

        <Menu mode="inline">
          <Menu.Item
            key="home"
            icon={<HomeOutlined />}
            onClick={handleShowHome}
          >
            Home
          </Menu.Item>
        </Menu>
        <Menu onClick={handleClick} mode="inline" items={items} />

        {/* Other menu items */}
        <Menu mode="inline">
          <Menu.Item
            key="profile"
            icon={<UserOutlined />}
            onClick={handleShowProfile}
          >
            Profile
          </Menu.Item>
          <Menu.Item
            key="users"
            icon={<UsergroupAddOutlined />}
            onClick={handleShowUsers}
          >
            Users
          </Menu.Item>
          <Menu.Item
            key="issuedItems"
            icon={<DeliveredProcedureOutlined />}
            onClick={handleShowIssuedItems}
          >
            Issued Items
          </Menu.Item>
          <Menu.Item
            key="supplier"
            icon={<ContainerOutlined />}
            onClick={handleShowAddSupplier}
          >
            Suppliers
          </Menu.Item>
          <Menu.Item
            key="purchases"
            icon={<ContainerOutlined />}
            onClick={handleShowPurchases}
          >
            Purchase
          </Menu.Item>
          <Menu.Item
            key="purchasesList"
            icon={<ContainerOutlined />}
            onClick={handleShowPurchasesList}
          >
            Purchases List
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
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
          <Users />        ) : activePage === "profile" ? ( // Ensure this condition is checked before rendering items
          <Profile />
        ) : selectedCategory && itemsData.length > 0 ? (
          <ItemsTable itemsData={itemsData} setItemsData={setItemsData} />
        ) : (
          <h2>No items found for this category</h2>
        )}
      </div>
    </div>
  );
};

export default Dash;