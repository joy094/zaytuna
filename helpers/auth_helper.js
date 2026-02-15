import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashed_password = await bcrypt.hash(password, saltRounds);
    return hashed_password;
  } catch (error) {console.log(error);
  }
};

export const comparePassword = async (password, hashed_password) => {
  return bcrypt.compare(password, hashed_password);
};
