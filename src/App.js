import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dash from "./components/dash";
import AddItems from "./components/AddItems";
import FacultyDashboard from "./components/FacultyDashboard";
import InventoryDashboard from "./components/InventoryDashboard";
import ManagerDashboard from "./components/ManagerDashboard";
import AddUser from "./components/AddUser";
import ContentSection from "./components/ContentSection";
import IssuedItems from "./components/IssuedItems"
import PurchasesList from "./components/PurchasesList";
import Users from "./components/Users";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Purchases from "./components/Purchases"; 
import Staffdash from "./components/staff/staffdash";


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/addItems" element={<AddItems />} />
                <Route path="/facultyDashboard" element={<FacultyDashboard  />} />
                <Route path="/inventoryDashboard" element={<InventoryDashboard />} />
                <Route path="/dash" element={<Dash/>}/>
                <Route path="/ManagerDashboard" element={<ManagerDashboard/>} />
                <Route path="/add-user" element={<AddUser />} />
                <Route path="/content" element={<ContentSection />} />
                <Route path="/issueditems" element={<IssuedItems />} />
                <Route path="/purchasesList" element={<PurchasesList />} />
                <Route path="/users" element={<Users />} /> 
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/staffdash" element={<Staffdash />} />
                
            </Routes>
        </Router>
    );
}

export default App;
