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
    tableName: 'Devices',
})
export class Device extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare deviceId: string;

    @Column(DataType.STRING(50))
    declare title: string;

    @Column(DataType.STRING(1000))
    declare description: string;

    @Column(DataType.ARRAY(DataType.STRING))
    declare imagesUrl: string[];

    @Column(DataType.STRING)
    declare titleImage: string;

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
