"use server";

import { prisma } from "../prisma/prisma";

const getUser = (email: string) => {
  const user = prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export default getUser;
