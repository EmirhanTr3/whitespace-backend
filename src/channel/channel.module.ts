import { Module } from '@nestjs/common';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';
import { GuildService } from 'src/guild/guild.service';

@Module({
    controllers: [ChannelController],
    providers: [ChannelService, GuildService]
})
export class ChannelModule {}
