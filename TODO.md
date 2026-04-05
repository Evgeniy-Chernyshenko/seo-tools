# TODO

- Посмотреть как генерируются разные криптографические id: для сессий, для csrf защиты при oAuth и т.д.
- Ошибки на бекенде в удобном для фронта формате, пройтись по всем
- Предотвращение множественных запросов на важные эндпоинты (например аутентификация), попытки на важные действия
- Метаинформация для сессий (ip, userAgent, страна, город)
- Swagger
- Код на 2 блока по 3 цифры в шаблонах писем
- Планировать cron задачи для чистки ненужного

---

Нет rate limiting — критично
Ни один публичный эндпоинт не защищён от brute-force. Это самая серьёзная проблема:

Verification code — 6-значный код (900 000 вариантов). Без rate limiting его можно перебрать за минуты. Атакующий отправляет POST /auth/verify-email с перебором кодов и получает подтверждённый аккаунт.
Login — перебор паролей ничем не ограничен.
forgot-password — можно спамить письмами на чужой email.
Что делать: @nestjs/throttler на уровне приложения + более жёсткий лимит на auth-эндпоинты. Для verification code — ограничить количество попыток (например, 5 попыток, потом код инвалидируется).

---

1.4. Нет @MaxLength() на DTO
auth.dto.ts — поля email, password, code не ограничены по длине. Клиент может послать строку в несколько мегабайт. scrypt на огромном пароле — это CPU-дорогая операция, можно использовать для DoS.

Рекомендация: @MaxLength(255) на email, @MaxLength(128) на password, @Length(6, 6) на code.

---

refresh на каждый запрос — лишняя нагрузка
auth.guard.ts:76 — sessionsService.refresh(session.id) вызывается на каждый аутентифицированный запрос. Это UPDATE в БД на каждый API-вызов.

Лучше: обновлять expiresAt только когда осталось менее половины TTL. Например:

const halfTtl = this.configService.get('SESSION_TTL_MS') / 2;
if (session.expiresAt.getTime() - Date.now() < halfTtl) {
refreshedSession = await this.sessionsService.refresh(session.id);
}
Это стандартный подход "sliding window with lazy refresh".

---

Истёкшие сессии не удаляются
auth.guard.ts:72 — если session.expiresAt < new Date(), гвард просто возвращает return (не аутентифицирует), но не удаляет запись из БД. Со временем таблица Session разрастётся мёртвыми записями.

Решение: cron-задача (например через @nestjs/schedule) для периодической очистки, или удалять при обнаружении:

if (session.expiresAt < new Date()) {
this.sessionsService.deleteById(session.id); // fire-and-forget, не await
return;
}
