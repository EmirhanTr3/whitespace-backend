import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ChannelModule } from 'src/channel/channel.module';
import { GuildModule } from 'src/guild/guild.module';
import { auth } from 'src/lib/auth';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        AuthModule.forRoot(auth),
        UserModule,
        GuildModule,
        ChannelModule,
        MessageModule
    ]
})
export class AppModule {}
