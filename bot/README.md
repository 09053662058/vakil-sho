# ربات تلگرام وکیل شو

## چه چیزی خودکار است؟
از داخل اپ (مرورگر کاربر)، بعد از هر پرونده پیام آمار به چت ادمین ارسال می‌شود.

## دستورات ربات (نیاز به Worker)
فایل `worker.js` را روی Cloudflare Workers دیپلوی کنید تا ربات به دستورات جواب بدهد:

- `/start`
- `/help`
- `/stats`
- `/ping`

### مراحل
1. حساب رایگان [Cloudflare Workers](https://workers.cloudflare.com)
2. Create Worker → کد `worker.js` را جایگزین کن
3. Settings → Variables → Secret به نام `BOT_TOKEN` = توکن ربات
4. Deploy
5. وب‌هوک:
```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<YOUR_WORKER>.workers.dev
```

## چرا سرور لازم است؟
تلگرام برای دریافت دستورات کاربر باید به یک آدرس HTTPS پیام بفرستد. صفحه‌ی HTML به‌تنهایی نمی‌تواند همیشه روشن بماند و webhook بگیرد.
