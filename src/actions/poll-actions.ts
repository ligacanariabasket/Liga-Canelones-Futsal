
'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PollType } from '@prisma/client';

// Zod schema for creating a poll
const createPollSchema = z.object({
  question: z.string().min(1, 'La pregunta no puede estar vacía.'),
  type: z.nativeEnum(PollType),
  matchId: z.string().optional(),
  options: z.array(z.object({
    text: z.string().min(1, 'El texto de la opción no puede estar vacío.'),
    playerId: z.number().optional(),
  })).min(2, 'La encuesta debe tener al menos dos opciones.'),
});

// Zod schema for casting a vote
const castVoteSchema = z.object({
  pollId: z.number(),
  pollOptionId: z.number(),
  userId: z.string().min(1),
});

export async function createPoll(formData: unknown) {
  const validatedFields = createPollSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. Por favor, corrige los campos.',
    };
  }

  const { question, type, matchId, options } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const poll = await tx.poll.create({
        data: {
          question,
          type,
          matchId: matchId ? parseInt(matchId, 10) : undefined,
          expiresAt: undefined, // expiresAt is optional
        },
      });

      await tx.pollOption.createMany({
        data: options.map((option) => ({
          text: option.text,
          playerId: option.playerId,
          pollId: poll.id,
        })),
      });
    });

    if (matchId) {
      revalidatePath(`/partidos/${matchId}`);
    }
    revalidatePath('/gestion/encuestas');
    revalidatePath('/hinchada');

    return { message: 'Encuesta creada exitosamente.' };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { message: 'Error en la base de datos: No se pudo crear la encuesta.' };
  }
}

export async function getPollByMatch(matchId: number) {
  try {
    const poll = await prisma.poll.findFirst({
      where: { matchId },
      include: {
        options: {
          include: {
            player: {
              select: {
                name: true,
                team: {
                  select: {
                    logoUrl: true,
                    name: true,
                  }
                }
              }
            },
            _count: {
              select: { votes: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return poll;
  } catch (error) {
    console.error('Error fetching poll by match:', error);
    return null;
  }
}

export async function getAllPolls() {
  try {
    const polls = await prisma.poll.findMany({
      include: {
        options: {
          include: {
            player: {
              select: {
                id: true,
                name: true,
                number: true,
                position: true,
                birthDate: true,
                height: true,
                weight: true,
                nationality: true,
                teamId: true,
                createdAt: true,
                updatedAt: true,
                team: {
                  select: {
                    logoUrl: true,
                    name: true,
                  }
                }
              }
            },
            _count: {
              select: { votes: true },
            },
          },
        },
        match: {
          select: {
            teamA: { select: { name: true } },
            teamB: { select: { name: true } },
          }
        },
        _count: {
          select: { votes: true },
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return polls;
  } catch (error) {
    console.error('Error fetching all polls:', error);
    return [];
  }
}

export async function castVote(formData: unknown) {
  const validatedFields = castVoteSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación.',
    };
  }

  const { pollId, pollOptionId, userId } = validatedFields.data;

  try {
    const existingVote = await prisma.vote.findUnique({
      where: {
        pollId_userId: {
          pollId,
          userId,
        },
      },
    });

    if (existingVote) {
      return { message: 'Ya has votado en esta encuesta.' };
    }

    await prisma.vote.create({
      data: {
        pollId,
        pollOptionId,
        userId,
      },
    });

    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (poll?.matchId) {
      revalidatePath(`/partidos/${poll.matchId}`);
    }
    revalidatePath('/hinchada');


    return { message: 'Voto registrado exitosamente.' };
  } catch (error) {
    console.error('Error casting vote:', error);
    return { message: 'Error en la base de datos: No se pudo registrar el voto.' };
  }
}
