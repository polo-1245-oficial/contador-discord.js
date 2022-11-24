import { Client, IntentsBitField, ActivityType } from "discord.js";

import fetch from "node-fetch";

const client = new Client({ intents: [IntentsBitField.Flags.Guilds] });
// CONFIG

const config = {
    token: "su token señor",
    canal: "id del canal", //donde se va a enviar el tiempo y esas cosas que se dicen por estas fechas
}

client.login(config.token);

client.on("ready", () => {
    client.user.setPresence({
        activities: [{ name: `Cargando el tiempo y el bot...`, type: ActivityType.Playing }],
        status: "dnd"
    });
    console.log(`Sesión iniciada en ${client.user.tag}!`);
    const channel = client.channels.cache.find(channel => channel.id === config.canal);
    channel.send("Cargando tiempo...");
});


const eventDay = 16706214001

async function getTimeFromAPI() {
    let res
    await fetch('https://worldtimeapi.org/api/timezone/Europe/Madrid')
        .then(res => res.json())
        .then(data => res = data.unixtime)
    return res
}

let dNow
getTimeFromAPI().then(r => dNow = r)

setInterval(() => {

    getTimeFromAPI().then(r => dNow = r)

}, 300000)

setInterval(() => {
    dNow++
    let actual = eventDay - dNow

    const channel = client.channels.cache.find(channel => channel.id === config.canal)
    channel.messages.fetch({ limit: 1 }).then(messages => {
        const lastMessage = messages.first();
        if (lastMessage.content !== `Solo faltan **${Math.floor(actual / 86400)}** días, **${Math.floor(actual / 3600) % 24}** horas, **${Math.floor(actual / 60) % 60}** minutos y **${actual % 60}** segundos`) {
            lastMessage.edit(`Solo faltan **${Math.floor(actual / 86400)}** días, **${Math.floor(actual / 3600) % 24}** horas, **${Math.floor(actual / 60) % 60}** minutos y **${actual % 60}** segundos`)
        }
    })
    
    client.user.setPresence({
        activities: [{ name: `${Math.floor(actual / 86400)}D ${Math.floor(actual / 3600) % 24}H ${Math.floor(actual / 60) % 60}M ${actual % 60}S`, type: ActivityType.Watching }],
        status: 'idle',
    });
}, 1000)
