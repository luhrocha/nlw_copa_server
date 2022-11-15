import { FastifyInstance } from "fastify";
import { number, string, z } from "zod";
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate";

export async function guessRoutes(fastify: FastifyInstance){
    fastify.get('/guesses/count', async () => {        
    
        const count = await prisma.guess.count()
        return {count}
    });

    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [authenticate]
    },async (request, reply) => {
        const createGuessesParams = z.object({
            poolId: string(),
            gameId: string()
        });

        const {poolId, gameId} = createGuessesParams.parse(request.params)

        const createGuessesBody = z.object({
            firstTeamPoints: number(),
            secondTeamPoints: number()
        })

        const {firstTeamPoints,secondTeamPoints } = createGuessesBody.parse(request.body);

        const participant = await prisma.participant.findUnique({
            where:{
                userId_poolId:{
                    userId: request.user.sub,
                    poolId
                }
            }
        })

        if(!participant){
            return reply.status(400).send({
                message: "You're not allowed to create a guess inside this pool"
            })
        }

        const guess = await prisma.guess.findUnique({
            where:{
                participantId_gameId:{
                    participantId: participant.id,
                    gameId
                }
            }
        });

        if(guess){
            return reply.status(400).send({
                message: "You already sent a guess to this game on this pool"
            })
        }

        const game = await prisma.game.findUnique({
            where:{
                id: gameId
            }
        })

        if(!game){
            return reply.status(400).send({
                message: "Game not found"
            })
        }

        if(game.date < new Date()){
            return reply.status(400).send({
                message: "You cannot send guesses after the game date"
            })
        }

        await prisma.guess.create({
            data:{
                gameId,
                firstTeamPoints,
                secondTeamPoints,
                participantId: participant.id
            }
        })


        return reply.status(201).send()
    })
}