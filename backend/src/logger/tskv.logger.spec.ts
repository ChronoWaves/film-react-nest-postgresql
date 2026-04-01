import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should start with "tskv" prefix', () => {
      const result = logger.formatMessage('log', 'test');

      expect(result.startsWith('tskv\t')).toBe(true);
    });

    it('should use tab as field separator', () => {
      const result = logger.formatMessage('log', 'test');
      const fields = result.split('\t');

      expect(fields.length).toBeGreaterThanOrEqual(4);
    });

    it('should include timestamp field', () => {
      const result = logger.formatMessage('log', 'test');

      expect(result).toContain('timestamp=2026-01-15T12:00:00.000Z');
    });

    it('should include level field', () => {
      const result = logger.formatMessage('error', 'test');

      expect(result).toContain('level=error');
    });

    it('should include message field', () => {
      const result = logger.formatMessage('log', 'hello world');

      expect(result).toContain('message=hello world');
    });

    it('should include context when last param is string', () => {
      const result = logger.formatMessage('log', 'test', 'AppContext');

      expect(result).toContain('context=AppContext');
    });

    it('should not include context field when no optionalParams', () => {
      const result = logger.formatMessage('log', 'test');

      expect(result).not.toContain('context=');
    });

    it('should include optionalParams for non-string params', () => {
      const result = logger.formatMessage(
        'log',
        'test',
        { key: 'value' },
        'Context',
      );

      expect(result).toContain('context=Context');
      expect(result).toContain('optionalParams=');
      expect(result).toContain('"key":"value"');
    });

    it('should not include optionalParams field when only string context', () => {
      const result = logger.formatMessage('log', 'test', 'Context');

      expect(result).not.toContain('optionalParams=');
    });

    it('should produce fields in correct order', () => {
      const result = logger.formatMessage('warn', 'msg');
      const fields = result.split('\t');

      expect(fields[0]).toBe('tskv');
      expect(fields[1]).toMatch(/^timestamp=/);
      expect(fields[2]).toBe('level=warn');
      expect(fields[3]).toBe('message=msg');
    });

    it('should convert non-string message to string', () => {
      const result = logger.formatMessage('log', 12345);

      expect(result).toContain('message=12345');
    });

    it('should handle object message via String()', () => {
      const result = logger.formatMessage('log', { a: 1 });

      expect(result).toContain('message=[object Object]');
    });
  });

  describe('log', () => {
    it('should call console.log with TSKV formatted string', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('test message');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      expect(output).toContain('tskv\t');
      expect(output).toContain('level=log');
      expect(output).toContain('message=test message');
    });

    it('should include context from optionalParams', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('test', 'MyContext');

      const output = spy.mock.calls[0][0];
      expect(output).toContain('context=MyContext');
    });
  });

  describe('error', () => {
    it('should call console.error with level "error"', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('fail');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      expect(output).toContain('level=error');
      expect(output).toContain('message=fail');
    });
  });

  describe('warn', () => {
    it('should call console.warn with level "warn"', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('caution');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      expect(output).toContain('level=warn');
    });
  });

  describe('debug', () => {
    it('should call console.debug with level "debug"', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      logger.debug('debug data');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      expect(output).toContain('level=debug');
    });
  });

  describe('verbose', () => {
    it('should call console.log with level "verbose"', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.verbose('verbose data');

      expect(spy).toHaveBeenCalledTimes(1);
      const output = spy.mock.calls[0][0];
      expect(output).toContain('level=verbose');
    });
  });
});
