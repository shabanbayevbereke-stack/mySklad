import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class AppMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();
    const startTime = Date.now();

    // Добавляем request ID к запросу для трейсинга
    req['requestId'] = requestId;
    res.setHeader('X-Request-ID', requestId);

    // Стандартные заголовки безопасности
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains',
    );
    res.setHeader('X-Response-Time', new Date().toISOString());

    // Логируем входящий запрос
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';

    this.logger.log(
      `[${requestId}] ${method} ${originalUrl} - ${ip} - ${userAgent}`,
    );

    // Перехватываем завершение ответа для логирования
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;

      if (statusCode >= 400) {
        this.logger.error(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} ${duration}ms - ${contentLength}bytes`,
        );
      } else {
        this.logger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} ${duration}ms - ${contentLength}bytes`,
        );
      }
    });

    next();
  }
}
