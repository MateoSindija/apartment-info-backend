import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Message } from '@models/message';
import { Op } from 'sequelize';

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

    public async AddMessage(
        recipientId: string,
        creatorId: string,
        message: string
    ): Promise<void> {
        this.Logger.info('Saving Message');

        await Message.create({
            messageBody: message,
            isRead: false,
            recipientId: recipientId,
            creatorId: creatorId,
        });

        this.Logger.info('Message Saved');
    }
    public async UpdateIsRead(userId: string): Promise<void> {
        this.Logger.info('Updating isRead');

        await Message.update(
            {
                isRead: true,
            },
            { where: { recipientId: userId } }
        );

        this.Logger.info('isRead updated');
    }
}
