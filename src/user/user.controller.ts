import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    @Get('@me')
    getCurrentUser(@Session() session: UserSession) {
        return { session: session.session, user: session.user }
    }
}
