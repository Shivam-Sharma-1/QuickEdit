"use server";

import { prisma } from "../prisma/prisma";

const decreaseCredits = async (amt: number, email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.plan === "FREE") {
    if (user.credits < amt) {
      throw new Error("Operation too expensive, upgrade your plan");
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        credits: {
          decrement: amt,
        },
      },
    });

    return updatedUser;
  }

  return user;
};

export default decreaseCredits;
