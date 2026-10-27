import { FileModel } from './file-model';

describe('FileModel', () => {
  it('should initialize', () => {
    const m = new FileModel();
    expect(m.id).toBe('');
    expect(m.path).toBe('');
    expect(m.uploadedBy).toBe('');
    expect(m.uploadDate).toBe('');
  });
});
