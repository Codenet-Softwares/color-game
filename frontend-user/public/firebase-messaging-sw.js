importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBZQJrXdThPqxxdZonU7nq3obWA6OXM9Ig",
  authDomain: "color-game-6ee12.firebaseapp.com",
  projectId: "color-game-6ee12",
  storageBucket: "color-game-6ee12.firebasestorage.app",
  messagingSenderId: "942283542981",
  appId: "1:942283542981:web:cf0ef9b7b05f9f621ffbac"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new notification",
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});