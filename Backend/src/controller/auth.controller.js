import userModel from "../model/user.model.js"
import jwt from "jsonwebtoken"
import sendEmail from "../services/mail.service.js"

/* Register */
export async function register(req,res) {
    const {username, email, password} = req.body

    const isExistsAlready = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(isExistsAlready){
        return res.status(409).json({
            message: "User already exits with this username or email",
            success: false,
            err: "User already exits"
        })
    }

    const user = await userModel.create({
        username, email, password
    })

    const emailVerfication = jwt.sign({email: user.email},process.env.JWT_SECRET)
    await sendEmail({
        to: email,
        subject: 'Welcome to Perplexity',
        html: `<h2>Hi ${username}, 👋</h2>
            <p>Thank  you for registering with <strong>Perplexity</strong></p>
            <p>We're excited to have you with us and can't wait for you to get started.</p>
            <p>Please verify the email with link given below</p>
            <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerfication}">Verify Email</a>
            <p>Best regards,<br><strong>Team Perplexity</strong></p>`
    })

   return res.status(201).json({
        message : "User registered successfully",
        success:true,
        user: {
            id:user._id,
            username: user.username,
            email: user.email
        }
   })

}
 /* Login */
export async function login(req,res) {
    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(404).json({
            message: "Invalid credentials",
            success:false,
            err: "User not found"
        })
    }

    const isPasswordValid  = await user.comparePassword(password)
    if(!isPasswordValid){
        return res.status(404).json({
           message: "Invalid credentials",
            success:false,
            err: "Invalid password"
        })
    }

    if(!user.verified){
        return res.status(401).json({
            message: "Please Verify email before login",
            err: "Invalid Token"
        })
    }

    const token  = jwt.sign({id: user._id
        ,email: user.email
    },process.env.JWT_SECRET,{expiresIn:'7d'})

    res.cookie("token",token)

    return res.status(200).json({
        message : "User LoggedIn Successfully",
        success: true,
        user:{
            id: user._id,
            user: user.username,
            email: user.email
        }
    })
}

export async function getMe(req,res) {
    const userId = req.user.id

    const user = await userModel.findById(userId).select("-password")

    if(!user){
        return res.status(404).json({
            message: "Invalid Token",
            success: false,
            err: "Token not found"
        })
    }

    return res.status(200).json({
        message:"User fetched Successfully",
        success: true,
        user
    })
}

export async function verifyEmail(req,res) {
    try {
        const token = req.query.token

    const decoded = jwt.verify(token,process.env.JWT_SECRET)

    const user = await userModel.findOne({email:decoded.email})

    if(!user){
        return res.status(401).json({
            message: "Invalid Token",
            success: false,
            err: "User not found"
        })
    }

     user.verified  = true
     await user.save()

     const html = `
     <h1>Email Verified Successfully</h1>
     <p>Your email has been verified successfully. You can login into your account</p>
     <a href="http://localhost:5173/login">Go to Login</a>
     `
    return res.send(html)
    } catch (error) {
        res.status(400).json({
            message:"Invalid or expired Token",
            success: false,
            err: error.message
        })
    }
}