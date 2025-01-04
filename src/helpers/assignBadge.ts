import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const assignBadges = async (
  userId: string,
  currentStreak: number
): Promise<void> => {
  const milestoneBadges = [
    { milestone: 1, badgeName: '1-Day Streak' },
    { milestone: 2, badgeName: '2-Day Streak' },
    { milestone: 3, badgeName: '3-Day Streak' },
    { milestone: 5, badgeName: '5-Day Streak' },
    { milestone: 7, badgeName: '7-Day Streak' },
    { milestone: 10, badgeName: '10-Day Streak' },
  ];
  console.log(userId);
  console.log(currentStreak);
  for (const { milestone, badgeName } of milestoneBadges) {
    if (currentStreak === milestone) {
      // Check if the badge already exists
      const existingBadge = await prisma.badge.findFirst({
        where: { userId, badgeName },
      });
      console.log(existingBadge);
      if (!existingBadge) {
        // Assign the badge
        await prisma.badge.create({
          data: {
            userId,
            badgeName,
          },
        });

        console.log(`Badge awarded: ${badgeName}`);
      }
    }
  }
};
