import express from 'express';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { errorHandler, unknownEndpoint } from './utils/middleware.js';
import { NODE_ENV, PORT } from './utils/config.js';
import { connectToDatabase } from './utils/db.js';

import citiesRouter from './controllers/cities.ts';
import districtsRouter from './controllers/districts.ts';
import equipmentRouter from './controllers/equipment.js';
import gymEquipmentRouter from './controllers/gymequipment.ts';
import gymManagersRouter from './controllers/gymmanagers.ts';
import gymMembershipsRouter from './controllers/gymmemberships.ts';
import gymsRouter from './controllers/gyms.js';
import loginRouter from './controllers/login.ts';
import logoutRouter from './controllers/logout.ts';
import membershipsRouter from './controllers/memberships.ts';
import usersRouter from './controllers/users.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pathToFrontendBuild: string;

if (NODE_ENV === 'production') {
  pathToFrontendBuild = path.join(__dirname, '../../dist');
} else {
  pathToFrontendBuild = path.join(__dirname, '/dist');
}

app.use(express.static(pathToFrontendBuild));
if (NODE_ENV === 'development') {
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
}
app.use(express.json());
app.use(cookieParser());

app.use('/api/cities', citiesRouter);
app.use('/api/districts', districtsRouter);
app.use('/api/equipment', equipmentRouter);
app.use('/api/gyms', gymsRouter);
app.use('/api/gymequipment', gymEquipmentRouter);
app.use('/api/gymmanagers', gymManagersRouter);
app.use('/api/gymmemberships', gymMembershipsRouter);
app.use('/api/login', loginRouter);
app.use('/api/logout', logoutRouter);
app.use('/api/memberships', membershipsRouter);
app.use('/api/users', usersRouter);

// Since Express 5, *splat is used instead of just *
app.get('*splat', (_req, res) => {
  res.sendFile(path.join(pathToFrontendBuild, 'index.html'));
});

app.use(unknownEndpoint);
app.use(errorHandler);

try {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT.toString()}`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}

export default app;
