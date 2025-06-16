// hash and un hash passwords

import bcrypt from 'bcryptjs';

const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

const unHashPassword = async (hashedPassword: string) => {
    const password = await bcrypt.compare(hashedPassword, hashedPassword);
    return password;
};

export { hashPassword, unHashPassword };