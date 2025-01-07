import { EmbedBuilder, WebhookClient } from "discord.js";

class Webhook {
    private client: WebhookClient;

    constructor(url: string) {
        this.client = new WebhookClient({ url });
    }

    private prepareEmbed(name: string, email: string, message: string): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle('Nouveau message')
            .addFields(
                {
                    name: 'Nom',
                    value: name,
                    inline: true,
                },
                {
                    name: 'Email',
                    value: email,
                    inline: true,
                },
                {
                    name: 'Message',
                    value: message,
                    inline: false,
                }
            )
            .setTimestamp()
            .setAuthor({
                name: 'Portfolio',
                url: 'https://portfolio.bonnell.fr',
            })
            .setColor('Aqua');
    }

    async send(name: string, email: string, message: string) {
        const embed = this.prepareEmbed(name, email, message);
        await this.client.send({ embeds: [embed], username: 'Portfolio' });
    }
}

export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL as string);