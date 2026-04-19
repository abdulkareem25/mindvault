import * as authService from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";

export const signupController = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        defaultCategory,
        aiTone,
    } = req.body;

    const user = await authService.signup({
        name,
        email,
        password,
        defaultCategory,
        aiTone,
    });

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
    });
});

export const loginController = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.login({
        email,
        password
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
    });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
    const { token } = req.query;

    const html = await authService.verifyEmail(token);

    res.send(html);
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
        data: user,
    });
});




// export const updatePreferences = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);

//   user.preferences = {
//     defaultCategory: req.body.defaultCategory,
//     aiTone: req.body.aiTone,
//   };

//   await user.save();

//   res.json({
//     success: true,
//     message: "Preferences updated",
//   });
// });