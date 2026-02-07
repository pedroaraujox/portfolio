import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ImageUploader from '../ImageUploader';
import { supabase } from '../../../lib/supabase';

// Mock Supabase
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'path/to/image.jpg' }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/image.jpg' } }),
      })),
    },
  },
}));

// Mock Image Compression
vi.mock('../../../lib/imageUtils', () => ({
  compressImage: vi.fn((file) => Promise.resolve(file)),
}));

describe('ImageUploader', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<ImageUploader images={[]} onImagesChange={mockOnChange} />);
    expect(screen.getByText(/Clique para fazer upload/i)).toBeInTheDocument();
  });

  it('handles file selection and upload', async () => {
    render(<ImageUploader images={[]} onImagesChange={mockOnChange} />);
    
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Clique para fazer upload/i, { selector: 'input' }); // Adjust selector if needed
    // Since input is hidden, we select by simple input selector in test
    const fileInput = document.querySelector('input[type="file"]');
    
    if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [file] } });
    }

    await waitFor(() => {
      expect(supabase.storage.from).toHaveBeenCalledWith('portfolio');
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('shows error for invalid file type', async () => {
    render(<ImageUploader images={[]} onImagesChange={mockOnChange} />);
    
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const fileInput = document.querySelector('input[type="file"]');
    
    if (fileInput) {
        fireEvent.change(fileInput, { target: { files: [file] } });
    }

    await waitFor(() => {
      expect(screen.getByText(/Tipo de arquivo inválido/i)).toBeInTheDocument();
    });
  });

  it('displays existing images', () => {
    const images = [{ url: 'https://example.com/img1.jpg', caption: 'Test 1' }];
    render(<ImageUploader images={images} onImagesChange={mockOnChange} />);
    
    expect(screen.getByAltText('Preview 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test 1')).toBeInTheDocument();
  });
});
