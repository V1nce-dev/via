import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../../database";
import { eq } from "drizzle-orm";

interface IBody {
  content: string;
  image_url: string;
}

const createPost = async (
  request: FastifyRequest<{ Body: IBody }>,
  reply: FastifyReply,
) => {
  try {
    const { content, image_url } = request.body;
  } catch (error) {
    console.error(error);
    reply.code(401).send("Could not create post");
  }
};
