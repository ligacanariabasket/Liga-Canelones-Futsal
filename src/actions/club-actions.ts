
'use server';

import prisma from '../lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const clubSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
  logoUrl: z.string().optional().or(z.literal('')),
  description: z.string().optional(),
  bannerUrl: z.string().optional().or(z.literal('')),
  instagram: z.string().optional().or(z.literal('')),
  facebook: z.string().optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  phone: z.string().optional(),
});

export async function createClub(values: z.infer<typeof clubSchema>) {
    const validatedFields = clubSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Datos inválidos.');
    }

    const { name, slug, logoUrl, description, bannerUrl, instagram, facebook, whatsapp, phone } = validatedFields.data;

    await prisma.team.create({
        data: {
            name,
            slug,
            logoUrl,
            description,
            bannerUrl,
            instagram,
            facebook,
            whatsapp,
            phone,
        },
    });

    revalidatePath('/gestion/clubes');
}

export async function updateClub(id: number, values: z.infer<typeof clubSchema>) {
    const validatedFields = clubSchema.safeParse(values);

    if (!validatedFields.success) {
        throw new Error('Datos inválidos.');
    }
    
    const { name, slug, logoUrl, description, bannerUrl, instagram, facebook, whatsapp, phone } = validatedFields.data;

    await prisma.team.update({
        where: { id },
        data: {
            name,
            slug,
            logoUrl,
            description,
            bannerUrl,
            instagram,
            facebook,
            whatsapp,
            phone,
        },
    });

    revalidatePath('/gestion/clubes');
    revalidatePath(`/clubes/${values.slug}`);
}
