/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js',
);

const firebaseConfig = {
  apiKey: 'AIzaSyD9i__VfSTi45f2D285rrd-wHp3_AcO0Fk',
  projectId: 'matchgg-storage',
  messagingSenderId: '978591881674',
  appId: '1:978591881674:web:2bd5789052326c8455d733',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo192.png',
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
