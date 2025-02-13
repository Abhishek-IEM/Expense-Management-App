import { useState, useEffect, useCallback } from "react";
import Layout from "../components/Layout/Layout";
import { Form, Modal, Input, Select, message, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "../index.css";
import axios from "axios";
import Spinner from "./../components/Spinner";
const { RangePicker } = DatePicker;
import moment from "moment";
import Analytics from "../components/Analytics";
import BarChartComponent from "../components/BarChartComponent";
import PieChartComponent from "../components/PieChartComponent";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  const [form] = Form.useForm();

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Amount",
      key: "amount",
      dataIndex: "amount",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Category",
      key: "category",
      dataIndex: "category",
    },
    {
      title: "Reference",
      key: "reference",
      dataIndex: "reference",
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              console.log("Editing Transaction:", record);
              setEditable(record);
              setShowModal(true);
            }}
          />

          <DeleteOutlined
            className="mx-2"
            onClick={() => deleteHandle(record)}
          />
        </div>
      ),
    },
  ];

  const fetchTransactions = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/api/v1/transaction/get-transaction", {
        userId: user._id,
        frequency,
        selectedDate,
        type,
      });
      setLoading(false);
      setAllTransaction(res.data);
    } catch (error) {
      console.log(error);
      message.error("Fetch issue with transaction");
    }
  }, [frequency, selectedDate, type]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (editable) {
      form.setFieldsValue({
        ...editable,
        date: moment(editable.date),
      });
    } else {
      form.resetFields();
    }
  }, [editable, form]);

  //useEffect hook
  useEffect(() => {
    //get all transactions
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        setLoading(true);
        const res = await axios.post("/api/v1/transaction/get-transaction", {
          userId: user._id,
          frequency,
          selectedDate,
          type,
        });
        setLoading(false);
        setAllTransaction(res.data);
      } catch (error) {
        console.log(error);
        message.error("Fetch issue with transaction");
      }
    };

    getAllTransactions();
    fetchTransactions();
  }, [frequency, selectedDate, type, fetchTransactions]);

  const deleteHandle = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/transaction/delete-transaction", {
        transactionId: record._id,
      });
      message.success("Transaction Deleted!");
      setLoading(false);
      fetchTransactions(); // Re-fetch transactions after deletion
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("Unable to delete");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/api/v1/transaction/edit-transaction", {
          payload: { ...values, userId: user._id },
          transacationId: editable._id,
        });
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/api/v1/transaction/add-transaction", {
          ...values,
          userId: user._id,
        });
        message.success("Transaction Added Successfully");
      }
      setLoading(false);
      setShowModal(false);
      setEditable(null);
      fetchTransactions(); // Re-fetch transactions to update UI
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };

  const totalIncomeTurnover = allTransaction
    .filter((txn) => txn.type === "income")
    .reduce((acc, txn) => acc + txn.amount, 0);

  const totalExpenseTurnover = allTransaction
    .filter((txn) => txn.type === "expense")
    .reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Filters</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income">Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedDate(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <AreaChartOutlined
            className={`mx-2 ${
              viewData === "analytics" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("analytics")}
          />
          <BarChartOutlined
            className={`mx-2 ${
              viewData === "bar" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("bar")}
          />
          <PieChartOutlined
            className={`mx-2 ${
              viewData === "pie" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("pie")}
          />
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content mt-4">
        {viewData === "table" && (
          <Table
            columns={columns}
            dataSource={allTransaction}
            pagination={{ pageSize: 8 }}
          />
        )}
        {viewData === "analytics" && (
          <Analytics allTransaction={allTransaction} />
        )}
        {viewData === "bar" && (
          <BarChartComponent
            totalIncomeTurnover={totalIncomeTurnover}
            totalExpenseTurnover={totalExpenseTurnover}
          />
        )}
        {viewData === "pie" && (
          <PieChartComponent
            totalIncomeTurnover={totalIncomeTurnover}
            totalExpenseTurnover={totalExpenseTurnover}
          />
        )}
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => {
          setShowModal(false);
          setEditable(null);
        }}
        footer={false}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount">
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="income">Income</Select.Option>
              <Select.Option value="expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="salary">Salary</Select.Option>
              <Select.Option value="subscription">Subscription</Select.Option>
              <Select.Option value="project">Project</Select.Option>
              <Select.Option value="food">Food</Select.Option>
              <Select.Option value="movie">Movie</Select.Option>
              <Select.Option value="bills">Bills</Select.Option>
              <Select.Option value="fee">Fee</Select.Option>
              <Select.Option value="medical">Medical</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
      ;
    </Layout>
  );
};

export default HomePage;
