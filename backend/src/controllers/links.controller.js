import { prisma } from "../lib/prisma.js";

export const getLinks = async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      where: { userId: req.user.userId },
      orderBy: { orderIndex: "asc" }
    });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: "Error fetching links" });
  }
};

export const createLink = async (req, res) => {
  try {
    const { url, platform, orderIndex } = req.body;
    const newLink = await prisma.link.create({
      data: {
        url,
        platform,
        orderIndex,
        userId: req.user.userId
      }
    });
    res.status(201).json(newLink);
  } catch (error) {
    res.status(500).json({ error: "Error creating link" });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, platform } = req.body;
    
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link || link.userId !== req.user.userId) return res.status(403).json({ error: "Unauthorized" });

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { url, platform }
    });
    res.json(updatedLink);
  } catch (error) {
    res.status(500).json({ error: "Error updating link" });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link || link.userId !== req.user.userId) return res.status(403).json({ error: "Unauthorized" });

    await prisma.link.delete({ where: { id } });
    res.json({ message: "Link deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting link" });
  }
};

export const bulkUpdateLinkOrder = async (req, res) => {
  try {
    const links = req.body.updates || req.body.links;
    
    const userLinks = await prisma.link.findMany({ where: { userId: req.user.userId } });
    const userLinkIds = userLinks.map(l => l.id);
    
    if (!links.every(l => userLinkIds.includes(l.id))) {
       return res.status(403).json({ error: "Unauthorized modification of links" });
    }

    const updatePromises = links.map(link => 
      prisma.link.update({
        where: { id: link.id },
        data: { orderIndex: link.orderIndex }
      })
    );
    
    await prisma.$transaction(updatePromises);
    res.json({ message: "Links reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating link orders" });
  }
};
