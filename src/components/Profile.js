import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Input, message, Typography, Row, Col, Divider, Spin } from "antd";
import axios from "axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const userId = localStorage.getItem("user_id"); // Get the logged-in user's ID from localStorage
  const loginTime = localStorage.getItem("login_time"); // Get the login time from localStorage

  // Redirect to login if user_id is missing
  useEffect(() => {
    if (!userId) {
      message.error("You must be logged in to view this page.");
      navigate("/"); // Redirect to the login page
    }
  }, [userId, navigate]);

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/user/${userId}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        message.error("Failed to fetch user details.");
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  // Show the Change Password modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle password change
  const handleChangePassword = async (values) => {
    try {
      const response = await axios.put(`http://localhost:5000/user/${userId}`, values);

      if (response.data.success) {
        message.success("Password updated successfully!");
        console.log("Password updated successfully:", response.data);
        setIsModalVisible(false);
        form.resetFields();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating password:", error);
      message.error("Failed to update password. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20%" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        title={<Title level={3} style={{ margin: 0 }}>User Profile</Title>}
        bordered={false}
        style={{ boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", borderRadius: "10px" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>User ID:</Text>
            <p>{user.user_id}</p>
          </Col>
          <Col span={12}>
            <Text strong>Username:</Text>
            <p>{user.username}</p>
          </Col>
          <Col span={12}>
            <Text strong>Email:</Text>
            <p>{user.email}</p>
          </Col>
          <Col span={12}>
            <Text strong>Phone:</Text>
            <p>{user.phone}</p>
          </Col>
          <Col span={12}>
            <Text strong>Role:</Text>
            <p>{user.role}</p>
          </Col>
          <Col span={12}>
            <Text strong>Created At:</Text>
            <p>{moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")}</p>
          </Col>
          <Col span={12}>
            <Text strong>Login Time:</Text>
            <p>{loginTime ? moment(loginTime).format("YYYY-MM-DD HH:mm:ss") : "N/A"}</p>
          </Col>
        </Row>
        <Divider />
        <Button type="primary" onClick={showModal} style={{ width: "100%" }}>
          Change Password
        </Button>
      </Card>

      {/* Change Password Modal */}
      <Modal
        title="Change Password"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        style={{ borderRadius: "10px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[{ required: true, message: "Please enter your current password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[{ required: true, message: "Please enter your new password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;