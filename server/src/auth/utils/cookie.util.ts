import { Response } from "express";
import { convertUnitToSeconds } from "src/common/utils/convert.util";

const isProd = process.env.NODE_ENV === "production";

export const setAccessTokenCookie = (res: Response, token: string) => {
    res.cookie("at", token, {
        httpOnly: true,
        secure: isProd,
        maxAge: convertUnitToSeconds(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000, // same as refresh token, so it is not cleared by the browser befire the refresh token
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });

    // reset the cookie in the request object to continue the current session
    res.req.cookies["at"] = token;
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
    res.cookie("rt", token, {
        httpOnly: true,
        secure: isProd,
        maxAge: convertUnitToSeconds(process.env.JWT_REFRESH_EXPIRATION_TIME) * 1000,
        sameSite: isProd ? "none" : "lax",
        path: "/",
    });
};
