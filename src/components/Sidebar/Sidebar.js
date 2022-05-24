import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const userTabs = [
    { title: "Order a ride", route: "/order" },
    { title: "Ride history", route: "/ride-history" },
  ];
  const adminTabs = [
    ...userTabs,
    {
      title: "Accounts",
      route: "/accounts",
    },
    {
      title: "Order history",
      route: "/order-history",
    },
    {
      title: "Driver",
      route: "/drivers-listing",
    },
    // {
    //   title: "Tarrif",
    //   route: "/Tarrif-listing",
    // },
  ];
  const role = sessionStorage.getItem("role");
  const pathname = window.location.pathname;

  const getTabs = () => {
    return role === "Admin" ? adminTabs : userTabs;
  };

  React.useEffect(() => {
    const adminRoutes = ["/accounts", "/order-history"];
    role === "User" &&
      adminRoutes.includes(window.location.pathname) &&
      navigate("/order");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <div className="sidebar p-4">
      <div className="app-logo" />
      <div className="pt-5">
        <div className="navigation">Main Navigation</div>
        {getTabs().map((tab, index) => {
          return (
            <div
              key={index}
              className={`tab ${
                tab.route === pathname ||
                (pathname.includes("account") && tab.title === "Accounts") ||
                (pathname.includes("edit-order") &&
                  tab.title === "Order a ride") ||
                (pathname.includes("order-history") &&
                  tab.title === "Order history")
                  ? "active"
                  : ""
              }`}
              onClick={() => navigate(tab.route)}
            >
              {tab.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Sidebar;
