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
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'Organizations',
})
export class Organization extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare organizationId: string;

    @Column(DataType.STRING(50))
    declare name: string;

    @Column(DataType.STRING)
    declare titleImage: string;

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @HasMany(() => User)
    declare workers: User[];

    @HasMany(() => Apartment)
    declare apartments: Apartment[];

    @BelongsTo(() => User)
    declare owner: User;
}
