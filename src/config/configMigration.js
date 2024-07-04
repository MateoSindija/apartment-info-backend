module.exports = {
    development: {
        host: process.env.DEV_POSTGRES_HOST || 'localhost',
        username: process.env.DEV_POSTGRES_USER || 'postgres',
        port: parseInt(process.env.DEV_POSTGRES_PORT, 10) || '5432',
        password: process.env.DEV_POSTGRES_PASS || 'admin',
        database: process.env.DEV_POSTGRES_DB || 'apartment',
        dialect: 'postgres',
        schema: process.env.DEV_POSTGRES_SCHEMA || 'public',
    },
    test: {
        host: process.env.DEV_POSTGRES_HOST || 'localhost',
        username: process.env.DEV_POSTGRES_USER || 'postgres',
        port: parseInt(process.env.DEV_POSTGRES_PORT, 10) || '5432',
        password: process.env.DEV_POSTGRES_PASS || 'admin',
        database: process.env.DEV_POSTGRES_DB || 'rwtdb',
        dialect: 'postgres',
        schema: process.env.DEV_POSTGRES_SCHEMA || 'public',
    },
    production: {
        host:
            process.env.PROD_POSTGRES_HOST ||
            'koena.cmbghw53qjqy.eu-central-1.rds.amazonaws.com',
        username: process.env.PROD_POSTGRES_USER || 'postgres',
        port: parseInt(process.env.PROD_POSTGRES_PORT, 10) || '5432',
        password: process.env.PROD_POSTGRES_PASS || 'tuzfav-mehqaR-capdi8',
        database: process.env.PROD_POSTGRES_DB || 'postgres',
        dialect: 'postgres',
        schema: process.env.DEV_POSTGRES_SCHEMA || 'public',
        ssl: true,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    },
};
