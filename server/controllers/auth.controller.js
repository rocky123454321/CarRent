
import {User} from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import crypto from "crypto";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import  {
	sendPasswordResetEmail,
	sendResetSuccessEmail,
	sendVerificationEmail,
	sendWelcomeEmail,
}from '../mailtrap/sendVerificationEmail.js';

export const getAdminId = async (req, res) => {
	try {
		const admin =
			(await User.findOne({ role: "admin" }).select("_id name email role")) ||
			(await User.findOne({ role: "renter" }).select("_id name email role"));
		if (!admin) {
			return res.status(404).json({ success: false, message: "Admin user not found" });
		}
		res.status(200).json({ success: true, admin: { _id: admin._id, name: admin.name } });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};
export const signup = async (req, res) => {
	const { email, password, name, role } = req.body;

	try {
		if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

		const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

		const user = new User({
			email,
			password: hashedPassword,
			name,
			role: role || "user",
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save();

		// jwt
		generateTokenAndSetCookie(res, user._id);

	sendVerificationEmail({ email: user.email, verificationToken })

		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    // 1️⃣ Find user with valid token
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // 2️⃣ Mark as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // 3️⃣ Send welcome email with delay + retry
    (async () => {
      try {
        // Delay 1.5s to avoid API hiccups / rate limit
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Attempt to send welcome email
        await sendWelcomeEmail({ email: user.email, name: user.name });
        console.log("Welcome email sent to:", user.email);
      } catch (err) {
        console.error("Failed to send welcome email, retrying...", err);
        // Retry once after another delay
        try {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          await sendWelcomeEmail({ email: user.email, name: user.name });
          console.log("Welcome email sent on retry to:", user.email);
        } catch (err2) {
          console.error("Retry failed for welcome email:", err2);
        }
      }
    })();

    // 4️⃣ Respond immediately without waiting for email
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date();
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate reset token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save();

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// update password
		const hashedPassword = await bcryptjs.hash(password, 10);

		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail({email: user.email});

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};


export const checkAuth = async (req, res) => {
	try {
		const user = await User.findById(req.userId).select("-password");
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.log("Error in checkAuth ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const Delete = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteUser:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const resendVerificationEmail = async (req, res) => {
  try {
    console.log("req.userId:", req.userId);

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.email) {
      return res.status(400).json({ success: false, message: "User email not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email is already verified" });
    }

    // 🔥 ✅ COOLDOWN CHECK (IMPORTANT)
    if (user.resendAvailableAt && user.resendAvailableAt > Date.now()) {
      const secondsLeft = Math.ceil(
        (user.resendAvailableAt - Date.now()) / 1000
      );

      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before resending.`,
      });
    }

    // ✅ generate new code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 🔥 10 mins na lang (better than 24h)
    user.resendAvailableAt = Date.now() + 30 * 1000; // 🔥 30 sec cooldown

    await user.save();

   await sendVerificationEmail({ email: user.email, verificationToken });

    res.status(200).json({
      success: true,
      message: "Verification email resent",
    });

  } catch (error) {
    console.log("Error in resendVerificationEmail:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, message: "Email is already in use" });
      }
      user.email = email;
      // Require re-verification when email changes
      user.isVerified = false;
      user.verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
    }

    if (name) user.name = name;
    if (password) user.password = await bcryptjs.hash(password, 10);

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('_id name email role').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
 