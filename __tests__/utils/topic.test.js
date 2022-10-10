import { normalizeTopicName } from '~/utils/topic';

describe('utils/topic', () => {
    describe('normalizeTopicName', () => {
    it('should return string by default', () => {
      expect(normalizeTopicName())
        .toBe('');

      expect(normalizeTopicName(undefined))
        .toBe('');

      expect(normalizeTopicName(null))
        .toBe('');

      expect(normalizeTopicName([]))
        .toBe('');

      expect(normalizeTopicName({}))
        .toBe('');

      expect(normalizeTopicName(0))
        .toBe('');

      expect(normalizeTopicName(() => {}))
        .toBe('');

      expect(normalizeTopicName(new Set()))
        .toBe('');

      expect(normalizeTopicName(''))
        .toBe('');

      expect(normalizeTopicName(' '))
        .toBe('');
    });

    it('should remove whitespaces in either end', () => {
      expect(normalizeTopicName(' test'))
        .toBe('test');

      expect(normalizeTopicName('test '))
        .toBe('test');

      expect(normalizeTopicName(' test '))
        .toBe('test');

      expect(normalizeTopicName('    test  '))
        .toBe('test');
      expect(normalizeTopicName(''))
        .toBe('');

      expect(normalizeTopicName(' '))
        .toBe('');
    });

    it('should remove whitespaces in either end', () => {
      expect(normalizeTopicName(' test'))
        .toBe('test');

      expect(normalizeTopicName('test '))
        .toBe('test');

      expect(normalizeTopicName(' test '))
        .toBe('test');

      expect(normalizeTopicName('    test  '))
        .toBe('test');
    });

    it('should replace inner whitespaces with dash', () => {
      expect(normalizeTopicName(' hello     world'))
        .toBe('hello-world');

      expect(normalizeTopicName('     hello     world    '))
        .toBe('hello-world');

      expect(normalizeTopicName('a     hello     world     test string '))
        .toBe('a-hello-world-test-string');
    });

    it('should keep entered dashes', () => {
      expect(normalizeTopicName(' hello-world'))
        .toBe('hello-world');

      expect(normalizeTopicName(' hello  -   world'))
        .toBe('hello---world');

      expect(normalizeTopicName('-hello-world-'))
        .toBe('-hello-world-');
    });

    it('should transform text to lowercase', () => {
      expect(normalizeTopicName('React'))
        .toBe('react');

      expect(normalizeTopicName(' ReAct    NatiVE   '))
        .toBe('react-native');
    });

    it('should remove emojis', () => {
      expect(normalizeTopicName('😄  hello 👏🏿   world'))
        .toBe('hello-world');

      expect(normalizeTopicName('hello 👏🏿  world 😄 '))
        .toBe('hello-world');

      expect(normalizeTopicName('hello 👨‍👩‍👧‍👧  world'))
        .toBe('hello-world');

      expect(normalizeTopicName('⭐️ hello  👏🏿  world 😄  🤠 🚀'))
        .toBe('hello-world');
    });

    it('should remove accents/diacritics', () => {
      expect(normalizeTopicName('rèact nativé'))
        .toBe('react-native');

      expect(normalizeTopicName('   rèact 🚧 nativé '))
        .toBe('react-native');
    });
  });
});
