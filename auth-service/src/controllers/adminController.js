import prisma from "../prismaClient.js";

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        reputation: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res
      .status(err?.status || 500)
      .json({ error: err?.message || "Internal server error" });
  }
};

// PATCH /users/:id/role
export const changeUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { role } = req.body;

    if (!["USER", "EXPERT", "ADMIN"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, username: true, role: true },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res
      .status(err?.status || 500)
      .json({ error: err?.message || "Internal server error" });
  }
};
