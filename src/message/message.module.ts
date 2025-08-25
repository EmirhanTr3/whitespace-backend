import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { GuildService } from 'src/guild/guild.service';
import { ChannelService } from 'src/channel/channel.service';

@Module({
    controllers: [MessageController],
    providers: [MessageService, ChannelService, GuildService]
})
export class MessageModule {}
