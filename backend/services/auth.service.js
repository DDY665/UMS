const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");

const MAX_ATTEMPTS = 5;
const LOCK_TIME_MINUTES = 15;



const registerUser = async (email, password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "user",
        must_change_password: false,
        onboarding_status: "ACTIVE",
        failed_attempts: 0,
        lock_until: null
      }
    });

  } catch (err) {
    if (err.code === "P2002") {
      const error = new Error("Email already registered");
      error.status = 409;
      throw error;
    }
    throw err;
  }
};



const loginUser = async (email, password) => {

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error("Account is blocked");
    error.status = 403;
    throw error;
  }

  const now = new Date();


  if (user.lock_until && user.lock_until > now) {
    const error = new Error(
      "Account locked due to multiple failed login attempts. Try again later."
    );
    error.status = 423;
    throw error;
  }

  if (user.lock_until && user.lock_until <= now) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failed_attempts: 0,
        lock_until: null
      }
    });

    user.failed_attempts = 0;
    user.lock_until = null;
  }


  const match = await bcrypt.compare(password, user.password);

  if (!match) {

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        failed_attempts: { increment: 1 }
      }
    });

    const attempts = updated.failed_attempts;

    if (attempts >= MAX_ATTEMPTS) {

      await prisma.user.update({
        where: { id: user.id },
        data: {
          lock_until: new Date(
            Date.now() + LOCK_TIME_MINUTES * 60 * 1000
          )
        }
      });

      const error = new Error(
        "Too many failed attempts. Account locked for 15 minutes."
      );
      error.status = 423;
      throw error;
    }

    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }



  await prisma.user.update({
    where: { id: user.id },
    data: {
      failed_attempts: 0,
      lock_until: null
    }
  });

  if (user.must_change_password) {
    return {
      forcePasswordChange: true,
      id: user.id,
      email: user.email,
      role: user.role
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role
  };
};

module.exports = {
  registerUser,
  loginUser
};