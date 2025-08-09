import { UniversalIconConverter } from '../iconConverter';

describe('iconConverter', () => {
  it('should have UniversalIconConverter class', () => {
    expect(typeof UniversalIconConverter).toBe('function');
    expect(UniversalIconConverter.processImage).toBeDefined();
  });

  it('should validate files correctly', () => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    expect(UniversalIconConverter.validateFile(mockFile)).toBe(true);
  });
});