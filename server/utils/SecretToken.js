import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createSecretToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 3 * 24 * 60 * 60,
  });
}
