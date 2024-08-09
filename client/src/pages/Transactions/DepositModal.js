import { Form, message, Modal } from "antd";
import React from "react";
import StripeCheckout from "react-stripe-checkout";
import { DepositFunds } from "../../apicalls/transactions";

const DepositModal = ({
  showDepositModal,
  setShowDepositModal,
  reloadData,
}) => {
  const [form] = Form.useForm();

  const onToken = async (token) => {
    try {
      const response = await DepositFunds({
        token,
        amount: form.getFieldValue("amount"),
      });

      if (response.success) {
        reloadData();
        setShowDepositModal(false);
        message.success(response.message);
      } else {
        console.log("deposit funds api failed");
        message.error(response.message);
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  return (
    <Modal
      title="Deposit"
      open={showDepositModal}
      onCancel={() => setShowDepositModal(false)}
      footer={null}
    >
      <div className="flex-col gap-1">
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              {
                required: true,
                message: "Please enter amount",
              },
            ]}
          >
            <input type="number" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            <button className="primary-outlined-btn">Cancel</button>
            <StripeCheckout
              token={onToken}
              amount={form.getFieldValue("amount") * 100}
              currency="USD"
              shippingAddress
              stripeKey="pk_test_51PlQ49AjBVRy3NZkWh4X7Zmkz52tPCJb4K29zBSFjeYoUqqaulnAWnni81UDjggZlUyAbuv4ohkWyYTdRPxoYpb0000xqMAhHB"
            >
              <button className="primary-contained-btn">Deposit</button>
            </StripeCheckout>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default DepositModal;
