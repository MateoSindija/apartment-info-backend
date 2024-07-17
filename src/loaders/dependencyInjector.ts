import { Container } from 'typedi';
import LoggerInstance from './logger';
import PgBoss from 'pg-boss';

export default ({
    boss,
    postgresConnection,
    models,
}: {
    boss: PgBoss;
    postgresConnection: unknown;
    models: { name: string; model: unknown }[];
}) => {
    try {
        Container.set('jobs', boss);
        LoggerInstance.info('✌️ PgBoss injected into container');

        Container.set('database', postgresConnection);
        LoggerInstance.info('✌️ Database Connection injected into container');

        models.forEach((m) => {
            Container.set(m.name, m.model);
        });
        LoggerInstance.info('✌️ Models injected into container');

        // sgMail.setApiKey(process.env.SENDGRID_API_KEY ?? '');
        // Container.set('mailer', sgMail);
        // LoggerInstance.info('💌Sendgrid Mail injected into container');

        Container.set('logger', LoggerInstance);
        LoggerInstance.info('✌️ Logger injected into container');
    } catch (e) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
