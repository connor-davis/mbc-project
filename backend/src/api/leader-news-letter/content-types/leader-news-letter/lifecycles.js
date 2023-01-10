module.exports = {
  async afterUpdate(event) {
    const { result } = event;

    try {
      if (!result.emailed) {
        console.log(
          "Leader news letter has not been emailed. Performing bulk email."
        );

        const startTime = Date.now();

        const users = await strapi.db
          .query("plugin::users-permissions.user")
          .findMany({
            where: {
              blocked: {
                $eq: false,
              },
            },
            populate: { role: true },
          });

        const userEmails = users
          .filter((user) => user.role.name === "Leader")
          .map((user) => user.email);

        await strapi.plugins["email"].services.email.send({
          to: userEmails,
          from: "noreply@lonewolf-software.co.za",
          replyTo: "noreply@lonewolf-software.co.za",
          subject: result.Subject,
          html: result.Content,
        });

        await strapi.entityService.update(
          "api::leader-news-letter.leader-news-letter",
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
