// client.ts
// src/connection/client.ts

// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// export { prisma }

// At the very top of app-controller.ts, after imports
import { PrismaClient } from '@prisma/client';

// Replace your prisma import with this:
export const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
    ],
});

prisma.$on('query', (e) => {
    console.log('=== PRISMA SQL QUERY ===');
    console.log('Query:', e.query);
    console.log('Params:', e.params);
    console.log('Duration:', e.duration, 'ms');
});
