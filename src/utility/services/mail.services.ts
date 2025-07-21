import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Configure aqui seu serviço SMTP (exemplo Gmail)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, // true para 465, false para outras portas
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    const mailOptions = {
      from: `"Meu Ecommerce-desafio" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await this.transporter.sendMail(mailOptions);
    console.log('Email enviado:', info.messageId);
  }

  async sendConfirmationEmail(to: string, token: string) {
    const url = `${process.env.APP_URL}/api/V1/users/confirm-email?token=${token}`;

    const html = `
      <p>Olá, como vai? Espero que bem!</p>
      <p>Por favor, confirme seu email clicando no link abaixo:</p>
      <a href="${url}">${url}</a>
      <p>Esse link expira em 24 horas.</p>
    `;

    await this.sendMail(to, 'Confirmação de Email - Meu Ecommerce-Desafio', html);
  }
}
