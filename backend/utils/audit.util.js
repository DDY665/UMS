const prisma = require("../lib/prisma");

const logAction = async (actorId, action, targetId = null) => {
  try {
    await prisma.auditLog.create({
      data: {
        actor_id: actorId ? Number(actorId) : null,
        target_id: targetId ? Number(targetId) : null,
        action
      }
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }
};

module.exports = {
  logAction
};