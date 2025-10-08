import User from "../../models/user.js";
import httpStatus from "http-status";

const getUsers = async (req, res) => {
  try {
    const allRegisteredUsers = await User.find({});
    if (allRegisteredUsers) {
      return res.status(httpStatus.OK).json({
        status: "Success",
        usersDetails: allRegisteredUsers,
      });
    } else {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Not Found",
        message: "No record(s) found!",
      });
    }
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'Error',
        message: err.message
    })
  }
};

export default getUsers;