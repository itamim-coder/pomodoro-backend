import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const logFocusSession = async (data: { userId: string; duration: number; sessionType: string }): Promise<any> => {
  const { userId, duration, sessionType } = data;

  try {
    // Log the focus session
    const session = await prisma.focusSession.create({
      data: {
        userId,
        duration,
        sessionType,
      },
    });

    // Fetch the user's streak
    const userStreak = await prisma.streak.findFirst({
      where: { userId },
    });

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (userStreak) {
      const lastActiveDate = new Date(userStreak.lastActiveDate);

      if (lastActiveDate.toDateString() === yesterday.toDateString()) {
        // Continue streak
        await prisma.streak.update({
          where: { id: userStreak.id }, // Use the streak ID for an exact match
          data: {
            currentStreak: userStreak.currentStreak + 1,
            longestStreak: Math.max(userStreak.longestStreak, userStreak.currentStreak + 1),
            lastActiveDate: today,
          },
        });
      } else if (lastActiveDate.toDateString() !== today.toDateString()) {
        // Reset streak
        await prisma.streak.update({
          where: { id: userStreak.id }, // Use the streak ID for an exact match
          data: {
            currentStreak: 1,
            lastActiveDate: today,
          },
        });
      }
    } else {
      // Create a new streak for the user
      await prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
        },
      });
    }

    return session;
  } catch (error) {
    console.error("Error logging focus session:", error);
    throw new Error("Failed to log focus session.");
  }
};

export const sessionService = {
  logFocusSession,
};
