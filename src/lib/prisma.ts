import { PrismaClient } from '@prisma/client'
import { generateSnowflakeId } from 'src/lib/snowflake';

export const prisma = new PrismaClient().$extends({
    name: 'snowflakeId',
    query: {
        $allModels: {
            async create(params) {
                const args = params.args;

                args.data.id = generateSnowflakeId()
                
                for (const data in args.data) {
                    for (const dataField in args.data[data]) {
                        if (dataField == "create") {
                            args.data[data].create.id = generateSnowflakeId()
                        }
                    }
                }

                return params.query(args)
            },
        },
    },
})