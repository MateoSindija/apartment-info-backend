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
import { User } from '@models/user';

@Table({
    tableName: 'ScrapingLinks',
    timestamps: false,
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
    @ForeignKey(() => User)
    declare userId: string;

    @BelongsTo(() => User)
    declare owner: User;
}
