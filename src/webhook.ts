import { EmbedBuilder, WebhookClient } from "discord.js";

class Webhook {
    private client: WebhookClient | null;

    constructor(url: string) {
        try {
            this.client = new WebhookClient({ url });
        } catch {
            this.client = null;
        }
    }

    private prepareEmbed(name: string, email: string, message: string): EmbedBuilder {
        if(!name || !email || !message) {
            throw new Error('Missing required fields');
        }
        if(message.length > 1024) {
            message = message.slice(0, 1021) + '...';
        }
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
                url: 'https://nathan.bonnell.fr',
                iconURL: 'https://nathan.bonnell.fr/img/picture/pp.png',
            })
            .setColor('Aqua');
    }

    async send(name: string, email: string, message: string) {
        if (!this.client) {
            return;
        }
        const embed = this.prepareEmbed(name, email, message);
        await this.client.send({ embeds: [embed], username: 'Portfolio' });
    }
}

export const webhook = new Webhook(process.env.DISCORD_WEBHOOK_URL || '');