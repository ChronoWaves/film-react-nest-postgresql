import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(
    level: string,
    message: unknown,
    ...optionalParams: unknown[]
  ): string {
    const timestamp = new Date().toISOString();
    const parts: string[] = [
      `tskv`,
      `timestamp=${timestamp}`,
      `level=${level}`,
      `message=${String(message)}`,
    ];

    if (optionalParams.length > 0) {
      const context = optionalParams[optionalParams.length - 1];
      if (typeof context === 'string') {
        parts.push(`context=${context}`);
      }

      const filtered = optionalParams.filter(
        (param) => typeof param !== 'string',
      );
      if (filtered.length > 0) {
        parts.push(`optionalParams=${JSON.stringify(filtered)}`);
      }
    }

    return parts.join('\t');
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]): void {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }
}
