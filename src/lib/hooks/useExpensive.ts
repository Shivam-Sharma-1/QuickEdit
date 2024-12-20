"use client";

import getUser from "../../../server/get-user";

async function useExpensive(cost: number, email: string) {
  const userData = await getUser(email);

  if (!userData) {
    throw new Error("User not found");
  }

  if ("credits" in userData) {
    return userData?.credits < cost;
  } else {
    throw new Error("Invalid user data");
  }
}

export default useExpensive;
