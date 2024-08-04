import config, { isDev } from '@config/config';
import { Sequelize } from 'sequelize-typescript';
import Logger from './logger';
import fs from 'fs';
// eslint-disable-next-line
import { SCHEMA } from '@constants/schema';
import path from 'path';
import { Shop } from '@models/shop';
import { User } from '@models/user';
import { Sight } from '@models/sight';
import { Apartment } from '@models/apartment';
import { Beach } from '@models/beach';
import { Device } from '@models/device';
import { Restaurant } from '@models/restaurant';
import { Message } from '@models/message';
import { Reservation } from '@models/reservation';
import { Review } from '@models/review';
import { Scraping } from '@models/scraping';
import { BeachApartment } from '@models/beachApartment';
import { DeviceApartment } from '@models/deviceApartment';
import { ShopApartment } from '@models/shopApartment';
import { SightApartment } from '@models/sightApartment';
import { RestaurantApartment } from '@models/restaurantApartment';
import { AboutUs } from '@models/aboutUs';

const connect = async () => {
    try {
        const sequelize = new Sequelize(
            config.postgres.database,
            config.postgres.user,
            config.postgres.password,
            {
                host: config.postgres.host,
                port: config.postgres.port,
                dialect: 'postgres',
                schema: SCHEMA,
                // Only start SSL connections in production
                ...(isDev
                    ? {}
                    : {
                          dialectOptions: {
                              ssl: {
                                  rejectUnauthorized: true,
                                  ca: fs
                                      .readFileSync(
                                          path.resolve(
                                              __dirname,
                                              '../global-bundle.pem'
                                          ),
                                          'ascii'
                                      )
                                      .toString(),
                              },
                          },
                      }),
                define: {
                    timestamps: true,
                    createdAt: 'createdAt',
                    updatedAt: 'updatedAt',
                    deletedAt: 'deletedAt',
                },
                models: [
                    AboutUs,
                    Shop,
                    User,
                    Sight,
                    Restaurant,
                    Beach,
                    Device,
                    Reservation,
                    Apartment,
                    BeachApartment,
                    DeviceApartment,
                    ShopApartment,
                    SightApartment,
                    RestaurantApartment,
                    Message,
                    Review,
                    Scraping,
                ],
            }
        );

        await sequelize.authenticate();

        return sequelize;
    } catch (error) {
        Logger.error(error);
        return null;
    }
};

export default connect;
