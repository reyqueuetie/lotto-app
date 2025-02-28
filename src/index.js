import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins (for development)
    },
});

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, "../public")));

// Handle root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Countdown logic
let countdown = 60; 

// Function to start the countdown
const startCountdown = () => {
    setInterval(() => {
        if (countdown > 0) {
            countdown--;
        } else {
            countdown = 60; // Reset to 60 seconds
        }
        io.emit('countdown', countdown); // io.emit means ibobroadcast nya sa lahat ng subscribers
    }, 1000); // Update every second
};

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A subscriber connected:', socket.id);

    // Send the current countdown value to the newly connected subscriber
    socket.emit('countdown', countdown);

    // Handle subscriber disconnect
    socket.on('disconnect', () => {
        console.log('A subscriber disconnected:', socket.id);
    });
});

// Start the countdown when the server starts
startCountdown();
// Start the publisher server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

