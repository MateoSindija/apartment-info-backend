import config, { isDev } from '@config/config';
import PgBoss from 'pg-boss';

import fs from 'fs';
import path from 'path';

export default () => {
    return new PgBoss({
        host: config.postgres.host,
        user: config.postgres.user,
        port: config.postgres.port,
        password: config.postgres.password,
        database: config.postgres.database,
        ...(isDev
            ? {}
            : {
                  ssl: {
                      rejectUnauthorized: true,
                      ca: fs
                          .readFileSync(
                              path.resolve(__dirname, '../global-bundle.pem'),
                              'ascii'
                          )
                          .toString(),
                  },
              }),
    });
};
