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
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'Messages',
    timestamps: false,
})
export class Message extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare messageId: string;

    @Column
    @ForeignKey(() => Apartment)
    declare apartmentId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @Column
    @ForeignKey(() => User)
    declare userId: string;

    @Column(DataType.UUID)
    declare senderId: string;

    @BelongsTo(() => User)
    declare user: User;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare isRead: boolean;

    @Column(DataType.STRING)
    declare messageBody: string;

    @Column(DataType.DATE)
    declare createdAt: Date;
}
