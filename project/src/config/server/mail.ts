import nodemailer from "nodemailer";
import enviroments from "./environments.config";
import type { MailOptions } from "nodemailer/lib/json-transport";

export const transporter = nodemailer.createTransport({
    host: enviroments().MAIL_HOST,
    port: Number(enviroments().MAIL_PORT),
    secure: true,
    tls: {
        rejectUnauthorized: false,
    },
    auth: {
        user: "notificaciones@cearlatinoamericano.pe",
        pass: "Minimo12**",
    },
});

export function sendEmail(mailOptions: MailOptions) {
    return new Promise((res, rej) => {
        transporter.sendMail(mailOptions, (error, _) => {
            if (error) {
                rej(error);
            }
            res(true);
        });
    });
}
