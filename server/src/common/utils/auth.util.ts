import * as argon2 from "argon2";

export async function hashPassword(str: string): Promise<string> {
    return (await argon2.hash(str)).replace("$argon2id$v=19$m=65536,t=3,p=4$", "");
}

export async function verifyPassword(hash: string, str: string): Promise<boolean> {
    return await argon2.verify("$argon2id$v=19$m=65536,t=3,p=4$" + hash, str);
}
