import {
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '@models/user';

@Table({
    tableName: 'Messages',
})
export class Message extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare messageId: string;

    @Column
    @ForeignKey(() => User)
    declare creatorId: string;

    @BelongsTo(() => User)
    declare creator: User;

    @Column
    @ForeignKey(() => User)
    declare recipientId: string;

    @BelongsTo(() => User)
    declare recipient: User;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isRead: boolean;

    @Column(DataType.STRING)
    declare messageBody: string;
}
