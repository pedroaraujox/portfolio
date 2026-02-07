import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ImageCarousel from '../ImageCarousel';

describe('ImageCarousel', () => {
  const images = [
    { url: 'https://example.com/img1.jpg', caption: 'Caption 1' },
    { url: 'https://example.com/img2.jpg', caption: 'Caption 2' },
  ];

  it('renders nothing if no images', () => {
    const { container } = render(<ImageCarousel images={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders first image and caption', () => {
    render(<ImageCarousel images={images} />);
    expect(screen.getByAltText('Caption 1')).toBeInTheDocument();
    expect(screen.getByText('Caption 1')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('navigates to next image', () => {
    render(<ImageCarousel images={images} />);
    
    // Find next button (ChevronRight)
    // Since we use lucide-react, we can look for button
    const buttons = screen.getAllByRole('button');
    // Assuming 2nd button is next (1st is prev - wait, prev/next only show if multiple)
    // Actually prev is left, next is right.
    // Let's use simpler query if possible or aria-labels if I added them (I didn't).
    // I'll update component to have aria-labels or just assume buttons order.
    
    // In the code: Prev is first, Next is second.
    const nextBtn = buttons[1]; 
    fireEvent.click(nextBtn);

    expect(screen.getByAltText('Caption 2')).toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
  });

  it('navigates to previous image (circular)', () => {
    render(<ImageCarousel images={images} />);
    
    const prevBtn = screen.getAllByRole('button')[0];
    fireEvent.click(prevBtn); // 0 -> 1 (circular)

    expect(screen.getByAltText('Caption 2')).toBeInTheDocument();
  });

  it('opens lightbox on click', () => {
    render(<ImageCarousel images={images} />);
    
    const img = screen.getByAltText('Caption 1');
    fireEvent.click(img);

    // Lightbox should appear (check for close button or lightbox specific class/element)
    // The lightbox has a close button (X)
    expect(screen.getAllByRole('button').length).toBeGreaterThan(2); // Prev, Next, Close
  });
});
