import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET global settings
router.get('/', async (_req, res) => {
  try {
    let settings = await prisma.storeSettings.findFirst();
    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          storeName: "frosted Creamery",
          themeColor: "#db2777"
        }
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// UPDATE settings
router.post('/', async (req, res) => {
  try {
    const { 
      storeName, logoUrl, themeColor, currency, 
      receiptFont, receiptFontSize, receiptHeader, receiptFooter,
      autoPrint, isKioskMode, isTaxEnabled, taxPercentage 
    } = req.body;

    const settings = await prisma.storeSettings.upsert({
      where: { id: 1 },
      update: {
        storeName, logoUrl, themeColor, currency, 
        receiptFont, receiptFontSize, receiptHeader, receiptFooter,
        autoPrint, isKioskMode, isTaxEnabled, taxPercentage
      },
      create: {
        id: 1,
        storeName, logoUrl, themeColor, currency, 
        receiptFont, receiptFontSize, receiptHeader, receiptFooter,
        autoPrint, isKioskMode, isTaxEnabled, taxPercentage
      }
    });

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
});

export default router;

