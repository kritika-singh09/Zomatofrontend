// src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoTimeOutline } from "react-icons/io5";
import { GiCookingPot } from "react-icons/gi";
import { FaMotorcycle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { BsBuildingCheck } from "react-icons/bs";
import { MdOutlineDeliveryDining } from "react-icons/md";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState("pending"); // pending, preparing, delivering, delivered

  // Dummy order data (to be replaced with API call)
  const orderDetails = {
    id: orderId || "OD123456789",
    status: orderStatus,
    date: "May 15, 2023",
    time: "7:30 PM",
    items: [
      { name: "Butter Chicken", quantity: 1, price: 350 },
      { name: "Garlic Naan", quantity: 2, price: 60 },
    ],
    subtotal: 470,
    deliveryFee: 40,
    taxes: 25,
    total: 535,
    deliveryAddress: "123 Main Street, Apartment 4B, City, State, 110001",
    paymentMethod: "Cash on Delivery",
    statusTimeline: {
      pending: "7:30 PM",
      preparing: "7:45 PM",
      delivering: "8:15 PM",
      delivered: "8:45 PM",
    },
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes cooking {
        0% { transform: scale(1); }
        50% { transform: rotate(8deg); }
        100% { transform: rotate(-8deg); }
      }
      @keyframes ticking {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(10deg); }
        50% { transform: rotate(0deg); }
        75% { transform: rotate(-10deg); }
        100% { transform: rotate(0deg); }
      }
      @keyframes checkmark {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
      .cooking-animation {
        animation: cooking 0.5s infinite;
      }
      .ticking-animation {
        animation: ticking 1s infinite;
      }
      .checkmark-animation {
        animation: checkmark 1.5s 3;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // For demo purposes, advance the status every few seconds
  useEffect(() => {
    const statusSequence = ["pending", "preparing", "delivering", "delivered"];
    const currentIndex = statusSequence.indexOf(orderStatus);

    if (currentIndex < statusSequence.length - 1) {
      const timer = setTimeout(() => {
        setOrderStatus(statusSequence[currentIndex + 1]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [orderStatus]);

  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (orderStatus) {
      case "pending":
        return 0;
      case "preparing":
        return 33;
      case "delivering":
        return 66;
      case "delivered":
        return 100;
      default:
        return 0;
    }
  };

  const generatePDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add restaurant info
    doc.setFontSize(18);
    doc.text("Buddha Avenue", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text(`Invoice #INV-${orderDetails.id}`, pageWidth / 2, 30, {
      align: "center",
    });
    doc.text(`Date: ${orderDetails.date}`, pageWidth / 2, 40, {
      align: "center",
    });

    // Add order details
    doc.setFontSize(14);
    doc.text("Order Details", 20, 60);

    doc.setFontSize(10);
    doc.text(`Order ID: ${orderDetails.id}`, 20, 70);
    doc.text(`Order Date: ${orderDetails.date}, ${orderDetails.time}`, 20, 80);
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, 90);

    // Add delivery address
    doc.setFontSize(14);
    doc.text("Delivery Address", 20, 110);

    doc.setFontSize(10);
    doc.text(orderDetails.deliveryAddress, 20, 120);

    // Add order items
    doc.setFontSize(14);
    doc.text("Order Items", 20, 140);

    let yPos = 150;
    doc.setFontSize(10);

    // Table header
    doc.text("Item", 20, yPos);
    doc.text("Quantity", 100, yPos);
    doc.text("Price", 150, yPos);
    yPos += 10;

    // Table content
    orderDetails.items.forEach((item) => {
      doc.text(item.name, 20, yPos);
      doc.text(item.quantity.toString(), 100, yPos);
      doc.text(`Rs.${item.price * item.quantity}`, 150, yPos);
      yPos += 10;
    });

    // Add payment details
    yPos += 10;
    doc.setFontSize(14);
    doc.text("Payment Details", 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.text("Item Total:", 100, yPos);
    doc.text(`Rs.${orderDetails.subtotal}`, 150, yPos);
    yPos += 10;

    doc.text("Delivery Fee:", 100, yPos);
    doc.text(`Rs.${orderDetails.deliveryFee}`, 150, yPos);
    yPos += 10;

    doc.text("Taxes:", 100, yPos);
    doc.text(`Rs.${orderDetails.taxes}`, 150, yPos);
    yPos += 10;

    // Total
    doc.setFontSize(12);
    doc.text("Total:", 100, yPos);
    doc.text(`Rs.${orderDetails.total}`, 150, yPos);
    yPos += 20;

    // Payment status
    doc.text("Payment Status: Paid", 100, yPos);

    // Save the PDF
    doc.save(`Order_${orderDetails.id}_Invoice.pdf`);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm">
        <button onClick={() => navigate("/orders")} className="mr-4">
          <IoArrowBack size={24} />
        </button>
        <h1 className="text-xl font-semibold">Order #{orderDetails.id}</h1>
      </div>

      {/* Order Status Progress Bar */}
      <div className="bg-white p-6 mb-4">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>

        {/* Progress bar container */}
        <div className="relative mb-10">
          {/* Background bar */}
          <div className="h-1 bg-gray-200 absolute w-[95%] top-13"></div>

          {/* Progress fill */}
          <div
            className="h-1 bg-green-500 absolute max-w-[94%] top-13 transition-all duration-1000 ease-out"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>

          {/* Status points */}
          <div className="flex justify-between relative">
            {/* Pending - Text above, Icon below */}
            <div className="flex flex-col items-center w-16">
              <div className=" h-10 flex flex-col items-center">
                <p className="text-xs font-medium">Pending</p>
                <p className="text-xs text-gray-500">
                  {orderDetails.statusTimeline.pending}
                </p>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 
      ${
        ["pending", "preparing", "delivering", "delivered"].includes(
          orderStatus
        )
          ? "bg-green-500 text-white"
          : "bg-gray-200"
      }`}
              >
                <FaCheck size={12} />
              </div>
              <div className="h-10 flex items-center">
                <IoTimeOutline
                  size={24}
                  className={`${
                    [
                      "pending",
                      "preparing",
                      "delivering",
                      "delivered",
                    ].includes(orderStatus)
                      ? "text-green-500" +
                        (orderStatus === "pending" ? " ticking-animation" : "")
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Preparing - Icon above, Text below */}
            <div className="flex flex-col items-center w-16">
              <div className="h-10 flex items-center">
                <GiCookingPot
                  size={24}
                  className={`${
                    ["preparing", "delivering", "delivered"].includes(
                      orderStatus
                    )
                      ? "text-green-500" +
                        (orderStatus === "preparing"
                          ? " cooking-animation"
                          : "")
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 
      ${
        ["preparing", "delivering", "delivered"].includes(orderStatus)
          ? "bg-green-500 text-white"
          : "bg-gray-200"
      }`}
              >
                {["preparing", "delivering", "delivered"].includes(
                  orderStatus
                ) ? (
                  <FaCheck size={12} />
                ) : (
                  <span className="text-xs">2</span>
                )}
              </div>
              <div className="h-10 flex flex-col items-center">
                <p className="text-xs font-medium">Preparing</p>
                <p className="text-xs text-gray-500">
                  {orderDetails.statusTimeline.preparing || "--:--"}
                </p>
              </div>
            </div>

            {/* Delivering - Text above, Icon below */}
            <div className="flex flex-col items-center w-16">
              <div className="h-10 flex flex-col items-center">
                <p className="text-xs font-medium">Delivering</p>
                <p className="text-xs text-gray-500">
                  {orderDetails.statusTimeline.delivering || "--:--"}
                </p>
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 
      ${
        ["delivering", "delivered"].includes(orderStatus)
          ? "bg-green-500 text-white"
          : "bg-gray-200"
      }`}
              >
                {["delivering", "delivered"].includes(orderStatus) ? (
                  <FaCheck size={12} />
                ) : (
                  <span className="text-xs">3</span>
                )}
              </div>
              <div className="h-10 flex items-center">
                <MdOutlineDeliveryDining
                  size={24}
                  className={`${
                    ["delivering", "delivered"].includes(orderStatus)
                      ? "text-green-500" +
                        (orderStatus === "delivering" ? " animate-bounce" : "")
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>

            {/* Delivered - Icon above, Text below */}
            <div className="flex flex-col items-center w-16">
              <div className="h-10 flex items-center">
                <BsBuildingCheck
                  size={24}
                  className={`${
                    orderStatus === "delivered"
                      ? "text-green-500 checkmark-animation"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center z-10 
      ${
        orderStatus === "delivered" ? "bg-green-500 text-white" : "bg-gray-200"
      }`}
              >
                {orderStatus === "delivered" ? (
                  <FaCheck size={12} />
                ) : (
                  <span className="text-xs">4</span>
                )}
              </div>
              <div className="h-10 flex flex-col items-center">
                <p className="text-xs font-medium">Delivered</p>
                <p className="text-xs text-gray-500">
                  {orderDetails.statusTimeline.delivered || "--:--"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Order Details</h2>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Order Date</span>
          <span>
            {orderDetails.date}, {orderDetails.time}
          </span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Payment Method</span>
          <span>{orderDetails.paymentMethod}</span>
        </div>
      </div>
      {/* Delivery Address */}
      <div className="bg-white p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
        <p className="text-sm">{orderDetails.deliveryAddress}</p>
      </div>
      {/* Order Items */}
      <div className="bg-white p-6 mb-4">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>

        {orderDetails.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex">
              <div className="w-6 h-6 bg-gray-200 rounded-md mr-3"></div>
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <p className="font-medium">₹{item.price * item.quantity}</p>
          </div>
        ))}
      </div>
      {/* Payment Details */}
      <div className="bg-white p-6" id="bill-details">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Payment Details</h2>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 text-sm bg-green-50 text-green-600 px-3 py-1 rounded-md hover:bg-green-100"
          >
            <FaDownload size={14} />
            Download Invoice
          </button>
        </div>

        {/* Restaurant Info - for the invoice */}
        <div className="mb-4 pb-3 border-b border-gray-100">
          <h3 className="font-medium mb-1">Buddha Avenue</h3>
          <p className="text-xs text-gray-500">
            Invoice #INV-{orderDetails.id}
          </p>
          <p className="text-xs text-gray-500">Date: {orderDetails.date}</p>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Item Total</span>
          <span>₹{orderDetails.subtotal}</span>
        </div>

        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span>₹{orderDetails.deliveryFee}</span>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-600">Taxes</span>
          <span>₹{orderDetails.taxes}</span>
        </div>

        <div className="flex justify-between font-semibold pt-3 border-t border-gray-100">
          <span>Total</span>
          <span>₹{orderDetails.total}</span>
        </div>

        {/* Payment Status */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Payment Status</span>
            <span className="text-green-600 font-medium">Paid</span>
          </div>
        </div>
      </div>

      {/* Help button */}
      <div className="mt-6 px-6">
        <button className="w-full py-3 border border-gray-300 rounded-lg font-medium bg-white">
          Need Help?
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
