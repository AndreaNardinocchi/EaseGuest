// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { searchAvailableRooms } from "../../supabase/roomService";
// import { useBooking } from "../../context/bookingContext";

// type BookingFormData = {
//   checkIn: string;
//   checkOut: string;
//   guests: number;
// };

// const BookingForm: React.FC = () => {
//   const navigate = useNavigate();
//   const { bookRoom } = useBooking();

//   const [formData, setFormData] = useState<BookingFormData>({
//     checkIn: "",
//     checkOut: "",
//     guests: 1,
//   });

//   const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

//   // Responsive state
//   useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: name === "guests" ? Number(value) : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!formData.checkIn || !formData.checkOut) {
//       alert("Please select both check-in and check-out dates.");
//       return;
//     }

//     if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
//       alert("Check-out date must be after check-in date.");
//       return;
//     }

//     const result = await searchAvailableRooms(
//       formData.checkIn,
//       formData.checkOut
//     );

//     if (!result.success) {
//       alert(`❌ ${result.message}`);
//       return;
//     }

//     if (result.rooms.length === 0) {
//       alert("No rooms available for these dates.");
//       return;
//     }

//     navigate("/search-results", {
//       state: { availableRooms: result.rooms, searchParams: formData },
//     });
//   };

//   // Shared styles
//   const formStyle: React.CSSProperties = {
//     display: "flex",
//     flexDirection: isMobile ? "column" : "row",
//     flexWrap: isMobile ? "nowrap" : "wrap",
//     alignItems: isMobile ? "stretch" : "flex-end",
//     justifyContent: "center",
//     gap: "1rem",
//     width: "100%",
//     maxWidth: isMobile ? "95%" : "900px",
//     margin: "0 auto",
//     padding: isMobile ? "0.75rem" : "1rem",
//     boxSizing: "border-box",
//   };

//   const fieldContainerStyle: React.CSSProperties = {
//     display: "flex",
//     flexDirection: "column",
//     flex: isMobile ? "1 1 100%" : "1 1 200px",
//     minWidth: isMobile ? "100%" : "180px",
//   };

//   const labelStyle: React.CSSProperties = {
//     marginBottom: "0.5rem",
//     fontWeight: "bold",
//   };

//   const inputStyle: React.CSSProperties = {
//     padding: "0.75rem",
//     fontSize: "1rem",
//     borderRadius: "10px",
//     border: "1px solid #ccc",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//     outline: "none",
//     backgroundColor: "#fff",
//     // width: "100%",
//     width: isMobile ? "100%" : "auto",
//     boxSizing: "border-box",
//   };

//   const buttonStyle: React.CSSProperties = {
//     height: "3rem",
//     padding: "0 1.5rem",
//     fontSize: "1rem",
//     fontWeight: 500,
//     borderRadius: "10px",
//     border: "none",
//     backgroundColor: "#8E4585",
//     color: "#fff",
//     cursor: "pointer",
//     transition: "all 0.2s ease",
//     width: isMobile ? "100%" : "auto",
//     marginTop: isMobile ? "0.5rem" : "0",
//     boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//   };

//   return (
//     <form onSubmit={handleSubmit} style={formStyle}>
//       <div style={fieldContainerStyle}>
//         <label style={labelStyle}>Check-in</label>
//         <input
//           type="date"
//           name="checkIn"
//           value={formData.checkIn}
//           onChange={handleChange}
//           required
//           style={inputStyle}
//         />
//       </div>

//       <div style={fieldContainerStyle}>
//         <label style={labelStyle}>Check-out</label>
//         <input
//           type="date"
//           name="checkOut"
//           value={formData.checkOut}
//           onChange={handleChange}
//           required
//           style={inputStyle}
//         />
//       </div>

//       <div style={fieldContainerStyle}>
//         <label style={labelStyle}>Guests</label>
//         <input
//           type="number"
//           name="guests"
//           value={formData.guests}
//           onChange={handleChange}
//           min={1}
//           style={inputStyle}
//         />
//       </div>

//       <button type="submit" style={buttonStyle}>
//         Search Rooms
//       </button>
//     </form>
//   );
// };

// export default BookingForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchAvailableRooms } from "../../supabase/roomService";
import { useBooking } from "../../context/bookingContext";

type BookingFormData = {
  checkIn: string;
  checkOut: string;
  guests: number;
};

const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const { bookRoom } = useBooking();

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

  // Responsive state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.checkIn || !formData.checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    const result = await searchAvailableRooms(
      formData.checkIn,
      formData.checkOut,
      formData.guests
    );

    console.log("UI sending:", formData);

    if (!result.success) {
      alert(`❌ ${result.message}`);
      return;
    }

    if (result.rooms.length === 0) {
      alert("No rooms available for these dates.");
      return;
    }

    // ✅ Updated: navigate using query parameters
    navigate(
      `/search-results?checkIn=${encodeURIComponent(
        formData.checkIn
      )}&checkOut=${encodeURIComponent(formData.checkOut)}&guests=${
        formData.guests
      }`
    );
  };

  // Shared styles
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    flexWrap: isMobile ? "nowrap" : "wrap",
    alignItems: isMobile ? "stretch" : "flex-end",
    justifyContent: "center",
    gap: "1rem",
    width: "100%",
    maxWidth: isMobile ? "95%" : "900px",
    margin: "0 auto",
    padding: isMobile ? "0.75rem" : "1rem",
    boxSizing: "border-box",
  };

  const fieldContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    flex: isMobile ? "1 1 100%" : "1 1 200px",
    minWidth: isMobile ? "100%" : "180px",
  };

  const labelStyle: React.CSSProperties = {
    marginBottom: "0.5rem",
    fontWeight: "bold",
  };

  const inputStyle: React.CSSProperties = {
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    outline: "none",
    backgroundColor: "#fff",
    width: isMobile ? "100%" : "auto",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    height: "3rem",
    padding: "0 1.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#8E4585",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.2s ease",
    width: isMobile ? "100%" : "auto",
    marginTop: isMobile ? "0.5rem" : "0",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Check-in</label>
        <input
          type="date"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Check-out</label>
        <input
          type="date"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          required
          style={inputStyle}
        />
      </div>

      <div style={fieldContainerStyle}>
        <label style={labelStyle}>Guests</label>
        <input
          type="number"
          name="guests"
          value={formData.guests}
          onChange={handleChange}
          min={1}
          style={inputStyle}
        />
      </div>

      <button type="submit" style={buttonStyle}>
        Search Rooms
      </button>
    </form>
  );
};

export default BookingForm;
