/* eslint-disable */
import jwt, { TokenExpiredError } from 'jsonwebtoken';
import config from '@config/config';
import { AppError } from '@errors/appError';
import { NextFunction, Request, Response } from 'express';
import { CommonErrors } from '@errors/common';
import { StatusCodes } from 'http-status-codes';

import { ParsedQs } from 'qs';
export interface ParamsDictionary {
    [key: string]: string;
}

export type TokenInfo = {
    token?: string;
    decoded?: any;
    body?: any;
    // files?: Express.Multer.File[];
    // file?: Express.Multer.File;
};
// eslint-disable-next-line
export interface TokenRequest extends Request {
    token?: string;
    decoded?: any;
    query: ParsedQs & TokenInfo;
}

export interface TypedRequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs,
    Locals extends Record<string, any> = Record<string, any>,
> {
    (
        req: TypedRequest<P, ReqQuery, ReqBody>,
        res: Response<ResBody, Locals>,
        next: NextFunction
    ): Promise<void>;
}

export declare type TypedRequest<TParams, TQuery, TBody> = Request<
    TParams,
    any,
    TBody,
    TQuery
> &
    TokenInfo;

type middleware = <TParams = any, TQuery = any, TBody = any>(
    type: string
) => TypedRequestHandler<TParams, any, TBody & TokenInfo, TQuery & TokenInfo>;

const auth: middleware = () => async (req, _res, next) => {
    try {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.cookies['x-access-token'];

        if (!token)
            throw new AppError(
                'Token not provided',
                'Token was not provided',
                403,
                true
            );

        // Verifies secret and checks EXP
        const decoded: any = jwt.verify(token, config.jwt.secret);

        req.token = token; // Set the request variable token
        req.decoded = decoded; // Set the request variale decoded
        return next(); // Go to the next middleware
    } catch (error) {
        let errorInstance = error;
        if (errorInstance instanceof TokenExpiredError)
            errorInstance = new AppError(
                CommonErrors.UNAUTHORIZED,
                'Token invalid.',
                StatusCodes.UNAUTHORIZED
            );
        return next(errorInstance);
    }
};

export const userAuth = auth('user');
