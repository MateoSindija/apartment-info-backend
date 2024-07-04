import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@config/config';
import { ForbiddenError } from '@errors/appError';
import Logger from '@loaders/logger';
import { Socket } from 'socket.io';
import Container from 'typedi';
import MessageService from '@services/message';

let socketRef: Server;

const SocketHandler = {
    createServer: (server: HttpServer) => {
        // Set up the server
        const io = new Server(server, {
            cors: {
                methods: ['GET', 'POST'],
            },
            pingInterval: 25000,
            pingTimeout: 30000,
        });

        socketRef = io;

        io.use((socket: Socket, next) => {
            const token =
                socket.handshake.query.token || socket.handshake.auth.token;

            if (!token) {
                next();
                return;
            }

            try {
                const decoded = jwt.verify(token, config.jwt.secret);

                socket.data.token = token;
                socket.data.decoded = decoded;
                next(); // Go to the next middleware
            } catch (error) {
                const err = new ForbiddenError('Invalid token.');
                next(err);
            }
        });

        io.on('connection', (socket) => {
            Logger.info(
                'Made socket connection. | ' +
                    socket.id +
                    ' | ' +
                    socket?.data?.decoded?.id ?? 'Anonymous'
            );

            socket.on('joinRoom', async (data) => {
                const room = generateRoomName(data.creatorId, data.recieverId);
                socket.join(room);
                Logger.info(`User joined ${socket.id} joined room ${room}`);
                const messageServiceInstance = Container.get(MessageService);
                await messageServiceInstance.UpdateIsRead(data.clientId);

                return await messageServiceInstance.GetMessages(
                    data.recieverId,
                    data.creatorId
                );
            });

            socket.on('publicKey', (data) => {
                socket.to(data.receiverId).emit('publicKey', {
                    senderId: socket.id,
                    publicKey: data.publicKey,
                });
            });

            socket.on('message', async (data) => {
                const { creatorId, recipientId, message } = data;
                const room = generateRoomName(creatorId, recipientId);
                io.to(room).emit('message', { message: message });
                const messageServiceInstance = Container.get(MessageService);

                await messageServiceInstance.AddMessage(
                    recipientId,
                    creatorId,
                    message
                );
            });

            socket.on('disconnect', () => {
                Logger.info(
                    'Socket disconnected. | ' +
                        socket.id +
                        ' | ' +
                        socket.data?.decoded?.id
                );
            });
        });
    },
    emit: (to: string, action: string, payload) => {
        if (!socketRef) return;

        socketRef.to(to).emit(action, payload);
    },
};
function generateRoomName(creatorId, receiverId): string {
    return [creatorId, receiverId].sort().join('-');
}

export { SocketHandler, socketRef };
