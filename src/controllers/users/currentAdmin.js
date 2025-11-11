import User from "../../models/user.js";

export const getCurrentAdmin = async (req, res) => {
  try {
    // 🔍 Find an admin who is verified and currently online
    const onlineAdmin = await User.findOne({
      role: "admin",
      isOnline: true,
      isVerified: true,
    });

    // 🧩 If no admin is online, pick the most recently created verified admin
    const fallbackAdmin = await User.findOne({
      role: "admin",
      isVerified: true,
    }).sort({ createdAt: -1 });

    if (!onlineAdmin && !fallbackAdmin) {
      return res.status(200).json({
        status: "Success",
        admin: null,
        message: "No admin found",
      });
    }

    res.status(200).json({
      status: "Success",
      admin: onlineAdmin || fallbackAdmin,
    });
  } catch (error) {
    console.error("❌ Error in getCurrentAdmin:", error.message);
    res.status(500).json({ status: "Error", message: error.message });
  }
};

// export const getCurrentAdmin = async (req, res) => {
//   try {
//     const admins = await User.findOne({ role: "admin", isVerified: true }).sort({ createdAt: 1 });

//     console.log("🧩 All verified admins:", admins);

//     if (!admins || admins.length === 0) {
//       return res.status(200).json({ status: "Success", admin: null });
//     }

//     const onlineAdmin = admins.find((a) => a.isOnline === true);
//     console.log("✅ Online admin found:", onlineAdmin);

//     const fallbackAdmin = admins[admins.length - 1];

//     res.status(200).json({
//       status: "Success",
//       admin: onlineAdmin || fallbackAdmin,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "Error", message: error.message });
//   }
// };

// export const getCurrentAdmin = async (req, res) => {
//   try {
//     const admin = await User.findOne({ role: "admin", isVerified: true, isOnline: true })
//       .sort({ createdAt: -1 });

//     if (!admin) {
//       return res.status(200).json({ status: "Success", admin: null });
//     }

//     res.status(200).json({ status: "Success", admin });
//   } catch (error) {
//     res.status(500).json({ status: "Error", message: error.message });
//   }
// };

// export const getCurrentAdmin = async (req, res) => {
//   try {
//     // ✅ Get all verified admins
//     const admins = await User.find({ role: "admin", isVerified: true }).sort({ createdAt: 1 });

//     if (!admins || admins.length === 0) {
//       return res.status(200).json({ status: "Success", admin: null });
//     }

//     // ✅ Find admin marked as online
//     const onlineAdmin = admins.find((a) => a.isOnline === true);

//     // ✅ Use online admin if found, otherwise fallback to the most recently created admin
//     const fallbackAdmin = admins[admins.length - 1];

//     res.status(200).json({
//       status: "Success",
//       admin: onlineAdmin || fallbackAdmin,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "Error", message: error.message });
//   }
// };


// import User from "../../models/user.js";

// export const getCurrentAdmin = async (req, res) => {
//   try {
//     // Get all admins
//     const admins = await User.findOne({ role: "admin", isVerified: true });

//     // Filter admins who are currently logged in (you can track with a field like `isOnline`)
//     const onlineAdmin = admins.findOne((a) => a.isOnline === true);

//     // If none online, return the latest verified admin
//     const fallbackAdmin = admins[admins.length - 1];

//     res.status(200).json({
//       status: "Success",
//       admin: onlineAdmin || fallbackAdmin || null,
//     });
//   } catch (error) {
//     res.status(500).json({ status: "Error", message: error.message });
//   }
// };
