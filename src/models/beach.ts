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
