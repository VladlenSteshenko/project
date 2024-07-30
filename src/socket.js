// src/socket.js
import { io } from 'socket.io-client';

const socket = io('ws://chat.ed.asmer.org.ua'); 
export default socket;
