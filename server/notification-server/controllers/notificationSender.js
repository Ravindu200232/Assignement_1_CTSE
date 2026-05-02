import axios from "axios";
import { getSenderAddress, getTransporter } from "../mailTransporter.js";

export async function EmailSender(req, res) {
  try {
    const transporter = getTransporter();
    const senderAddress = getSenderAddress();
    const {
      orderId,
      driverId,
      driverName,
      driverPhone,
      driverEmail,
      customerEmail,
      address,
      phone,
      status,
      estimatedTime,
      lat,
      lng,
      itemName,
      qty,
      totalPrice,
      restaurantId,
    } = req.body;

    const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";
    const restaurantRes = await axios.get(`${restaurantServiceUrl}/api/v1/restaurant/getOne/${restaurantId}`);
    const restaurant = restaurantRes.data?.data;

    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;

    const driverMailOptions = {
      from: senderAddress,
      to: driverEmail,
      subject: `New Delivery Assigned - Order ${orderId}`,
      html: `
        <h2>New Order Delivery</h2>
        <p>Hello <strong>${driverName}</strong>,</p>
        <p>You have been assigned to deliver the following order:</p>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Item:</strong> ${itemName}</li>
          <li><strong>Quantity:</strong> ${qty}</li>
          <li><strong>Total Price:</strong> Rs. ${totalPrice}</li>
          <li><strong>Customer Address:</strong> ${address}</li>
          <li><strong>Customer Phone:</strong> ${phone}</li>
          <li><strong>Estimated Delivery Time:</strong> ${new Date(estimatedTime).toLocaleString()}</li>
          <li><strong>Location Link:</strong> <a href="${locationLink}" target="_blank">View on Map</a></li>
        </ul>
        <h3>Restaurant Info</h3>
        <p><strong>${restaurant?.name}</strong></p>
        <p>Owned by: <strong>${restaurant?.ownerName}</strong></p>
        <p>Location: ${restaurant?.address}</p>
        <p>Phone: ${restaurant?.phone}</p>
        <p>Please deliver the item on time. Thank you!</p>
      `,
    };

    const customerMailOptions = {
      from: senderAddress,
      to: customerEmail,
      subject: `Your Order ${orderId} is on the way!`,
      html: `
        <h2>Order Update</h2>
        <p>Hi there,</p>
        <p>Your order has been picked up and is on the way! Here are your delivery details:</p>
        <ul>
          <li><strong>Order ID:</strong> ${orderId}</li>
          <li><strong>Item:</strong> ${itemName}</li>
          <li><strong>Quantity:</strong> ${qty}</li>
          <li><strong>Total Price:</strong> Rs. ${totalPrice}</li>
          <li><strong>Driver Name:</strong> ${driverName}</li>
          <li><strong>Driver Phone:</strong> ${driverPhone}</li>
          <li><strong>Estimated Delivery Time:</strong> ${new Date(estimatedTime).toLocaleString()}</li>
          <li><strong>Track Location:</strong> <a href="${locationLink}" target="_blank">Live Location</a></li>
        </ul>
        <h3>Restaurant Info</h3>
        <p><strong>${restaurant?.name}</strong></p>
        <p>Owned by: <strong>${restaurant?.ownerName}</strong></p>
        <p>Location: ${restaurant?.address}</p>
        <p>Phone: ${restaurant?.phone}</p>
        <p>Thank you for ordering with us!</p>
      `,
    };

    await transporter.sendMail(driverMailOptions);
    await transporter.sendMail(customerMailOptions);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Email sending failed:", error.message);
    res.status(500).json({ message: "Failed to send email", error });
  }
}
