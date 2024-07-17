import {
    BelongsTo,
    BelongsToMany,
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
import { BeachApartment } from '@models/beachApartment';
import { Apartment } from '@models/apartment';
import { RestaurantApartment } from '@models/restaurantApartment';

@Table({
    tableName: 'Beaches',
})
export class Beach extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare beachId: string;

    @Column(DataType.STRING(50))
    declare title: string;

    @Column(DataType.STRING(1000))
    declare description: string;

    @Column(DataType.ARRAY(DataType.STRING))
    declare imagesUrl: string[];

    @Column(DataType.STRING)
    declare titleImage: string;

    @Column(DataType.GEOGRAPHY('Point'))
    declare location: number;

    @Column(DataType.STRING)
    declare terrainType: 'gravel' | 'sand';

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @BelongsToMany(() => Apartment, () => BeachApartment)
    declare apartments: Apartment[];
}
