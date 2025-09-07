import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@logger/logger.service';
import { getTraceContext } from '@common/helpers/trace-context.util';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context_: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context_.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const { method, url, httpVersion, headers, body, query } = request;
    const remoteAddr = request.ip || request.socket.remoteAddress;
    const userAgent = headers['user-agent'] || 'unknown';
    const referrer = headers['referer'] || headers['referrer'] || 'No Referer';
    const startTime = new Date().toISOString();
    const startTimestamp = Date.now();
    const { traceId, spanId } = getTraceContext();
    const contextInfo = `[TraceId=${traceId || 'unknown-trace'} | SpanId=${spanId || 'unknown-span'}]`;

    return next.handle().pipe(
      tap(() => {
        const endTimestamp = Date.now();
        const endTime = new Date().toISOString();
        const responseTime = endTimestamp - startTimestamp;
        const { statusCode } = response;
        const contentLength = response.get('content-length') || 'unknown';

        this.logger.http(
          `HTTP Log ${contextInfo}\n` +
            `Start: ${startTime}, End: ${endTime}, Duration: ${responseTime}ms\n` +
            `Remote: ${remoteAddr}, Method: ${method}, URL: ${url}, HTTP/${httpVersion}\n` +
            `User-Agent: ${userAgent}, Referrer: ${referrer}\n` +
            `Body: ${JSON.stringify(body)}, Query: ${JSON.stringify(query)}\n` +
            `Status: ${statusCode}, Content-Length: ${contentLength}\n`,
          'HTTP'
        );
      })
    );
  }
}
