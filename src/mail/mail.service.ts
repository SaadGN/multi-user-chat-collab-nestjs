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

    async sendInvite(email:string, token:string) {
        const inviteLink = `${process.env.INVITE_LINK}/auth/signup?token=${token}`

        const mail = {
            from: `WORKSPACE ADMIN <${process.env.MAIL_USER}>`,
            to: email,
            subject: 'You\'ve been invited to join the workspace as member',
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

    async sendWorkspaceInvite(email:string,token:string){

        const url=`${process.env.INVITE_LINK}/workspace/invite?token=${token}`

        const mail = {
            from: `WORKSPACE ADMIN <${process.env.MAIL_USER}>`,
            to: email,
            subject:"Workspace Invitation",
            html: `
            <a href=${url}>${url}</a>
                `
        }
        try {
            return await this.transporter.sendMail(mail)


        } catch (error) {
            throw error
        }
    }


}
