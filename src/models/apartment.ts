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
import { Organization } from '@models/organization';
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

    @Column(DataType.UUID)
    @ForeignKey(() => Organization)
    declare organizationId: string;

    @HasMany(() => User)
    declare workers: User[];

    @HasMany(() => Reservation)
    declare reservations: Reservation[];

    @HasMany(() => Scraping)
    declare scrapingLinks: Scraping[];

    @BelongsTo(() => Organization)
    declare organization: Organization;
}
