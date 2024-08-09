import { Form, message, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TransferFunds, VerifyAccount } from "../../apicalls/transactions";
import { ReloadUser } from "../../redux/usersSlice";

const TransferFundsModal = ({
  showTransferFundModal,
  setShowTransferFundModal,
  reloadData,
}) => {
  const [isVerified, setIsVerified] = useState("");
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const verifyAccount = async () => {
    try {
      const response = await VerifyAccount({
        receiver: form.getFieldValue("receiver"),
      });

      if (response.success) {
        setIsVerified("true");
      } else {
        setIsVerified("false");
      }
    } catch (error) {
      setIsVerified("false");
    }
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        sender: user._id,
        reference: values.reference || "no reference",
        status: "success",
      };

      const response = await TransferFunds(payload);

      if (response.success) {
        reloadData();
        setShowTransferFundModal(false);
        message.success(response.message);
        dispatch(ReloadUser(true));
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div>
      <Modal
        title="Transfer Funds"
        open={showTransferFundModal}
        onCancel={() => setShowTransferFundModal(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <div className="flex gap-2 items-center">
            <Form.Item label="Account Number" name="receiver" className="w-100">
              <input type="text" />
            </Form.Item>
            <button
              className="primary-contained-btn mt-1"
              type="button"
              onClick={verifyAccount}
            >
              VERIFY
            </button>
          </div>
          {isVerified === "true" && (
            <div className="success-bg">
              <h1 className="text-sm">Account Verified</h1>
            </div>
          )}
          {isVerified === "false" && (
            <div className="error-bg">
              <h1 className="text-sm">Invalid Account </h1>
            </div>
          )}

          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please input your amount!",
              },
              {
                max: user.balance,
                message: "Insufficient Balance",
              },
            ]}
          >
            <input type="number" max={user.balance} />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <textarea type="text" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            {isVerified === "true" && (
              <button className="primary-contained-btn">Transfer</button>
            )}
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TransferFundsModal;
