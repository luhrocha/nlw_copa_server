import Fastify from "fastify";
import {PrismaClient } from "@prisma/client"
import cors from '@fastify/cors'
import {z} from 'zod'
import ShortUniqueId from "short-unique-id";

const prisma = new PrismaClient({log: ['query']})

async function bootstrap(){
    const fastify = Fastify({logger: true})    

    fastify.register(cors, {
        origin: true
    })//qualquer origem pode consumir

    fastify.get('/spools/count', async () => {        
    
        const count = await prisma.pool.count()
        return {count}
    })    

    fastify.get('/users/count', async () => {        
    
        const count = await prisma.user.count()
        return {count}
    })

    fastify.get('/guesses/count', async () => {        
    
        const count = await prisma.guess.count()
        return {count}
    })

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

    await fastify.listen({port: 3333, host: '0.0.0.0'})

}

bootstrap()