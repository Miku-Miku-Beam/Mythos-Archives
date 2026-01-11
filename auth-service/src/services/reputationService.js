import prisma from "../prismaClient.js";

export const updateUserReputation = async (userId, delta) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      reputation: { increment: delta },
    },
  });

  if (user.reputation >= 10 && user.role === "USER") {
    return prisma.user.update({
      where: { id: userId },
      data: { role: "EXPERT" },
    });
  }

  return user;
};
