import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import http from "http";
import { initSocketServer } from "./src/socket/server.socket.js";
import { verifyEmailService } from "./src/services/mail.service.js";
import agenda from "./src/config/agenda.js";
import logger from "./src/utils/logger.js";

const port = process.env.PORT;

const httpServer = http.createServer(app);
initSocketServer(httpServer);

// Connect to Database and start Agenda job queue
connectDB().then(async () => {
  await agenda.start();
  logger.info('Agenda job queue started');
}).catch((err) => {
  logger.error('Failed to initialize database or agenda queue', err);
});

verifyEmailService();

httpServer.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
});