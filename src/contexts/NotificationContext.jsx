// // src/contexts/NotificationContext.js
// import { createContext, useContext, useState, useEffect } from 'react';

// const NotificationContext = createContext();

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error('useNotifications must be used within a NotificationProvider');
//   }
//   return context;
// };

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     // Load notifications from localStorage on initial load
//     const savedNotifications = localStorage.getItem('adminNotifications');
//     if (savedNotifications) {
//       try {
//         const parsedNotifications = JSON.parse(savedNotifications);
//         setNotifications(parsedNotifications);
//         setUnreadCount(parsedNotifications.filter(n => !n.read).length);
//       } catch (error) {
//         console.error('Error parsing notifications from localStorage:', error);
//         localStorage.removeItem('adminNotifications');
//       }
//     }
//   }, []);

//   const addNotification = (notification) => {
//     const newNotification = {
//       id: Date.now(),
//       message: notification.message,
//       type: notification.type,
//       read: false,
//       timestamp: new Date().toISOString(),
//     };
    
//     const updatedNotifications = [newNotification, ...notifications];
//     setNotifications(updatedNotifications);
//     setUnreadCount(unreadCount + 1);
//     localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
//   };

//   const markAsRead = (id) => {
//     const updatedNotifications = notifications.map(notification => 
//       notification.id === id ? { ...notification, read: true } : notification
//     );
    
//     setNotifications(updatedNotifications);
//     setUnreadCount(updatedNotifications.filter(n => !n.read).length);
//     localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
//   };

//   const markAllAsRead = () => {
//     const updatedNotifications = notifications.map(notification => ({
//       ...notification,
//       read: true
//     }));
    
//     setNotifications(updatedNotifications);
//     setUnreadCount(0);
//     localStorage.setItem('adminNotifications', JSON.stringify(updatedNotifications));
//   };

//   const clearAll = () => {
//     setNotifications([]);
//     setUnreadCount(0);
//     localStorage.removeItem('adminNotifications');
//   };

//   const value = {
//     notifications,
//     unreadCount,
//     addNotification,
//     markAsRead,
//     markAllAsRead,
//     clearAll
//   };

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export default NotificationContext;