const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

router.get("/me", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) return res.json({ success: false, error: "User not found" });

  return res.json({ success: true, user: user });
});

module.exports = router;
