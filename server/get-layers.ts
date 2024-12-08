import { auth } from "@/lib/auth";
import { prisma } from "../prisma/prisma";

const getLayers = async () => {
  const session = await auth();

  if (!session) {
    return { error: "Not authenticated" };
  }

  const layers = prisma.layer.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  return { layers };
};

export default getLayers;
