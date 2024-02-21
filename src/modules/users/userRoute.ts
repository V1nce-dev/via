import { FastifyInstance } from "fastify";
import { registerUser } from "./userController";

const userRoute = async (fastify: FastifyInstance) => {
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
};

export default userRoute;
