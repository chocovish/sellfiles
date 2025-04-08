import { Link } from '@tanstack/react-router';
import { BrandLogo } from './brand-logo';

export function BrandHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 p-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-block group">
          <BrandLogo variant="light" size="lg" />
        </Link>
      </div>
    </header>
  );
} 