module.exports = {
  async afterUpdate(event) {
    const { result } = event;

    try {
      if (!result.emailed) {
        console.log("News letter has not been emailed. Performing bulk email.");

        const startTime = Date.now();

        const users = await strapi.db
          .query("plugin::users-permissions.user")
          .findMany({
            blocked: false,
          });

        const userEmails = users.map((user) => user.email);

        await strapi.plugins["email"].services.email.send({
          to: userEmails,
          from: "noreply@lonewolf-software.co.za",
          replyTo: "noreply@lonewolf-software.co.za",
          subject: result.Subject,
          html: result.Content,
        });

        await strapi.entityService.update(
          "api::news-letter.news-letter",
          result.id,
          {
            data: {
              emailed: true,
            },
          }
        );

        const endTime = Date.now();

        const timeTaken = endTime - startTime;

        console.log("Bulk email took " + timeTaken + " ms.");
      }
    } catch (error) {
      console.log(error);
    }
  },
};
