
// import {reject} from "async";

const jwt = require('jsonwebtoken');
const config = require("../config");

export default class Encryption {
    constructor() {

    }

    public static async generateJwtToken(data: any) {
        console.log("before token", data)
        console.log("config.JwtToken.expiresIn",config.JwtToken.expiresIn)
        return await jwt.sign(data, config.JwtToken.secretKey);
    }

    public async verifyJwtToken(token: string | string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(
                token,
                config.JwtToken.secretKey,
                (err: Error, decoded: any) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(decoded);
                    }
                },
            );
        });
    }
}
