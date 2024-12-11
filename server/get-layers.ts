"use server";

import { auth } from "@/lib/auth";
import { prisma } from "../prisma/prisma";

const getLayers = async () => {
  try {
    const session = await auth();

    const layers = await prisma.layer.findMany({
      where: {
        userId: session?.user?.id,
      },
    });

    return { layers };
  } catch (error) {
    console.error("Error in fetching layers:", error);
    return {
      error: "Error in fetching layers: " + String((error as any).message),
    };
  }
};

export default getLayers;
