import { prisma } from "../lib/prisma.js";

export const trackLinkClick = async (req, res) => {
  try {
    const { linkId } = req.params;
    await prisma.link.update({
      where: { id: linkId },
      data: {
        clickCount: { increment: 1 }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Error tracking click" });
  }
};

export const getAnalyticsDashboard = async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      where: { userId: req.user.userId },
      orderBy: { clickCount: 'desc' },
      select: { id: true, url: true, platform: true, clickCount: true }
    });
    
    const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
    
    res.json({ totalClicks, popularLinks: links });
  } catch (error) {
    res.status(500).json({ error: "Error fetching analytics" });
  }
};
