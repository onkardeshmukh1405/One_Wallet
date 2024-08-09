import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DefaultLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      icon: <i class="ri-home-7-line"></i>,
      onClick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Transactions",
      icon: <i class="ri-bank-line"></i>,
      onClick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i class="ri-hand-heart-line"></i>,
      onClick: () => navigate("/requests"),
      path: "/requests",
    },

    {
      title: "Logout",
      icon: <i class="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      path: "/logout",
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      icon: <i class="ri-home-7-line"></i>,
      onClick: () => navigate("/"),
      path: "/",
    },
    {
      title: "Users",
      icon: <i class="ri-user-settings-line"></i>,
      onClick: () => navigate("/users"),
      path: "/users",
    },
    {
      title: "Transactions",
      icon: <i class="ri-bank-line"></i>,
      onClick: () => navigate("/transactions"),
      path: "/transactions",
    },
    {
      title: "Requests",
      icon: <i class="ri-hand-heart-line"></i>,
      onClick: () => navigate("/requests"),
      path: "/requests",
    },

    {
      title: "Logout",
      icon: <i class="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
      path: "/logout",
    },
  ];

  const menuToRender = user?.isAdmin ? adminMenu : userMenu;

  return (
    <div className="layout">
      <div className="sidebar">
        <div className="menu">
          {menuToRender.map((item) => {
            const isActive = window.location.pathname === item.path;

            return (
              <div
                className={`menu-item ${isActive ? "active-menu-item" : ""}`}
                onClick={item.onClick}
              >
                {item.icon}
                {!collapsed && <h1 className="text-sm">{item.title}</h1>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="body">
        <div className="header flex justify-between items-center">
          <div className="text-secondary">
            {!collapsed && (
              <i
                class="ri-close-line"
                onClick={() => setCollapsed(!collapsed)}
              ></i>
            )}
            {collapsed && (
              <i
                class="ri-menu-2-line"
                onClick={() => setCollapsed(!collapsed)}
              ></i>
            )}
          </div>
          <div>
            <h1 className="text-xl text-secondary">WALLET</h1>
          </div>
          <div className="text-sm underline text-secondary">
            {user?.firstName} {user?.lastName}
          </div>
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default DefaultLayout;