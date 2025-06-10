import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { getToken, onMessage } from "firebase/messaging";

import { db, messaging } from "../Lottery/firebaseStore/lotteryFirebase";
import {
  getUserNotifications,
  markNotificationAsRead,
  updateFCMToken,
} from "../../utils/apiService";
import { useAppContext } from "../../contextApi/context";
import strings from "../../utils/constant/stringConstant";
import { collection, onSnapshot } from "firebase/firestore";

const NotificationIcon = ({ isMobile }) => {
  const { store } = useAppContext();
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [isNotification, setIsNotification] = useState(null);

  const accessTokenFromStore = JSON.parse(
    localStorage.getItem(strings.LOCAL_STORAGE_KEY)
  )?.user?.accessToken;

  // Group and sort notifications
  const groupAndSortNotifications = (data) => {
    const grouped = {};

    data.forEach((notif) => {
      const marketKey = notif.MarketId || "general";
      if (!grouped[marketKey]) grouped[marketKey] = [];

      grouped[marketKey].push({
        ...notif,
        createdAt: notif.createdAt ? new Date(notif.createdAt) : null,
      });
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => {
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        return b.createdAt - a.createdAt;
      });
    });

    return grouped;
  };

  // Function to mark notification as read
  const handleNotificationClick = async (notification) => {
    if (notification.isRead) return;

    try {
      // Call API once to mark all unread notifications as read
      await markNotificationAsRead({ isRead: true });

      // Update local state to mark all unread notifications as read
      setNotifications((prev) => {
        const updated = {};
        for (const [key, notifs] of Object.entries(prev)) {
          updated[key] = notifs.map((n) => ({ ...n, isRead: true }));
        }
        return updated;
      });

      // Set unread count to 0
      setNotificationCount(0);
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  // Request permission and get FCM token
  useEffect(() => {
    if (!store.user?.isLogin) return;
    if (accessTokenFromStore) {
      const requestPermission = async () => {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const vapidKey =
            "BBrdxBcf-xma-KJVlwDAikMq_0p8O_rGH75t3c0giKx6AsUzUbKl9nmsuHGo1O0GwRWGH0F_1ldfBa0DpYmVacU";
          const token = await getToken(messaging, { vapidKey });
          if (token) {
            // await updateFCMToken(token);
          }
        }
      };

      requestPermission();

      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Message received: ", payload);
        const newMessage = {
          MarketId: "",
          message: payload.notification?.body || "You have a new notification",
          createdAt: new Date(),
          id: Date.now(),
        };

        setNotifications((prev) => {
          const grouped = { ...prev };
          const key = newMessage.MarketId || "general";
          grouped[key] = [newMessage, ...(grouped[key] || [])];
          return grouped;
        });

        setNotificationCount((prev) => prev + 1);
      });

      return () => unsubscribe();
    }
  }, [store.user?.isLogin, accessTokenFromStore]);

  // Load existing notifications
  useEffect(() => {
    if (!store.user?.isLogin) return;

    const loadNotifications = async () => {
      try {
        const response = await getUserNotifications();
        if (response.data) {
          const grouped = groupAndSortNotifications(response.data);
          setNotifications(grouped);

          const total = Object.values(grouped).reduce(
            (acc, arr) => acc + arr.length,
            0
          );
          setNotificationCount(total);
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    if (accessTokenFromStore) {
      loadNotifications();
    }
  }, [store.user?.isLogin, accessTokenFromStore, isNotification]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "lottery-notification"),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIsNotification(messagesData);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "color-game-notification"),
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setIsNotification(messagesData);
      }
    );

    return () => unsubscribe();
  }, []);

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
        onClick={async () => {
          const toggled = !showNotifications;
          setShowNotifications(toggled);

          if (toggled) {
            await handleNotificationClick({});
          }
        }}
        title="notifications"
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
            left: isMobile < 435 ? "90%" : "auto",
            transform: isMobile < 435 ? "translateX(-50%)" : "none",
            right: isMobile < 435 ? "auto" : 0,
            top: "40px",
            width: isMobile < 435 ? "90vw" : "400px",
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

          {Object.keys(notifications).length === 0 ? (
            <div className="text-center py-3">No notifications</div>
          ) : (
            Object.entries(notifications).map(([marketId, notifs], idx) => (
              <div key={marketId + idx} className="mb-3">
                <div
                  className="fw-bold text-info border-bottom pb-1 mb-2"
                  style={{ fontSize: "13px" }}
                >
                  {marketId === "general"
                    ? "General Updates"
                    : `Market: ${
                        notifs[0].message?.match(/"(.+?)"/)?.[1] || "Unknown"
                      }`}
                </div>

                {notifs.map((notification, index) => (
                  <div
                    key={notification.id || index}
                    className="border-bottom pb-2 mb-2"
                    style={{
                      wordWrap: "break-word",
                      whiteSpace: "normal",
                      fontSize: isMobile < 435 ? "13px" : "14px",
                    }}
                  >
                    <div>{notification.message}</div>
                    <div className="text-primary small">
                      {notification.createdAt
                        ? new Date(notification.createdAt).toLocaleString(
                            "en-IN",
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            }
                          )
                        : "Time not available"}
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;
