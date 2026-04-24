import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import { initSocketServer } from "./src/socket/server.socket.js";

const port = process.env.PORT;

const httpServer = http.createServer(app);
initSocketServer(httpServer);

connectDB();

httpServer.listen(port, () => {
  console.log("Server is running on port:", port);
});