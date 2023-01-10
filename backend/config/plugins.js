module.exports = ({ env }) => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "smtp.mountainbackpackers-club.co.za"),
        port: env("SMTP_PORT", 587),
        secure: true,
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
        logger: true,
      },
      settings: {
        defaultFrom: "no-reply@mountainbackpackers-club.co.za",
        defaultReplyTo: "no-reply@mountainbackpackers-club.co.za",
      },
    },
  },
  ckeditor: {
    enabled: true,
    resolve: "./src/plugins/strapi-plugin-ckeditor",
  },
});
