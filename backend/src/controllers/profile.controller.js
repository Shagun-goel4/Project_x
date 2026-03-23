import { prisma } from "../lib/prisma.js";

export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, bio: true, links: { orderBy: { orderIndex: 'asc' } } }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, avatarUrl, bio } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: { firstName, lastName, avatarUrl, bio },
      select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true, bio: true }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, avatarUrl: true, bio: true, links: { orderBy: { orderIndex: 'asc' } } }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching profile" });
  }
};
