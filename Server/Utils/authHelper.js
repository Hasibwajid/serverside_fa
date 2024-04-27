import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRound = 10;
    hashedPassword = await bcrypt.hash(password, saltRound);
    return await hashedPassword;
  } catch (err) {
    console.log(err);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
