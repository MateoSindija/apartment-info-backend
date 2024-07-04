import { Inject, Service } from 'typedi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@config/config';
import { LoggerType } from '@loaders/logger';
import { AppError, ForbiddenError } from '@errors/appError';
import { User } from '@models/user';
import PgBoss from 'pg-boss';
import { randomUUID } from 'crypto';
import { CommonErrors } from '@errors/common';
import { StatusCodes } from 'http-status-codes';
import { BaseError } from 'sequelize';

@Service()
export default class AuthService {
    constructor(
        @Inject('logger') private Logger: LoggerType,
        @Inject('jobs') private jobs: PgBoss
    ) {}

    public async SignUp(userDTO: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        imagePath: null;
    }): Promise<{ id: string; accessToken: string; type: string }> {
        try {
            // Create e-mail verification key and login key
            const verificationKey = randomUUID();
            const loginKey = randomUUID();

            // Hash password
            const hash = await this.hashPassword(userDTO.password);

            const user = await User.create({
                firstName: userDTO.firstName,
                lastName: userDTO.lastName,
                email: userDTO.email,
                verificationCode: verificationKey,
                loginKey: loginKey,
                password: hash,
                imagePath: userDTO.imagePath,
            });

            const accessToken = await this.generateToken(
                user.userId,
                user?.loginKey ?? '',
                'user'
            );

            await this.jobs.send('send-welcome-email', {
                email: user.email,
                firstName: user.firstName,
            });

            return {
                id: user.userId,
                type: 'user',
                accessToken,
            };
        } catch (e: unknown) {
            if (e instanceof BaseError && e.message === '23205')
                throw new AppError(
                    CommonErrors.CONFLICT,
                    'A user with that information already exists.',
                    StatusCodes.CONFLICT
                );

            this.Logger.error(e);
            throw e;
        }
    }

    public async Login(
        email: string,
        password: string
    ): Promise<{ token: string; type: string; id: string | undefined }> {
        try {
            const user = await User.findOne({ where: { Email: email } });

            const match = await this.comparePassword(
                password,
                user?.password ?? ''
            );

            if (!match) throw new ForbiddenError('Incorrect password.');

            if (user?.loginKey) user.loginKey = randomUUID();
            await user?.save();

            const accessToken = await this.generateToken(
                user?.userId ?? '',
                user?.loginKey ?? '',
                'user'
            );

            return {
                token: accessToken,
                type: 'user',
                id: user?.userId,
            };
        } catch (e) {
            this.Logger.error(e);
            throw e;
        }
    }

    public async InitResetPassword(email: string): Promise<void> {
        try {
            const user = await User.findOne({ where: { Email: email } });

            if (user?.resetCode) user.resetCode = randomUUID();

            const resetToken = await this.generateResetToken(
                user?.userId ?? '',
                user?.resetCode ?? ''
            );

            await user?.save();

            await this.jobs.send('send-reset-email', {
                email: user?.email,
                resetToken,
                firstName: user?.firstName,
            });
        } catch (e) {
            this.Logger.error(e);
            throw e;
        }
    }

    public async ResetPassword(
        email: string,
        token: string,
        password: string
    ): Promise<void> {
        try {
            const user = await User.findOne({ where: { Email: email } });

            const decoded = this.verifyResetToken(token);

            if (decoded.key !== user?.resetCode)
                throw new ForbiddenError('Invalid reset token.');

            if (user?.password)
                user.password = await this.hashPassword(password);
            await user?.save();

            await this.jobs.send('send-reset-confirmation-email', {
                email,
                firstName: user?.firstName,
            });
        } catch (e) {
            this.Logger.error(e);
            throw e;
        }
    }

    public async Verify(token: string): Promise<void> {
        try {
            const decoded = this.verifyResetToken(token);

            const user = await User.findByPk(decoded.id);

            if (decoded.key !== user?.verificationCode)
                throw new ForbiddenError('Invalid verification token.');

            if (user?.emailVerified) user.emailVerified = true;

            await user?.save();
        } catch (e) {
            this.Logger.error(e);
            throw e;
        }
    }

    private async generateToken(
        userID: string,
        loginKey: string,
        type: 'user' | 'employee',
        objectID?: string
    ): Promise<string> {
        const today = new Date();
        const accessExpiration = new Date(today);

        // Set the expiry 90 days from now
        accessExpiration.setTime(
            accessExpiration.getTime() + 90 * 24 * 60 * 60 * 1000
        );

        return jwt.sign(
            {
                id: userID,
                type,
                key: loginKey,
                objectID,
                exp: accessExpiration.getTime() / 1000,
            },
            config.jwt.secret
        );
    }

    private async generateResetToken(
        userID: string,
        resetKey: string
    ): Promise<string> {
        return jwt.sign(
            {
                id: userID,
                key: resetKey,
            },
            config.jwt.secret,
            { expiresIn: '12h' }
        );
    }

    private verifyResetToken(token: string) {
        return jwt.verify(token, config.jwt.secret);
    }

    private async comparePassword(
        password: string,
        hash: string
    ): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
}
