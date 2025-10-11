import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer'


@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD
            }
        } as nodemailer.TransportOptions)

    }

    async sendInvite(email, token) {
        const inviteLink = `http://localhost:3000/auth/signup?token=${token}`

        const mail = {
            from: `WORKSPACE ADMIN <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'You have been invited to join workspace',
            html: `
            <a href=${inviteLink}>${inviteLink}</a>
                `
        }
        try {
            return await this.transporter.sendMail(mail)


        } catch (error) {
            throw error
        }
    }


}
