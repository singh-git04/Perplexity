import crypto from "crypto"
import userModel from "../model/user.model.js"
import jwt from "jsonwebtoken"
import sendEmail from "../services/mail.service.js"

/* Register */
export async function register(req, res) {
    const { username, email, password } = req.body

    const isExistsAlready = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isExistsAlready) {
        return res.status(409).json({
            message: "User already exits with this username or email",
            success: false,
            err: "User already exits"
        })
    }

    const user = await userModel.create({
        username, email, password
    })

    const emailVerfication = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {expiresIn:'15m'})
    await sendEmail({
        to: email,
        subject: 'Welcome to Perplexity',
        html: `<h2>Hi ${username}, 👋</h2>
            <p>Thank  you for registering with <strong>Perplexity</strong></p>
            <p>We're excited to have you with us and can't wait for you to get started.</p>
            <p>Please verify the email with link given below</p>
            <a href="${process.env.BACKEND_URL}/api/auth/verify-email?token=${emailVerfication}">Verify Email</a>
            <p>Best regards,<br><strong>Team Perplexity</strong></p>`
    })

    return res.status(201).json({
        message: "User registered successfully",
        success: true,
        user: { 
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}
/* Login */
export async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "Invalid email or password",
            success: false,
            err: "User not found"
        })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
        return res.status(404).json({
            message: "Invalid email or password",
            success: false,
            err: "Invalid password"
        })
    }

    if (!user.verified) {
        return res.status(401).json({
            message: "Please Verify email before login",
            err: "Invalid Token"
        })
    }

    const token = jwt.sign({
        id: user._id
        , email: user.email
    }, process.env.JWT_SECRET, { expiresIn: '1d' })

    res.cookie("token", token)

    return res.status(200).json({
        message: "User LoggedIn Successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

export async function getMe(req, res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if (!user) {
        return res.status(404).json({
            message: "Invalid Token",
            success: false,
            err: "Token not found"
        })
    }

    return res.status(200).json({
        message: "User fetched Successfully",
        success: true,
        user
    })
}

export async function verifyEmail(req, res) {
  const frontendURL = process.env.FRONTEND_URL;

  try {
    const token = req.query.token;

    if (!token) {
      return res.redirect(
        `${frontendURL}/verify-email?status=invalid`
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({
      email: decoded.email
    });

    if (!user) {
      return res.redirect(
        `${frontendURL}/verify-email?status=invalid`
      );
    }

    // Check before updating the user
    if (user.verified) {
      return res.redirect(
        `${frontendURL}/verify-email?status=already-verified`
      );
    }

    user.verified = true;
    await user.save();

    return res.redirect(
      `${frontendURL}/verify-email?status=success`
    );
  } catch (error) {
    if (error.name === "TokenExpiredError" ||
        error.name === "JsonWebTokenError") {
      return res.redirect(
        `${frontendURL}/verify-email?status=invalid`
      );
    }

    console.error("Email verification error:", error);

    return res.redirect(
      `${frontendURL}/verify-email?status=error`
    );
  }
}

/* Forgot Password */
export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await userModel.findOne({ email: normalizedEmail });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      user.resetPasswordTokenHash = tokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
      const resetUrl = `${frontendURL}/reset-password?token=${rawToken}`;

      try {
        await sendEmail({
          to: user.email,
          subject: "Reset Your Perplexity Password",
          text: `You requested a password reset. Please use the following link to reset your password within 15 minutes: ${resetUrl}\n\nIf you did not request this, please ignore this email.`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 12px; border: 1px solid #27272a;">
              <h2 style="color: #31b8c6; margin-top: 0;">Password Reset Request</h2>
              <p style="font-size: 15px; color: #d4d4d8;">Hi <strong>${user.username}</strong>,</p>
              <p style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                We received a request to reset the password for your Perplexity account. Click the button below to set a new password. This link is valid for <strong>15 minutes</strong>.
              </p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="${resetUrl}" style="background-color: #31b8c6; color: #09090b; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p style="font-size: 12px; color: #71717a; line-height: 1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <hr style="border: none; border-top: 1px solid #27272a; margin: 24px 0;" />
              <p style="font-size: 12px; color: #52525b;">Best regards,<br><strong style="color: #a1a1aa;">Team Perplexity</strong></p>
            </div>
          `
        });
      } catch (mailError) {
        console.error("Failed to send password reset email:", mailError.message);
        user.resetPasswordTokenHash = null;
        user.resetPasswordExpires = null;
        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, we have sent a password reset link."
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request. Please try again later."
    });
  }
}

/* Reset Password */
export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Password reset link is invalid or has expired."
      });
    }

    // Update password (pre-save hook will hash with bcrypt)
    user.password = password;
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in with your new password."
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting your password. Please try again later."
    });
  }
}