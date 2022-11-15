import { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest) {
    return  await request.jwtVerify();
}