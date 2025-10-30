import User from "../../models/user.js";
import httpStatus from "http-status";

export const getUsers = async (req, res) => {
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



// @desc Get current logged-in user
// @route GET /users/me
// @access Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get all admins
// @route GET /users/admins
// @access Private
export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.json({ admins });
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ message: "Server error" });
  }
};
