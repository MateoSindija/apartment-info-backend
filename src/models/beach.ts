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
import { ApartmentAttraction } from '@models/apartmentAttraction';

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

    @Column(DataType.DOUBLE)
    declare lat: number;

    @Column(DataType.DOUBLE)
    declare lng: number;

    @Column(DataType.STRING)
    declare terrainType: 'gravel' | 'sand';

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @HasMany(() => ApartmentAttraction, 'attractionId')
    declare apartmentAttractions: ApartmentAttraction[];
}
