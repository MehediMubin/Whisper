import express from 'express';
import { getUsersForSidebar, getMessages, markMessageAsSeen } from '../controllers/messageController';
import { protectRoute } from '../middleware/auth';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForSidebar);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessagesAsSeen);