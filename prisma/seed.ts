import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

    const user = await prisma.user.create({
        data: {
            name: "Fulano de tal",
            email: "fulano@gmail.com",
            avatarURL: "https://github.com/luh-rocha.png"
        }
    })

    const pool = await prisma.pool.create({
        data:{
            title: 'Examplee pool',
            code: 'BOL123',
            ownerId: user.id,

            participants:{
                create:{
                    userId: user.id
                }
            }
        }
    })

    await prisma.game.create({
        data:{
            date: "2022-11-10T12:41:05.718Z",
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'FR'        
        }
    })

    await prisma.game.create({
        data:{
            date: "2022-11-15T16:41:05.718Z",
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'KR',
            
            guesses:{
                create:{
                    firstTeamPoints: 4,
                    secondTeamPoints: 3,

                    participant:{
                        connect:{
                            userId_poolId:{
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        }
    })
}

main()