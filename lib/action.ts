"use server";

import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";

/* export async function seedData(formData: FormData) {
  try {
    await prisma?.user.createMany({
      data: [
        {
          name: "Gwen Smith",
          email: "gwen@gmail.com",
          password: "1@3",
          habits: {
            historyDwell: 60000,
            transferDwell: 90000,
            dashboardDwell: 90000,
            pinSpeed: 6000
          },
          anomalies: [
            {
              type: "pin-speed"
            }
          ]
        },
        {
          name: "John Doe",
          email: "john@gmail.com",
          password: "!23",
          habits: {
            historyDwell: 60000,
            transferDwell: 90000,
            dashboardDwell: 90000,
            pinSpeed: 6000
          },
          anomalies: [
            {
              type: "pin-speed"
            }
          ]
        }
      ]
    });

    console.log("success");
  } catch (error) {
    console.error(error);
  }
} */

export const loginUser = async (prevState: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  console.log(email);
  console.log(password);

  const data = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (data) {
    console.log(data);

    if (data?.password === password) {
      const cookieStore = await cookies();
      cookieStore.set("email", data.email, { secure: true });
      cookieStore.set("name", data.name ?? "", { secure: true });

      console.log("successful login");
      cookieStore.set("id", data.id, { secure: true });

      return redirect("/dashboard"); // ✅ Return redirect instead of just calling it
    } else {
      return { message: "unsuccess" };
    }
  } else {
    return { message: "not" };
  }
};

export const userData = async (id: string) => {
  const data = await prisma.user.findUnique({
    where: {
      id: id
    }
  });

  return data;
};

export const createUser = async (prevState: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const name = formData.get("name")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  try {
    await prisma?.user.createMany({
      data: [
        {
          name: name,
          email: email,
          password: password,
          habits: {
            historyDwell: 60000,
            transferDwell: 90000,
            dashboardDwell: 90000,
            pinSpeed: 6000
          }
        }
      ]
    });

    console.log("success");
    return { message: "success" };
  } catch (error) {
    console.error(error);
    return { message: "unsuccess" };
  }
};

export const getAllData = async () => {
  const data = await prisma.user.findMany();

  return data;
};

export const loginAdmin = async (prevState: any, formData: FormData) => {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  console.log(email);
  console.log(password);

  if (email == "admin@gmail.com" && password == "123@pass") {
    return redirect("/admin");
  } else {
    return { message: "unsuccess" };
  }
};

export const logoutUser = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("email");
  cookieStore.delete("name");

  cookieStore.delete("id");

  return redirect("/"); // ✅ Return redirect instead of just calling it
};

export const logoutAdmin = async () => {
  const cookieStore = await cookies();

  cookieStore.delete("admin");
  cookieStore.delete("name");

  return redirect("/"); // ✅ Return redirect instead of just calling it
};
