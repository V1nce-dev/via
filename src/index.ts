import Fastify from "fastify";
import formData from "@fastify/formbody";
import userRoute from "./modules/users/userRoute";

const fastify = Fastify({
  logger: {
    level: "info",
  },
});

fastify.register(formData);

fastify.register(userRoute);

const start = async () => {
  try {
    await fastify.listen({ port: 8080 });
    console.log("Running on port 8080");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
