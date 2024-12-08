import os from 'os';
import {performance} from 'perf_hooks';
import speed from 'performance-now';
import fetch from 'node-fetch';

const bytesToSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes == 0) return "0 Byte";
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1000))));
    return Math.round(bytes / Math.pow(1000, i)) + " " + sizes[i];
};

function format(seconds: number) {
    function pad(s: number) {
        return (s < 10 ? "0" : "") + s;
    }

    var hours = Math.floor(seconds / (60 * 60));
    var minutes = Math.floor((seconds % (60 * 60)) / 60);
    var seconds = Math.floor(seconds % 60);

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
}

export default async function () {
    let listcpus = os.cpus();
    let totalmem = bytesToSize(os.totalmem());
    let freemem = bytesToSize(os.freemem());
    let uptime = format(process.uptime());
    let hostname = os.hostname();
    let platform = os.platform();
    let old = performance.now();
    let ip_server = await fetch("https://ifconfig.me/ip");
    let neww = performance.now();
    let fetchSpeed = neww - old;
    let speeds = speed();
    return {
        statusCode: 200,
        workerId: process.env.workerId,
        hostname: hostname,
        system_speed: (speeds / 60).toFixed(2) + " ms",
        fetch_speed: (fetchSpeed / 60).toFixed(2) + " ms",
        ip_server: await ip_server.text(),
        free_memory: freemem,
        total_memory: totalmem,
        runtime: uptime,
        platform: platform,
        cpus: [...listcpus],
    };
}
