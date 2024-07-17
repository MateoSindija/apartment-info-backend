import {
    AllowNull,
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '@models/user';
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'Reservations',
})
export class Reservation extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare reservationId: string;

    @Column(DataType.DATE)
    declare startDate: Date;

    @Column(DataType.DATE)
    declare endDate: Date;

    @Column(DataType.UUID)
    @ForeignKey(() => Apartment)
    declare apartmentId: string;

    // @AllowNull
    // @Column(DataType.UUID)
    // @ForeignKey(() => User)
    // declare userId: string;
    //
    // @HasMany(() => User)
    // declare workers: User[];

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;
}
