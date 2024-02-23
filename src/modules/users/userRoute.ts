import { FastifyInstance } from "fastify";
import { registerUser, authenticateUser } from "./userController";

const userRoute = async (fastify: FastifyInstance) => {
  try {
    fastify.post(
      "/api/register",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              username: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
            },
          },
        },
      },
      registerUser,
    );

    fastify.post(
      "/api/authenticate",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              email: { type: "string" },
              password: { type: "string" },
            },
          },
        },
      },
      authenticateUser,
    );
  } catch (error) {
    console.error(error);
  }
};

export default userRoute;
