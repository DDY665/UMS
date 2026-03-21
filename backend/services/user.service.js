const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ALLOWED_ROLES = ["admin", "manager", "supervisor", "employee", "user"];

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    select: {
      id: true,
      email: true,
      role: true,
      is_active: true,
      must_change_password: true,
      onboarding_status: true,
      department_id: true,
      created_at: true
    }
  });
};

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      is_active: true,
      onboarding_status: true,
      department_id: true,
      created_at: true
    }
  });
};



const blockUser = async (id) => {
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { is_active: false }
  }).catch(() => null);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};

const unblockUser = async (id) => {
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { is_active: true }
  }).catch(() => null);

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }
};



const updateUserEmail = async (id, email) => {
  try {
    await prisma.user.update({
      where: { id: Number(id) },
      data: { email }
    });

  } catch (err) {
    if (err.code === "P2002") {
      const error = new Error("Email already in use");
      error.status = 409;
      throw error;
    }

    if (err.code === "P2025") {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    throw err;
  }
};



const changePassword = async (userId, oldPassword, newPassword) => {

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) }
  });

  if (!user) return false;

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return false;

  const isSame = await bcrypt.compare(newPassword, user.password);
  if (isSame) {
    const error = new Error("New password must be different from old password");
    error.status = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      must_change_password: false,
      onboarding_status: "ACTIVE"
    }
  });

  return true;
};



const getDepartmentById = async (id) => {
  return await prisma.department.findUnique({
    where: { id: Number(id) }
  });
};



const createEmployee = async ({ email, role, departmentId }) => {

  if (!ALLOWED_ROLES.includes(role)) {
    const error = new Error("Invalid role");
    error.status = 400;
    throw error;
  }

  return await prisma.$transaction(async (tx) => {

    const department = await tx.department.findUnique({
      where: { id: Number(departmentId) }
    });

    if (!department) {
      const error = new Error("Invalid department");
      error.status = 400;
      throw error;
    }

    const tempPassword = crypto.randomBytes(6).toString("hex");
    const hashed = await bcrypt.hash(tempPassword, 10);

    try {
      const employee = await tx.user.create({
        data: {
          email,
          password: hashed,
          role,
          department_id: Number(departmentId),
          must_change_password: true,
          onboarding_status: "PENDING"
        }
      });

      return {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        department: department.name,
        tempPassword,
        must_change_password: true,
        onboarding_status: "PENDING"
      };

    } catch (err) {
      if (err.code === "P2002") {
        const error = new Error("Email already exists");
        error.status = 409;
        throw error;
      }

      throw err;
    }
  });
};



const getTeamMembersForUser = async (userId) => {

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      role: true,
      department_id: true
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  if (!["manager", "supervisor"].includes(user.role)) {
    const error = new Error("Access denied");
    error.status = 403;
    throw error;
  }

  if (!user.department_id) {
    const error = new Error("Department not assigned");
    error.status = 400;
    throw error;
  }

  return await prisma.user.findMany({
    where: {
      department_id: user.department_id
    },
    select: {
      id: true,
      email: true,
      role: true
    }
  });
};

module.exports = {
  getUserById,
  getAllUsers,
  blockUser,
  unblockUser,
  updateUserEmail,
  changePassword,
  createEmployee,
  getTeamMembersForUser,
  getDepartmentById
};