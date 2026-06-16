import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import * as authService from "../services/auth.service.js";
import { checkAndScheduleDigest } from "../services/digest.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signupController = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
    } = req.body;

    await authService.signup({
        name,
        email,
        password
    });

    res.status(201).json({
        success: true,
        message: "Signup successful! Please check your email to verify your account."
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken, user } = await authService.login({
        email,
        password
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Trigger digest check asynchronously on successful login
    checkAndScheduleDigest(user.id).catch((err) => {
        console.error(`Failed to check/schedule digest for user ${user.id}:`, err);
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        accessToken,
        user,
    });
});

export const refreshController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - No refresh token provided"
        });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid or revoked refresh token"
            });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.status(200).json({
            success: true,
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                preferences: user.preferences,
                memorySummary: user.memorySummary || { coding: 0, deen: 0, admin: 0, life: 0 },
            }
        });
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid refresh token"
        });
    }
});

export const verifyEmailController = asyncHandler(async (req, res) => {
    const { token } = req.query;
    console.log(token)

    const result = await authService.verifyEmail(token);
    const clientUrl = process.env.CLIENT_URL;

    if (result.isAlreadyVerified) {
        return res.redirect(`${clientUrl}/already-verified`);
    }

    return res.redirect(`${clientUrl}/verify-success`);
});

export const resendEmailVerificationController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await authService.resendEmailVerification(email);

    res.status(200).json({
        success: true,
        message: "Verification email resent. Please check your inbox.",
    });
});

export const getUserController = asyncHandler(async (req, res) => {
    const user = await authService.getUser(req.user._id);
    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        user,
    });
});

export const logoutController = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (refreshToken && req.user) {
        const user = await User.findById(req.user._id);
        if (user) {
            user.refreshTokens = user.refreshTokens.filter(rt => rt !== refreshToken);
            await user.save();
        }
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

    res.status(200).json({
        success: true,
        message: "If that email address exists in our database, we will send you a password reset link.",
    });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const token = req.body.token || req.query.token;

    if (!token) {
        return res.status(400).json({
            success: false,
            message: "Password reset token is required"
        });
    }

    await authService.resetPassword(token, newPassword);

    res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
    });
});