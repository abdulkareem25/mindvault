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

  await authService.verifyEmail(token);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified - MindVault</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 100%;
            animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #4CAF50;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            animation: checkmark 0.8s ease-in-out;
        }
        @keyframes checkmark {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        .checkmark::after {
            content: '✓';
            font-size: 40px;
            color: white;
            font-weight: bold;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="checkmark"></div>
        <h1>Email Verified Successfully!</h1>
        <p>Congratulations! Your email has been verified. You can now access all features of MindVault and start organizing your thoughts with AI-powered assistance.</p>
        <a href="/login" class="btn">Go to Login</a>
        <div class="footer">
            Welcome to MindVault - Your AI-Powered Mind Mapping Companion
        </div>
    </div>
</body>
</html>
  `

  res.send(html);
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