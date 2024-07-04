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
import { Apartment } from '@models/apartment';
import { Organization } from '@models/organization';

@Table({
    tableName: 'ScrapingLinks',
})
export class Scraping extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare scrapingId: string;

    @Column(DataType.STRING)
    declare url: string;

    @Column(DataType.STRING)
    declare siteType: string;

    @Column(DataType.UUID)
    @ForeignKey(() => Apartment)
    declare apartmentId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @Column(DataType.UUID)
    @ForeignKey(() => Organization)
    declare organizationId: string;

    @BelongsTo(() => Organization)
    declare organization: Organization;
}
