import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should return valid JSON string', () => {
      const result = logger.formatMessage('log', 'test message');
      const parsed = JSON.parse(result);

      expect(parsed).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should include level field', () => {
      const result = JSON.parse(logger.formatMessage('error', 'msg'));

      expect(result.level).toBe('error');
    });

    it('should include message field', () => {
      const result = JSON.parse(logger.formatMessage('log', 'hello world'));

      expect(result.message).toBe('hello world');
    });

    it('should include optionalParams as array', () => {
      const result = JSON.parse(
        logger.formatMessage('log', 'msg', 'param1', 'param2'),
      );

      expect(result.optionalParams).toEqual(['param1', 'param2']);
    });

    it('should handle empty optionalParams', () => {
      const result = JSON.parse(logger.formatMessage('log', 'msg'));

      expect(result.optionalParams).toEqual([]);
    });

    it('should handle object as message', () => {
      const obj = { key: 'value' };
      const result = JSON.parse(logger.formatMessage('log', obj));

      expect(result.message).toEqual({ key: 'value' });
    });

    it('should handle numeric message', () => {
      const result = JSON.parse(logger.formatMessage('log', 42));

      expect(result.message).toBe(42);
    });
  });

  describe('log', () => {
    it('should call console.log with formatted JSON', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('test message');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('log');
      expect(parsed.message).toBe('test message');
    });

    it('should pass optionalParams through', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.log('test', 'AppContext');

      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.optionalParams).toEqual(['AppContext']);
    });
  });

  describe('error', () => {
    it('should call console.error with level "error"', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation();

      logger.error('something failed');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('error');
      expect(parsed.message).toBe('something failed');
    });
  });

  describe('warn', () => {
    it('should call console.warn with level "warn"', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      logger.warn('warning message');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('warn');
      expect(parsed.message).toBe('warning message');
    });
  });

  describe('debug', () => {
    it('should call console.debug with level "debug"', () => {
      const spy = jest.spyOn(console, 'debug').mockImplementation();

      logger.debug('debug info');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('debug');
      expect(parsed.message).toBe('debug info');
    });
  });

  describe('verbose', () => {
    it('should call console.log with level "verbose"', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      logger.verbose('verbose info');

      expect(spy).toHaveBeenCalledTimes(1);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.level).toBe('verbose');
      expect(parsed.message).toBe('verbose info');
    });
  });
});
