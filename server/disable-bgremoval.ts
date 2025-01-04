"use server";

import { prisma } from "../prisma/prisma";

const disableBgRemoval = async () => {
  const imgBgRemoval = await prisma.imgBgRemoval.findFirst();

  if (imgBgRemoval) {
    const res = await prisma.imgBgRemoval.update({
      where: { id: imgBgRemoval.id },
      data: { isAvailable: false, disabledAt: new Date() },
    });
  }
  return true;
};

export default disableBgRemoval;
