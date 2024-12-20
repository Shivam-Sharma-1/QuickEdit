"use server";

import { prisma } from "../prisma/prisma";

const getUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export default getUser;
