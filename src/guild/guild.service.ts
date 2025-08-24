import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class GuildService {
    async get(id: string, userId: string) {
        const guild = await prisma.guild.findUnique({
            where: {
                id,
                members: {
                    some: {
                        userId
                    }
                }
            },
            include: {
                channels: true
            }
        })

        return guild;
    }

    async existsAsOwner(id: string, userId: string) {
        const count = await prisma.guild.count({
            where: {
                id,
                ownerId: userId
            }
        })
        
        return count > 0;
    }

    async existsAsMember(id: string, userId: string) {
        const count = await prisma.guild.count({
            where: {
                id,
                members: {
                    some: {
                        userId
                    }
                }
            }
        })

        return count > 0;
    }
}
