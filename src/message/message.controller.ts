import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Response } from 'express';
import { CreateMessageFormSchema } from 'src/lib/definitions';
import { prisma } from 'src/lib/prisma';
import { GuildService } from 'src/guild/guild.service';
import { ChannelService } from 'src/channel/channel.service';
import { MessageService } from './message.service';

@Controller('guilds/:guildId/channels/:channelId/messages')
@UseGuards(AuthGuard)
export class MessageController {
    constructor(
        private messageService: MessageService,
        private channelService: ChannelService,
        private guildService: GuildService
    ) {}

    @Get(":id")
    async getMessage(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("channelId") channelId: string, @Param("id") id: string) {
        const user = session.user;

        const message = await this.messageService.get(id, user.id, channelId);

        if (!message) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Message"
            }
        }
        
        return message;
    }

    @Get()
    async getAllMessages(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("channelId") channelId: string) {
        const user = session.user;

        const exists = await this.channelService.existsAsOwner(channelId, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Channel"
            }
        }

        const messages = await this.messageService.getAll(user.id, channelId);
        
        return messages;
    }

    @Post()
    async createMessage(@Session() session: UserSession, @Body() body: any, @Res({ passthrough: true }) response: Response, @Param("guildId") guildId: string, @Param("channelId") channelId: string) {
        const user = session.user;

        const exists = await this.channelService.existsAsOwner(channelId, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Channel"
            }
        }

        const parse = CreateMessageFormSchema.safeParse(body);
        if (!parse.success) {
            response.status(HttpStatus.BAD_REQUEST);
            return parse.error.message;
        }

        const member = await prisma.member.findFirst({
            where: {
                userId: user.id,
                guildId
            }
        })

        if (!member) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Member"
            }
        }

        const message = await prisma.message.create({
            data: {
                content: parse.data.content,
                authorId: member.id,
                channelId
            }
        })

        return message;
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteChannel(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("channelId") channelId: string, @Param("id") id: string) {
        const user = session.user;

        const exists = await this.messageService.existsAsOwner(id, user.id, channelId);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Message"
            }
        }
        
        await prisma.message.delete({
            where: {
                id,
                channel: {
                    id: channelId,
                    guild: {
                        ownerId: user.id
                    }
                }
            }
        })

        return;
    }
}
