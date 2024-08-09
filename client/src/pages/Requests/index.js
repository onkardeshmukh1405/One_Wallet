import React, { useEffect, useState } from "react";
import { message, Table, Tabs } from "antd";
import PageTitle from "../../components/PageTitle";
import NewRequestModal from "./NewRequestModal";
import {
  GetAllRequestsByUser,
  UpdateRequestStatus,
} from "../../apicalls/request";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { ReloadUser } from "../../redux/usersSlice";

const { TabPane } = Tabs;

const Requests = () => {
  const [data, setData] = useState([]);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getAllRequests = async () => {
    try {
      const response = await GetAllRequestsByUser();

      if (response.success) {
        const sentData = response.data.filter(
          (item) => item.sender._id === user._id
        );
        const receivedData = response.data.filter(
          (item) => item.receiver._id === user._id
        );
        setData({
          sent: sentData,
          received: receivedData,
        });
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const updateStatus = async (record, status) => {
    try {
      if (status === "accepted" && record.amount > user.balance) {
        message.error("Insufficient Balance");
        return;
      } else {
        const response = await UpdateRequestStatus({
          ...record,
          status,
        });

        if (response.success) {
          message.success(response.message);
          getAllRequests();
          dispatch(ReloadUser(true));
        } else {
          message.error(response.message);
        }
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
    },
    {
      title: "Sender",
      dataIndex: "sender",
      render(sender) {
        return sender.firstName + " " + sender.lastName;
      },
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render(receiver) {
        return receiver.firstName + " " + receiver.lastName;
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (record.status === "pending" && record.receiver._id === user._id) {
          return (
            <div className="flex gap-1">
              <h1
                className="text-sm underline"
                onClick={() => updateStatus(record, "rejected")}
              >
                Reject
              </h1>
              <h1
                className="text-sm underline"
                onClick={() => updateStatus(record, "accepted")}
              >
                Accept
              </h1>
            </div>
          );
        }
      },
    },
  ];

  useEffect(() => {
    getAllRequests();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <PageTitle title="Requests" />
        <button
          className="primary-outlined-btn"
          onClick={() => setShowNewRequestModal(true)}
        >
          Request Funds
        </button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Sent" key="1">
          <Table columns={columns} dataSource={data.sent} />
        </TabPane>
        <TabPane tab="Received" key="2">
          <Table columns={columns} dataSource={data.received} />
        </TabPane>
      </Tabs>

      {showNewRequestModal && (
        <NewRequestModal
          showNewRequestModal={showNewRequestModal}
          setShowNewRequestModal={setShowNewRequestModal}
          reloadData={getAllRequests}
        />
      )}
    </div>
  );
};

export default Requests;
