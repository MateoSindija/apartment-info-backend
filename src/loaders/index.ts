import Logger from './logger';
import { isDev } from '@config/config';
import { Shop } from '@models/shop';
import postgresLoader from './postgres';
import pgBossLoader from './pgboss';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
export default async ({ expressApp }) => {
    const postgresInstance = await postgresLoader();
    Logger.info('✌️ DB loaded and connected!');
    Logger.info('Server running in ' + isDev + ' mode.');
    const shopModel = {
        name: 'ShopModel',
        model: Shop,
    };
    const boss = pgBossLoader();

    await postgresInstance?.sync();

    dependencyInjectorLoader({
        boss,
        postgresConnection: postgresInstance,
        models: [shopModel],
    });

    Logger.info('✌️ Dependency Injector loaded');

    expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');

    // webpush.setVapidDetails(
    //     'mailto:contact@apartment.app',
    //     process.env.VAPID_PUBLIC_KEY,
    //     process.env.VAPID_PRIVATE_KEY
    // );

    Logger.info('✌️ EWeb Push loaded');
};
