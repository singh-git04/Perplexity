import nodemailer from "nodemailer"

// Only used to build the raw MIME message. Nothing is sent over SMTP.
const composer = nodemailer.createTransport({
    streamTransport: true,
    buffer: true,
    newline: "unix",
})

let cachedToken = null
let tokenExpiresAt = 0

async function getAccessToken() {
    if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken

    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
            grant_type: "refresh_token",
        }),
    })

    const data = await res.json()
    if (!res.ok) {
        throw new Error(`Google token error: ${data.error_description || data.error}`)
    }

    cachedToken = data.access_token
    tokenExpiresAt = Date.now() + data.expires_in * 1000
    return cachedToken
}

async function sendEmail({ to, subject, html, text }) {
    const { message } = await composer.sendMail({
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text,
    })

    const accessToken = await getAccessToken()

    const res = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ raw: message.toString("base64url") }),
        }
    )

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`Gmail API error ${res.status}: ${err}`)
    }

    return res.json()
}

export default sendEmail

// import nodemailer from "nodemailer"

// const transpoter = nodemailer.createTransport({
//     service: "gmail",
//     auth:{
//         type:"OAuth2",
//         user: process.env.GOOGLE_USER,
//         clientId:process.env.GOOGLE_CLIENT_ID,
//         clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//         refreshToken:process.env.GOOGLE_REFRESH_TOKEN
//     }
// })

// transpoter.verify()
// .then(()=>{
//     console.log('Email transpoter is ready to send email')
// })
// .catch((err)=>{
//     console.log('Email transpoter verification failed',err)
// })


// async function sendEmail({to, subject, html, text}){
//     const mailOptions = {
//         from: process.env.GOOGLE_USER,
//         to,
//         subject,
//         html,
//         text
//     }

//     const details = await transpoter.sendMail(mailOptions)
// }

// export default sendEmail