import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { Response } from 'express';
import { GuildService } from './guild.service';
import { CreateGuildFormSchema } from 'src/lib/definitions';
import { prisma } from 'src/lib/prisma';

@Controller('guilds')
@UseGuards(AuthGuard)
export class GuildController {
    constructor(private guildService: GuildService) {}

    @Get(":id")
    async getGuild(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("id") id: string) {
        const user = session.user;

        const guild = await this.guildService.get(id, user.id);

        if (!guild) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Guild"
            }
        }
        
        return guild;
    }

    @Get()
    async getAllGuilds(@Session() session: UserSession) {
        const user = session.user;

        const guilds = await prisma.guild.findMany({
            where: {
                members: {
                    some: {
                        userId: user.id
                    }
                }
            }
        })
        
        return guilds;
    }

    @Post()
    async createGuild(@Session() session: UserSession, @Body() body: any, @Res({ passthrough: true }) response: Response) {
        const user = session.user;

        const parse = CreateGuildFormSchema.safeParse(body);
        if (!parse.success) {
            response.status(HttpStatus.BAD_REQUEST);
            return parse.error.message;
        }

        const guild = await prisma.guild.create({
            data: {
                name: parse.data.name,
                ownerId: user.id,
                members: {
                    create: {
                        userId: user.id
                    }
                },
                channels: {
                    create: {
                        name: "General"
                    }
                }
            }
        })

        return guild;
    }

    @Delete(":id")
    @HttpCode(204)
    async deleteGuild(@Session() session: UserSession, @Res({ passthrough: true }) response: Response, @Param("id") id: string) {
        const user = session.user;

        const exists = await this.guildService.existsAsOwner(id, user.id);

        if (!exists) {
            response.status(HttpStatus.NOT_FOUND);
            return {
                message: "Unknown Guild"
            }
        }
        
        await prisma.guild.delete({
            where: {
                id,
                ownerId: user.id
            }
        })

        return;
    }
}
