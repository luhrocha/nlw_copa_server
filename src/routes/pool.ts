import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma"
import {z} from 'zod'
import ShortUniqueId from "short-unique-id";

export async function poolRoutes(fastify: FastifyInstance){
    fastify.get('/spools/count', async () => {        
    
        const count = await prisma.pool.count()
        return {count}
    });
    
    fastify.post('/spools', async (request, reply) => {        
    
        const createPoolBody = z.object({
            title: z.string(),
        })

        const {title} = createPoolBody.parse(request.body);
        const codeGenerate = new ShortUniqueId({length: 6});
        const code = String(codeGenerate()).toUpperCase()
    
        await prisma.pool.create({
            data:{
                title,
                code
            }
        })

        return reply.status(201).send({title, code})
    })
}