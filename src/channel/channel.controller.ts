import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Response } from 'express';
import { ChannelService } from './channel.service';
import { CreateChannelFormSchema } from 'src/lib/definitions';
import { prisma } from 'src/lib/prisma';
import { GuildService } from 'src/guild/guild.service';

@Controller('guilds/:guildId/channels')
@UseGuards(AuthGuard)
export class ChannelController {
    constructor(private channelService: ChannelService, private guildService: GuildService) {}

    @Get(":id")
    async getChannel(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("id") id: string) {
        const user = session.user;

        const channel = await this.channelService.get(id, user.id);

        if (!channel) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Channel"
            }
        }
        
        return channel;
    }

    @Get()
    async getAllChannels(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("guildId") guildId: string) {
        const user = session.user;

        const exists = await this.guildService.existsAsOwner(guildId, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Guild"
            }
        }

        const channels = await prisma.channel.findMany({
            where: {
                guildId,
                guild: {
                    members: {
                        some: {
                            userId: user.id
                        }
                    }
                }
            }
        })
        
        return channels;
    }

    @Post()
    async createChannel(@Session() session: UserSession, @Body() body: any, @Res({ passthrough: true }) response: Response, @Param("guildId") guildId: string) {
        const user = session.user;

        const exists = await this.guildService.existsAsOwner(guildId, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Guild"
            }
        }

        const parse = CreateChannelFormSchema.safeParse(body);
        if (!parse.success) {
            response.status(HttpStatus.BAD_REQUEST);
            return parse.error.message;
        }

        const channel = await prisma.channel.create({
            data: {
                name: parse.data.name,
                guildId
            }
        })

        return channel;
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteGuild(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("guildId") guildId: string, @Param("id") id: string) {
        const user = session.user;

        const exists = await this.channelService.existsAsOwner(id, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Channel"
            }
        }
        
        await prisma.channel.delete({
            where: {
                id,
                guild: {
                    ownerId: user.id
                }
            }
        })

        return;
    }
}
