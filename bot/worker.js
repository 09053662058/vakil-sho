/**
 * Cloudflare Worker برای ربات تلگرام «وکیل شو»
 * دستورات: /start /help /stats /ping
 *
 * راهاندازی:
 * 1. در Cloudflare Workers یک Worker بساز و همین کد را بچسبان
 * 2. متغیر BOT_TOKEN را در Secrets بگذار
 * 3. وب‌هوک را ست کن:
 *    https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<WORKER_URL>
 */

const BOT_TOKEN = globalThis.BOT_TOKEN || '';

async function tg(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export default {
  async fetch(request, env) {
    const token = env.BOT_TOKEN || BOT_TOKEN;
    if (!token) return new Response('BOT_TOKEN missing', { status: 500 });

    if (request.method === 'GET') {
      return new Response('وکیل شو بات آنلاین است ✅', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    if (request.method !== 'POST') return new Response('OK');

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response('bad json', { status: 400 });
    }

    const msg = update.message || update.edited_message;
    if (!msg || !msg.chat) return new Response('OK');

    const chatId = msg.chat.id;
    const text = (msg.text || '').trim();
    const cmd = text.split(/\s+/)[0].toLowerCase().replace(/@\w+/, '');

    let reply =
      'دستور ناشناخته. /help را بزنید.';

    if (cmd === '/start') {
      reply =
        'سلام 👋\nبه ربات آمار «وکیل شو» خوش آمدید.\n\n' +
        'هر بار که کسی در اپ پرونده‌ای را تمام کند، نتیجه اینجا اعلام می‌شود.\n\n' +
        'دستورات:\n/help\n/stats\n/ping';
    } else if (cmd === '/help') {
      reply =
        '📋 راهنما\n\n' +
        '/start — شروع\n' +
        '/stats — توضیح آمار\n' +
        '/ping — بررسی آنلاین بودن ربات\n\n' +
        'آمار لحظه‌ای هر بازی به‌صورت خودکار از داخل اپ ارسال می‌شود.';
    } else if (cmd === '/stats') {
      reply =
        '📊 آمار\n\n' +
        'آمار تفصیلی هر پرونده (نام، ایمیل، امتیاز، برد/باخت) بلافاصله بعد از اتمام بازی به همین چت ارسال می‌شود.\n\n' +
        'چون داده‌ها روی دستگاه کاربران است، جمع کل سروری فقط از همین پیام‌های خودکار ساخته می‌شود.\n\n' +
        'برای دیدن آمار، پیام‌های همین چت را بالا بکشید.';
    } else if (cmd === '/ping') {
      reply = 'pong ✅ ربات آنلاین است\n' + new Date().toISOString();
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: reply,
      }),
    });

    return new Response('OK');
  },
};
