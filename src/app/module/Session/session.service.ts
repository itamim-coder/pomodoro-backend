import { PrismaClient } from '@prisma/client';
import { assignBadges } from '../../../helpers/assignBadge';

const prisma = new PrismaClient();

const logFocusSession = async (data: {
  userId: string;
  duration: number;
  sessionType: string;
}): Promise<any> => {
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
        console.log(true);
        const updatedStreak = await prisma.streak.update({
          where: { id: userStreak.id },
          data: {
            currentStreak: userStreak.currentStreak + 1,
            longestStreak: Math.max(
              userStreak.longestStreak,
              userStreak.currentStreak + 1
            ),
            lastActiveDate: today,
          },
        });

        // Assign badges if streak reaches milestones
        await assignBadges(userId, updatedStreak.currentStreak);
      } else if (lastActiveDate.toDateString() !== today.toDateString()) {
        // Reset streak
        // Reset streak
        await prisma.streak.update({
          where: { id: userStreak.id },
          data: {
            currentStreak: 1,
            lastActiveDate: today,
          },
        });
      }
    } else {
      // Create a new streak for the user
      console.log('always');
      const newStreak = await prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: today,
        },
      });

      // Assign a badge for starting a streak
      await assignBadges(userId, newStreak.currentStreak);
    }
    return session;
  } catch (error) {
    console.error('Error logging focus session:', error);
    throw new Error('Failed to log focus session.');
  }
};
const getFocusMetrics = async (authUser: any) => {
  try {
    const focusSessions = await prisma.focusSession.findMany({
      where: { userId: authUser?.user.userId },
      orderBy: { timestamp: 'desc' },
    });

    // Daily Metrics
    const today = new Date();
    const dailySessions = focusSessions.filter(
      session =>
        new Date(session.timestamp).toDateString() === today.toDateString()
    );

    const dailyMetrics = {
      totalFocusTime: dailySessions.reduce(
        (sum, session) => sum + session.duration,
        0
      ),
      totalSessions: dailySessions.length,
    };

    // Weekly Metrics
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    const weeklySessions = focusSessions.filter(
      session => new Date(session.timestamp) >= oneWeekAgo
    );

    const weeklyMetrics = {
      totalFocusTime: weeklySessions.reduce(
        (sum, session) => sum + session.duration,
        0
      ),
      totalSessions: weeklySessions.length,
    };

    return { dailyMetrics, weeklyMetrics };
  } catch (error) {
    console.error(error);

    throw new Error('Failed to get metrics.');
  }
};

const getStreaks = async (authUser: any) => {
  try {
    // console.log('service', authUser.user);
    const streak = await prisma.streak.findUnique({
      where: { userId: authUser?.user.userId },
    });

    if (!streak) {
      throw new Error('No Streak Found.');
    }

    return streak;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch streak data.');
  }
};

export const sessionService = {
  logFocusSession,
  getFocusMetrics,
  getStreaks,
};
