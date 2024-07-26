import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '@config/config';
import { ForbiddenError } from '@errors/appError';
import Logger from '@loaders/logger';
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

            socket.on(
                'joinRoom',
                async ({
                    reservationId,
                    userId,
                }: {
                    reservationId: string;
                    userId: string;
                }) => {
                    socket.join(reservationId);
                    Logger.info(
                        `User joined ${socket.id} joined room ${reservationId}`
                    );
                    const messageServiceInstance =
                        Container.get(MessageService);

                    await messageServiceInstance.UpdateIsRead(
                        userId,
                        reservationId
                    );

                    const messages =
                        await messageServiceInstance.GetMessagesByReservationId(
                            reservationId,
                            userId
                        );

                    socket.emit('messages', messages);
                }
            );

            socket.on('publicKey', (data) => {
                socket.to(data.receiverId).emit('publicKey', {
                    senderId: socket.id,
                    publicKey: data.publicKey,
                });
            });

            socket.on('message', async (data) => {
                const {
                    userId,
                    messageBody,
                    apartmentId,
                    reservationId,
                    senderId,
                } = data;
                const messageServiceInstance = Container.get(MessageService);

                const message = await messageServiceInstance.AddMessage(
                    apartmentId,
                    userId,
                    senderId,
                    messageBody
                );

                io.to(reservationId).emit('new-message', message);
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

export { SocketHandler, socketRef };
