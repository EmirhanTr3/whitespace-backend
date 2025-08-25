import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { Rank } from "@prisma/client";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { LoginFormSchema, RegisterFormSchema } from "src/lib/definitions";
 
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        database: {
            generateId: false
        },
        ipAddress: {
			ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
			disableIpTracking: false
		}
    },

    hooks: {
        /* @ts-expect-error ts being dumb */
        before: createAuthMiddleware(ctx => {
            if (ctx.path == "/sign-up/email") {
                const parse = RegisterFormSchema.safeParse(ctx.body);
                if (!parse.success) {
                    throw new APIError("BAD_REQUEST", JSON.parse(parse.error.message) as object);
                }
            } else if (ctx.path == "/sign-in/email") {
                const parse = LoginFormSchema.safeParse(ctx.body);
                if (!parse.success) {
                    throw new APIError("BAD_REQUEST", JSON.parse(parse.error.message) as object);
                }
            }
            return;
        })
    },

    user: {
        additionalFields: {
            displayname: {
                type: "string",
                required: true
            },
            rank: {
                type: "string",
                required: true,
                defaultValue: Rank.USER
            },
            badges: {
                type: "string[]",
                required: true,
                defaultValue: []
            },
            avatar: {
                type: "string",
                required: false
            }
        },
    }
})