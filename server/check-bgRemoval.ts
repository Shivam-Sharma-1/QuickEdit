"use server";

import { prisma } from "../prisma/prisma";

const checkBgRemoval = async () => {
  const imgBgRemoval = await prisma.imgBgRemoval.findFirst();

  if (imgBgRemoval) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (imgBgRemoval.isAvailable && imgBgRemoval.disabledAt === null)
      return true;

    const disabledAtDate = new Date(imgBgRemoval.disabledAt!);
    const disabledMonth = disabledAtDate.getMonth();
    const disabledYear = disabledAtDate.getFullYear();

    if (
      !imgBgRemoval.isAvailable &&
      (currentYear > disabledYear ||
        (currentYear === disabledYear && currentMonth > disabledMonth))
    ) {
      await prisma.imgBgRemoval.update({
        where: { id: imgBgRemoval.id },
        data: { isAvailable: true, disabledAt: null },
      });
      return true;
    }
  }

  throw new Error(
    "Background removal is not available. Please try again later."
  );
};

export default checkBgRemoval;
