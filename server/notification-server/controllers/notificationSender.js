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
      restaurantName,
      restaurantOwnerName,
      restaurantAddress,
      restaurantPhone,
    } = req.body;

    let restaurant = {
      name: restaurantName,
      ownerName: restaurantOwnerName,
      address: restaurantAddress,
      phone: restaurantPhone,
    };

    if (restaurantId) {
      const restaurantServiceUrl = process.env.RESTAURANT_SERVICE_URL || "http://localhost:3002";

      try {
        const restaurantRes = await axios.get(`${restaurantServiceUrl}/api/v1/restaurant/getOne/${restaurantId}`);
        restaurant = {
          name: restaurantRes.data?.data?.name || restaurant.name,
          ownerName: restaurantRes.data?.data?.ownerName || restaurant.ownerName,
          address: restaurantRes.data?.data?.address || restaurant.address,
          phone: restaurantRes.data?.data?.phone || restaurant.phone,
        };
      } catch (restaurantError) {
        console.warn("Restaurant info unavailable for notification email:", restaurantError.message);
      }
    }

    const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;
    const restaurantSection = `
        <h3>Restaurant Info</h3>
        <p><strong>${restaurant?.name || "Restaurant details unavailable"}</strong></p>
        ${restaurant?.ownerName ? `<p>Owned by: <strong>${restaurant.ownerName}</strong></p>` : ""}
        ${restaurant?.address ? `<p>Location: ${restaurant.address}</p>` : ""}
        ${restaurant?.phone ? `<p>Phone: ${restaurant.phone}</p>` : ""}
      `;

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
        ${restaurantSection}
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
        ${restaurantSection}
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
