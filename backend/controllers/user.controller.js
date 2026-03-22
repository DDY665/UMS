const userService = require("../services/user.service");
const response = require("../utils/response.util");
const { logAction } = require("../utils/audit.util");
const { sendEmployeeCredentials } = require("../utils/mailer.util");
const jwt = require("jsonwebtoken");

const getMyProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    let department = null;
    if (user.department_id) {
      department = await userService.getDepartmentById(user.department_id);
    }

    await logAction(req.user.id, "VIEW_PROFILE", req.user.id);

    return response.success(res, "Profile fetched", {
      ...user,
      department
    });

  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { email, role, departmentId } = req.body;

    const employee = await userService.createEmployee({
      email,
      role,
      departmentId
    });

    await logAction(req.user.id, "CREATE_EMPLOYEE", employee.id);

    const onboardingToken = jwt.sign(
      {
        id: employee.id,
        role: employee.role,
        must_change_password: true
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    sendEmployeeCredentials(
      employee.email,
      employee.tempPassword,
      onboardingToken
    ).catch(err => {
      console.error("Mail failed:", {
        message: err.message,
        code: err.code,
        response: err.response,
        command: err.command
      });
    });

    return response.success(res, "Employee created successfully", {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      department: employee.department,
      must_change_password: employee.must_change_password,
      onboarding_status: employee.onboarding_status
    });

  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    await logAction(req.user.id, "VIEW_ALL_USERS", null);

    return response.success(res, "Users fetched", users);

  } catch (err) {
    next(err);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userService.blockUser(id);

    await logAction(req.user.id, "BLOCK_USER", id);

    return response.success(res, "User blocked");

  } catch (err) {
    next(err);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await userService.unblockUser(id);

    await logAction(req.user.id, "UNBLOCK_USER", id);

    return response.success(res, "User unblocked");

  } catch (err) {
    next(err);
  }
};

const changeMyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    await userService.updateUserEmail(req.user.id, email);

    await logAction(req.user.id, "CHANGE_EMAIL", req.user.id);

    return response.success(res, "Email updated successfully");

  } catch (err) {
    next(err);
  }
};

const changeMyPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const success = await userService.changePassword(
      req.user.id,
      oldPassword,
      newPassword
    );

    if (!success) {
      const error = new Error("Old password is incorrect");
      error.status = 400;
      throw error;
    }

    await logAction(req.user.id, "CHANGE_PASSWORD", req.user.id);

    const newToken = jwt.sign(
      {
        id: req.user.id,
        role: req.user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return response.success(res, "Password changed successfully", {
      onboardingCompleted: true,
      token: newToken
    });

  } catch (err) {
    next(err);
  }
};

const getMyTeam = async (req, res, next) => {
  try {
    const team = await userService.getTeamMembersForUser(req.user.id);

    await logAction(req.user.id, "VIEW_TEAM", null);

    return response.success(res, "Team members fetched", team);

  } catch (err) {
    next(err);
  }
};


module.exports = {
  getMyProfile,
  changeMyEmail,
  changeMyPassword,
  getMyTeam,
  getAllUsers,
  createEmployee,
  blockUser,
  unblockUser
};