import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database/index";
import { eq } from "drizzle-orm";
import { users } from "../../database/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

interface IBody {
  username: string;
  email: string;
  password: string;
}

const generateToken = async (id: string | null) => {
  try {
    if (id) {
      return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: "30d",
      });
    }
  } catch (error) {
    throw new Error("Invalid user ID fro token generation");
  }
};

const registerUser = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      reply.code(401).send("Please enter all fields");
    }

    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (userExists.length > 0) {
      reply.send(401).send("This user already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const [user] = await db
      .insert(users)
      .values({ username, email, password: hashPassword })
      .returning();

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      created: user.createdAt,
      token: generateToken(user.id),
    };

    if (user) {
      return reply.code(201).send({
        payload,
      });
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send("Internal Server Error");
  }
};

const authenticateUser = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      reply.code(401).send("Please enter all feilds");
    }

    const result = await db.select().from(users).where(eq(users.email, email));
    const user = result[0];

    const hashPassword = await bcrypt.compare(password, user.password);

    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    };

    if (user && hashPassword) {
      reply.code(201).send({
        payload,
      });
    } else {
      reply.code(401).send("Invalid credentials");
    }
  } catch (error) {
    console.error(error);
    reply.code(500).send("Internal Server Error");
  }
};

export { registerUser, authenticateUser };
