import { Module } from '@nestjs/common';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { ChannelModule } from 'src/channel/channel.module';
import { GuildModule } from 'src/guild/guild.module';
import { auth } from 'src/lib/auth';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        AuthModule.forRoot(auth),
        UserModule,
        GuildModule,
        ChannelModule
    ]
})
export class AppModule {}
