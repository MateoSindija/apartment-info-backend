import {
    AllowNull,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table,
    Unique,
} from 'sequelize-typescript';

@Table({
    tableName: 'Users',
})
export class User extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare userId: string;

    @Column(DataType.STRING(50))
    declare firstName: string;

    @Column(DataType.STRING(50))
    declare lastName: string;

    @Unique
    @Column(DataType.STRING(40))
    declare email: string;

    @Column(DataType.STRING)
    declare password: string;

    @Default(false)
    @Column(DataType.BOOLEAN)
    declare emailVerified: boolean;

    @Column(DataType.UUID)
    declare verificationCode: string | null;

    @Column(DataType.UUID)
    declare resetCode: string | null;

    @Column(DataType.UUID)
    declare loginKey: string | null;

    @AllowNull
    @Column(DataType.STRING(283))
    declare imagePath: string | null;
}
