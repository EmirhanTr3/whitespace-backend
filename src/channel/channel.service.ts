import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class ChannelService {
    async get(id: string, userId: string) {
        const channel = await prisma.channel.findUnique({
            where: {
                id,
                guild: {
                    members: {
                        some: {
                            userId
                        }
                    }
                }
            }
        })

        return channel;
    }

    async existsAsOwner(id: string, userId: string) {
        const count = await prisma.channel.count({
            where: {
                id,
                guild: {
                    ownerId: userId
                }
            }
        })
        
        return count > 0;
    }

    async existsAsMember(id: string, userId: string) {
        const count = await prisma.channel.count({
            where: {
                id,
                guild: {
                    members: {
                        some: {
                            userId
                        }
                    }
                }
            }
        })

        return count > 0;
    }
}
