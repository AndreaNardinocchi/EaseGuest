import React from "react";

const ResponsiveBookingWrapper = ({ children }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Compact mobile bar */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.75rem 1rem",
          background: "#e26d5c",
          color: "white",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <span>Book your stay</span>
        <span>{open ? "▲" : "▼"}</span>
      </div>

      {/* Expandable form */}
      {open && (
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderBottom: "1px solid #ddd",
          }}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default ResponsiveBookingWrapper;
