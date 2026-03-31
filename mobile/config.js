// Configuration file for the mobile app
// Update LAPTOP_IP with your laptop's IP address

// HOW TO FIND YOUR LAPTOP IP:
// Windows: ipconfig
// Mac: ifconfig | grep "inet " | grep -v 127.0.0.1  
// Linux: hostname -I

// IMPORTANT: Update this IP address!
export const LAPTOP_IP = '192.168.1.100';  // ← CHANGE THIS!

// Don't change these unless you changed the backend port
export const BACKEND_PORT = '8001';
export const API_PATH = '/api';

// Full backend URL (automatically constructed)
export const BACKEND_URL = `http://${LAPTOP_IP}:${BACKEND_PORT}${API_PATH}`;

// Debug info
console.log('📱 Mobile App Configuration:');
console.log(`🌐 Backend URL: ${BACKEND_URL}`);
console.log(`💻 Laptop IP: ${LAPTOP_IP}`);
console.log(`🔌 Backend Port: ${BACKEND_PORT}`);
