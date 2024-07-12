import {
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
import { Reservation } from '@models/reservation';
import { Scraping } from '@models/scraping';

@Table({
    tableName: 'Apartments',
})
export class Apartment extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @Column(DataType.STRING(50))
    declare name: string;

    @Column(DataType.STRING(80))
    declare address: string;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare ownerId: string;

    @HasMany(() => Reservation)
    declare reservations: Reservation[];

    @HasMany(() => Scraping)
    declare scrapingLinks: Scraping[];

    @BelongsTo(() => User)
    declare owner: User;
}
