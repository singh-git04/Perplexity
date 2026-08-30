import jwt from 'jsonwebtoken'


export async function authUser(req, res, next) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            succss: false,
            err: "Token not found"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (error) {
        return res.status(404).json({
            message: "Unauthorized",
            succss: false,
            err: "Invalid Token"
        })
    }

}