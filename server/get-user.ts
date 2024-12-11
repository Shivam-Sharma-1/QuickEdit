"use server";

import { prisma } from "../prisma/prisma";

const getUser = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  } catch (error) {
    console.error("Error in fetching user:", error);
    return {
      error: "Error in fetching user: " + String((error as any).message),
    };
  }
};

export default getUser;
