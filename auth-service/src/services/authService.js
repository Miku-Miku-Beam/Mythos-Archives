import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async ({ email, username, password, role }) => {
  const hashed = await bcrypt.hash(password, 10);

  // Par défaut role = USER
  const finalRole = role ?? "USER";

  return prisma.user.create({
    data: { email, username, password: hashed, role: finalRole },
  });
};

export const login = async (data) => {
  // Protection si req.body est vide
  const { email, password } = data || {};
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: "Invalid credentials" };

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: "Invalid credentials" };

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
};

export const me = async (id) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      reputation: true,
    },
  });
};
