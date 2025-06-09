import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { getToken, onMessage } from "firebase/messaging";

import { messaging } from "../Lottery/firebaseStore/lotteryFirebase";
import { getUserNotifications, updateFCMToken } from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";

const NotificationIcon = ({ isMobile , position = "top" }) => {
  const { store } = useAppContext();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
 // Adjust dropdown style based on position
  const dropdownStyle =
    position === "bottom"
      ? {
          bottom: "45px", // raise it above the footer icon
          right: 0,
        }
      : {
          top: "45px", // below the icon in header
          right: 0,
        };
  // Request permission and get FCM token
  useEffect(() => {
    if (!store.user?.isLogin) return;

    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const vapidKey =
          "BBrdxBcf-xma-KJVlwDAikMq_0p8O_rGH75t3c0giKx6AsUzUbKl9nmsuHGo1O0GwRWGH0F_1ldfBa0DpYmVacU";
        const token = await getToken(messaging, { vapidKey });
        if (token) {
          await updateFCMToken(token);
        }
      }
    };

    requestPermission();

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // Update notification count and list
      setNotificationCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          title: payload.notification?.title || "New Notification",
          body: payload.notification?.body || "You have a new notification",
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    });

    return () => unsubscribe();
  }, [store.user?.isLogin]);

  // Load existing notifications
  useEffect(() => {
    if (!store.user?.isLogin) return;

    const loadNotifications = async () => {
      try {
        const response = await getUserNotifications();
        if (response.data) {
          setNotifications(response.data);
          setNotificationCount(response.data.length);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
  }, [store.user?.isLogin]);

  if (!store.user?.isLogin) return null;

  return (
   <div className="position-relative">
      <button
        className="btn btn-sm border border-white me-2 d-flex align-items-center justify-content-center text-white mx-1"
        style={{
          height: "35px",
          width: "35px",
          backgroundColor: "#2d2d2d",
          fontSize: "14px",
          padding: "5px 8px",
        }}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <FaBell />
        {notificationCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {notificationCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          className="position-absolute bg-dark text-white p-2 rounded shadow"
          style={{
            ...dropdownStyle,
            width: "300px",
            maxHeight: "400px",
            overflowY: "auto",
            zIndex: 1000,
          }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
            <h6 className="m-0">Notifications</h6>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-3">No notifications</div>
          ) : (
            notifications.map((notification, index) => (
              <div key={index} className="border-bottom pb-2 mb-2">
                <div className="fw-bold">{notification.message}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
