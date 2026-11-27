import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: false,

        auth: {user: process.env.EMAIL_USER,pass: process.env.EMAIL_PASS, },

        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
    });
};

const escapeHTML = (value = "") => {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
};

export const sendBorrowEmail = async (borrow) => {

    const transporter = createTransporter();

    const studentName = escapeHTML(borrow.user.name);
    const studentEmail = escapeHTML(borrow.user.email);

    const bookTitle = escapeHTML(borrow.book.title);
    const category = escapeHTML(borrow.book.category);

    const borrowDate = new Date(borrow.borrowDate ).toLocaleDateString();
    const dueDate = new Date(borrow.dueDate).toLocaleDateString();

    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: borrow.user.email,

        subject: "Book Borrowed Successfully!",

        html: `
            <div style="font-family: Arial, sans-serif;max-width: 600px;margin: auto;padding: 25px;border: 1px solid #ddd;border-radius: 10px;">

                <h1 style="color: #2563eb;">Book Borrowed Successfully!</h1>
                <p>Hello ${studentName},</p>
                <p>Your book has been borrowed successfully from our Library Management System. </p>
                <h3>Borrowing Details</h3>

                <table style="width: 100%;border-collapse: collapse; ">

                    <tr>
                        <td style="padding: 10px;"> <strong>Student</strong>   </td>
                        <td style="padding: 10px;"> ${studentName} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px;"> <strong>Email</strong> </td>
                        <td style="padding: 10px;"> ${studentEmail}</td>
                    </tr>

                    <tr>
                        <td style="padding: 10px;"> <strong>Book</strong></td>
                        <td style="padding: 10px;"> ${bookTitle}</td>
                    </tr>

                    <tr>
                        <td style="padding: 10px;"> <strong>Category</strong></td>
                        <td style="padding: 10px;"> ${category}</td>
                    </tr>

                    <tr>
                        <td style="padding: 10px;"> <strong>Borrow Date</strong> </td>
                        <td style="padding: 10px;"> ${borrowDate} </td>
                    </tr>

                    <tr>
                        <td style="padding: 10px;"> <strong>Due Date</strong> </td>
                        <td style="padding: 10px;"> ${dueDate} </td>
                    </tr>

                </table>

                <p style="color: #dc2626;"> Please remember to return your book before the due date. </p>

                <h3 style="color: #2563eb;"> Thank you for using our Library! </h3>

                <p> Best Regards,<br/> Library Management Team </p>

                <hr/>

                <small> This is an automated email. Please do not reply. </small>

            </div>
        `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("================================");
    console.log("Borrow confirmation email sent!");
    console.log("Recipient:", borrow.user.email);
    console.log("Message ID:", info.messageId);
    console.log("================================");

    return info;
};



export const sendResetPasswordEmail = async (user, resetToken) => {
    const transporter = createTransporter();
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = new URL(`/reset-password/${resetToken}`, frontendUrl).toString();
    const studentName = escapeHTML(user.name);
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: "Password Reset Request",

        html: `
            <div style="font-family: Arial, sans-serif;max-width: 600px;margin: auto;padding: 25px;border: 1px solid #ddd; border-radius: 10px;">
                <h1 style="color: #2563eb;"> Password Reset Request </h1>
                <p>Hello ${studentName},</p>

                <p> We received a request to reset your Library Management System password. </p>
                <p> Click the button below to reset your password:</p>

                <a href="${escapeHTML(resetUrl)}" style="display: inline-block; padding: 12px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px;   ">
                    Reset Password
                </a>

                <p>This link will expire in 15 minutes. </p>
                <p>If you did not request a password reset, you can safely ignore this email. </p>
                <p>Best Regards,<br/>  Library Management Team</p>

            </div>
        `
    }

    const info = await transporter.sendMail(mailOptions);

    console.log("================================");
    console.log("Password reset email sent!");
    console.log("Recipient:", user.email);
    console.log("Message ID:", info.messageId);
    console.log("================================");

    return info;
}