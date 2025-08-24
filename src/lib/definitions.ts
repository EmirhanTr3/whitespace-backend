import { z } from 'zod';

export const CreateGuildFormSchema = z.object({
    name: z
        .string('Guild name is required.')
        .min(1, 'Guild name cannot be empty.' )
        .max(32, 'Maximum 32 characters.')
        .trim()
})

export const CreateChannelFormSchema = z.object({
    name: z
        .string('Channel name is required.')
        .min(1, 'Channel name cannot be empty.' )
        .max(32, 'Maximum 32 characters.')
        .trim()
})