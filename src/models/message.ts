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
    @Column(DataType.UUID)
    @Default(DataType.UUIDV4)
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

    @Column(DataType.BOOLEAN)
    @Default(false)
    declare isRead: boolean;

    @Column(DataType.STRING)
    declare messageBody: string;
}
