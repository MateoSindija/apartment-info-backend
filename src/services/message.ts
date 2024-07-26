import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Message } from '@models/message';
import { Op } from 'sequelize';
import { Reservation } from '@models/reservation';

@Service()
export default class MessageService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetMessages(
        recipientId: string,
        userId: string
    ): Promise<Message[]> {
        this.Logger.info('Getting all messages between two users');
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { recipientId: recipientId, creatorId: userId },
                    { recipientId: userId, creatorId: recipientId },
                ],
                order: [['createdAt', 'DESC']],
            },
        });

        this.Logger.info('Found all messages!');

        return messages;
    }
    public async GetMessagesByReservationId(
        reservationId: string,
        userId: string
    ): Promise<Message[]> {
        this.Logger.info('Getting all messages with reservation users');

        const reservation = await Reservation.findByPk(reservationId);
        if (!reservation) throw new Error('Reservation not found');

        const { startDate, endDate } = reservation;

        const messages = await Message.findAll({
            where: {
                [Op.or]: [{ userId: userId }, { apartmentId: userId }],
                createdAt: {
                    [Op.between]: [startDate, endDate],
                },
            },
            order: [['createdAt', 'ASC']],
        });

        this.Logger.info('Found all messages!');

        return messages;
    }

    public async AddMessage(
        apartmentId: string,
        userId: string,
        senderId: string,
        messageBody: string
    ): Promise<Message> {
        this.Logger.info('Saving Message');

        const message = await Message.create({
            createdAt: new Date(),
            messageBody: messageBody,
            isRead: false,
            apartmentId: apartmentId,
            userId: userId,
            senderId: senderId,
        });

        this.Logger.info('Message Saved');
        return message;
    }
    public async UpdateIsRead(
        senderId: string,
        reservationId: string
    ): Promise<void> {
        this.Logger.info('Updating isRead');

        const reservation = await Reservation.findByPk(reservationId);
        if (!reservation) throw new Error('Reservation not found');

        const { startDate, endDate } = reservation;
        await Message.update(
            { isRead: true },
            {
                where: {
                    senderId: senderId,
                    createdAt: {
                        [Op.between]: [startDate, endDate],
                    },
                },
            }
        );

        this.Logger.info('isRead updated');
    }
}
