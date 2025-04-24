import React, { useState, useEffect } from "react";
import { Form, Input, Button, message, DatePicker, Table, Space, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const Purchases = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billNo, setBillNo] = useState(null);
  const [categories, setCategories] = useState([]);
  const unitOptions = ["kgs", "liters", "no"];
  const [suppliers, setSuppliers] = useState([]); // State to store suppliers

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        message.error("Failed to fetch categories. Please try again later.");
      }
    };

    fetchCategories();

    // Fetch suppliers from the backend
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/suppliers"); // Replace with your actual endpoint
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
        message.error("Failed to fetch suppliers. Please try again later.");
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddItem = (values) => {
    console.log("Adding item to cart:", values);

    const isDuplicate = cart.some((item) => item.item_name === values.item_name);
    if (isDuplicate) {
      message.error("This item is already in the cart.");
      return;
    }

    setCart((prev) => [...prev, values]);
    message.success("Item added to cart!");
  };

  const handleAddPurchase = async (values) => {
    console.log("Form values:", values);
    console.log("Cart items:", cart);

    if (cart.length === 0) {
      message.error("Please add at least one item to the cart.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        supplier_id: values.supplier_id,
        purchase_date: values.purchase_date.format("YYYY-MM-DD"),
        items: cart.map(item => ({
          ...item,
          expiry_date: item.expiry_date ? item.expiry_date.format("YYYY-MM-DD") : null,
        })),
      };
      console.log("Payload being sent to backend:", payload);

      const response = await axios.post("http://localhost:5000/purchases", payload);

      if (response.data.success) {
        message.success(`Purchase added successfully! Bill Number: ${response.data.bill_no}`);
        setBillNo(response.data.bill_no);
        setCart([]);
      } else {
        message.error("Failed to add purchase. Please try again.");
      }
    } catch (error) {
      console.error("Error adding purchase:", error);
      message.error("Failed to add purchase. Please try again later.");
    }
    setLoading(false);
  };

  const handleRemoveFromCart = (record) => {
    setCart((prev) => prev.filter((item) => item.item_name !== record.item_name));
    message.success("Item removed from cart!");
  };

  const cartColumns = [
    { title: "Item Name", dataIndex: "item_name", key: "item_name" },
    { title: "Quantity", dataIndex: "quantity", key: "quantity" },
    { title: "Unit Price", dataIndex: "unit_price", key: "unit_price" },
    { title: "Brand", dataIndex: "brand", key: "brand" },
    {
      title: "Expiry Date",
      dataIndex: "expiry_date",
      key: "expiry_date",
      render: (expiry_date) => (expiry_date ? expiry_date.format("YYYY-MM-DD") : "N/A"),
    },
    { title: "Category", dataIndex: "category_name", key: "category_name" },
    { title: "Domain", dataIndex: "domain", key: "domain" },
    {
      title: "Total Cost",
      key: "total_cost",
      render: (_, record) => <span>{(record.quantity * record.unit_price).toFixed(2)}</span>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveFromCart(record)}
            style={{ color: "red", borderColor: "red" }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Purchase</h2>

      <h3>Manage Cart</h3>
      <Form
        layout="vertical"
        onFinish={handleAddItem}
        style={{ maxWidth: 600, marginBottom: 20 }}
      >
        <Form.Item
          label="Item Name"
          name="item_name"
          rules={[{ required: true, message: "Please enter the item name" }]}
        >
          <Input placeholder="Enter item name" />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please enter the quantity" }]}
        >
          <Input type="number" placeholder="Enter quantity" />
        </Form.Item>
        <Form.Item
          label="Unit Price"
          name="unit_price"
          rules={[{ required: true, message: "Please enter the unit price" }]}
        >
          <Input type="number" placeholder="Enter unit price" />
        </Form.Item>
        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Please enter the brand" }]}
        >
          <Input placeholder="Enter brand" />
        </Form.Item>
        <Form.Item
          label="Expiry Date"
          name="expiry_date"
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          label="Category Name"
          name="category_name"
          rules={[{ required: true, message: "Please select the category" }]}
        >
          <Select placeholder="Select category">
            <Select.Option value="Dairy">Dairy</Select.Option>
            <Select.Option value="Colors">Colors</Select.Option>
            <Select.Option value="Flours">Flours</Select.Option>
            <Select.Option value="Grains">Grains</Select.Option>
            <Select.Option value="Masalas">Masalas</Select.Option>
            <Select.Option value="Meat">Meat</Select.Option>
            <Select.Option value="Nuts">Nuts</Select.Option>
            <Select.Option value="Oils">Oils</Select.Option>
            <Select.Option value="Peas">Peas</Select.Option>
            <Select.Option value="Provisions">Provisions</Select.Option>
            <Select.Option value="Pulses">Pulses</Select.Option>
            <Select.Option value="Ravas">Ravas</Select.Option>
            <Select.Option value="Sauses">Sauses</Select.Option>
            <Select.Option value="Seeds">Seeds</Select.Option>
            <Select.Option value="Soap">Soap</Select.Option>
            <Select.Option value="Vegetables">Vegetables</Select.Option>
            <Select.Option value="Other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Units"
          name="units"
          rules={[{ required: true, message: "Please select the units" }]}
        >
          <Select placeholder="Select units">
            <Select.Option value="kgs">Kgs</Select.Option>
            <Select.Option value="ltrs">Ltrs</Select.Option>
            <Select.Option value="no">No.</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Domain"
          name="domain"
          rules={[{ required: true, message: "Please select the domain" }]}
        >
          <Select placeholder="Select domain">
            <Select.Option value="Hostel Canteen">Hostel Canteen</Select.Option>
            <Select.Option value="IT Stationary">IT Stationary</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="dashed" icon={<PlusOutlined />} htmlType="submit">
            Add Item to Cart
          </Button>
        </Form.Item>
      </Form>

      <Table
        dataSource={cart}
        columns={cartColumns}
        rowKey={(record, index) => `${record.item_name}-${index}`}
        pagination={false}
        style={{ marginBottom: 20 }}
      />

      <h3 >Submit Purchase</h3>
      <Form
        layout="vertical"
        onFinish={handleAddPurchase}
        style={{ maxWidth: 600 }}
      >
        {billNo && (
          <Form.Item label="Bill Number">
            <Input value={billNo} readOnly />
          </Form.Item>
        )}

        <Form.Item
          label="Supplier"
          name="supplier_id"
          rules={[{ required: true, message: "Please select the supplier" }]}
        >
          <Select
            showSearch
            placeholder="Select a supplier"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option.children).toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {suppliers.map((supplier) => (
              <Option key={supplier.supplier_id} value={supplier.supplier_id}>
                {`${supplier.supplier_id} - ${supplier.supplier_name}`}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Purchase Date"
          name="purchase_date"
          rules={[{ required: true, message: "Please select the purchase date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit Purchase
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Purchases;