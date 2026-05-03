import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signupController = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        confirmPassword,
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

    const { user, token } = await authService.login({
        email,
        password
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        user,
    });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
    const { token } = req.query;

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