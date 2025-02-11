import React, { useState, useEffect } from "react";

const RestaurantReservation = () => {
  const totalSeats = 20;
  const [seatsLeft, setSeatsLeft] = useState(totalSeats);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({ name: "", phone: "", guests: "" });
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [toast, setToast] = useState("");

  const menuItems = [
    { name: "🍕 Margherita Pizza", price: "$10" },
    { name: "🍔 Cheeseburger", price: "$8" },
    { name: "🍣 Sushi Platter", price: "$15" },
    { name: "🥗 Greek Salad", price: "$7" },
    { name: "🍝 Spaghetti Carbonara", price: "$12" },
    { name: "🍹 Fresh Lemonade", price: "$4" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (toast) {
      const toastTimer = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(toastTimer);
    }
  }, [toast]);

  const showToast = (message) => {
    setToast(message);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, guests } = formData;
    const guestCount = parseInt(guests, 10);

    if (!name || !phone || !guests || guestCount <= 0) {
      showToast("⚠️ Please enter valid details.");
      return;
    }

    if (guestCount > seatsLeft) {
      showToast("❌ Not enough seats available!");
      return;
    }

    if (reservations.some((res) => res.name.toLowerCase() === name.toLowerCase())) {
      showToast("⚠️ Duplicate name found! Use a different name.");
      return;
    }

    const newReservation = {
      id: Date.now(),
      name,
      phone,
      guests: guestCount,
      checkIn: new Date().toLocaleString(),
      checkOut: null,
    };

    setReservations([...reservations, newReservation]);
    setSeatsLeft(seatsLeft - guestCount);
    setFormData({ name: "", phone: "", guests: "" });
    showToast("✅ Table booked successfully!");
  };

  const handleCheckout = (id) => {
    setReservations(
      reservations.map((res) =>
        res.id === id ? { ...res, checkOut: new Date().toLocaleString() } : res
      )
    );
    showToast("✅ Customer checked out!");
  };

  const handleDelete = (id) => {
    const reservation = reservations.find((res) => res.id === id);
    if (!reservation) return;

    if (reservation.checkOut) {
      setSeatsLeft(seatsLeft + reservation.guests);
    }

    setReservations(reservations.filter((res) => res.id !== id));
    showToast("❌ Reservation deleted.");
  };

  return (
    <div className="container">
      {toast && <div className="toast">{toast}</div>}
      <h2>🍽️ Restaurant Reservation System</h2>
      <p className="current-time">⏰ {time}</p>
      <p className="seats-left">💺 Seats Left: <span className="seat-count">{seatsLeft}</span> / {totalSeats}</p>

      <h3 className="menu-heading">📜 Menu</h3>
      <ul className="menu-list">
        {menuItems.map((item, index) => (
          <li key={index}>{item.name} - <strong>{item.price}</strong></li>
        ))}
      </ul>

      <form className="reservation-form" onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input type="number" name="guests" placeholder="Guest Count" value={formData.guests} onChange={handleChange} required />
        <button type="submit">📅 Book Table</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Guests</th>
            <th>Check-In Time</th>
            <th>Check-Out Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className={res.checkOut ? "checked-out" : ""}>
              <td>{res.name}</td>
              <td>{res.phone}</td>
              <td>{res.guests}</td>
              <td>{res.checkIn}</td>
              <td>{res.checkOut || "⌛ Not Checked Out"}</td>
              <td>
                {!res.checkOut && <button className="checkout-btn" onClick={() => handleCheckout(res.id)}>✅ Checkout</button>}
                <button className="delete-btn" onClick={() => handleDelete(res.id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantReservation;
