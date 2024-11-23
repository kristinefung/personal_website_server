import { User } from "../schemas/user.schema";

export function genRandomString(length: number): string {
    let str = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        str += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return str;
}

// export function prepareUserResponse(user: User | User[]): User {
//     let str = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     for (let i = 0; i < length; i++) {
//         str += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return str;
// }