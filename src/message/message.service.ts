import { Injectable } from '@nestjs/common';
import { prisma } from 'src/lib/prisma';

@Injectable()
export class MessageService {
    async get(id: string, userId: string, channelId: string) {
        const message = await prisma.message.findUnique({
            where: {
                id,
                channel: {
                    id: channelId,
                    guild: {
                        members: {
                            some: {
                                userId
                            }
                        }
                    }
                }
            },
            include: {
                author: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return message;
    }

    async getAll(userId: string, channelId: string) {
        const messages = await prisma.message.findMany({
            where: {
                channel: {
                    id: channelId,
                    guild: {
                        members: {
                            some: {
                                userId
                            }
                        }
                    }
                }
            },
            include: {
                author: {
                    include: {
                        user: true
                    }
                }
            }
        })

        return messages;
    }

    async existsAsOwner(id: string, userId: string, channelId: string) {
        const count = await prisma.message.count({
            where: {
                id,
                channel: {
                    id: channelId,
                    guild: {
                        ownerId: userId
                    }
                }
            }
        })
        
        return count > 0;
    }

    async existsAsMember(id: string, userId: string, channelId: string) {
        const count = await prisma.message.count({
            where: {
                id,
                channel: {
                    id: channelId,
                    guild: {
                        members: {
                            some: {
                                userId
                            }
                        }
                    }
                }
            }
        })

        return count > 0;
    }
}
