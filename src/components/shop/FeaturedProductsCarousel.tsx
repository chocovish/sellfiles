import * as React from "react";
import { Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Star, Tag, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { getProductsBySlug } from "~/actions/products";
import { FeaturedProductCard } from "./FeaturedProductCard";

type Product = Awaited<ReturnType<typeof getProductsBySlug>>[number];

interface FeaturedProductsCarouselProps {
  products: Product[];
  shopSlug: string;
}

export function FeaturedProductsCarousel({ products, shopSlug }: FeaturedProductsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [autoplayInterval, setAutoplayIntervalState] = useState<NodeJS.Timeout | null>(null);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const startAutoplay = useCallback(() => {
    if (!autoplayActive || !emblaApi) return;
    
    // Clear any existing interval
    if (autoplayInterval) clearInterval(autoplayInterval);
    
    // Set new interval
    const interval = setInterval(() => {
      if (!emblaApi.canScrollNext()) {
        emblaApi.scrollTo(0);
      } else {
        emblaApi.scrollNext();
      }
    }, 5000); // Change slide every 5 seconds
    
    setAutoplayIntervalState(interval);
  }, [autoplayActive, emblaApi, autoplayInterval]);

  // Initialize and cleanup autoplay
  useEffect(() => {
    startAutoplay();
    
    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [emblaApi, startAutoplay, autoplayInterval]);

  // Setup embla events
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Pause autoplay on hover
  const pauseAutoplay = () => {
    setAutoplayActive(false);
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      setAutoplayIntervalState(null);
    }
  };

  // Resume autoplay on mouse leave
  const resumeAutoplay = () => {
    setAutoplayActive(true);
    startAutoplay();
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        Featured Products
      </h2>
      
      <div 
        className="relative rounded-xl overflow-hidden shadow-lg bg-white"
        onMouseEnter={pauseAutoplay}
        onMouseLeave={resumeAutoplay}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex py-6 px-4">
            {products.map((product) => (
              <div key={product.id} className="flex-none mx-4 w-[400px] sm:w-[500px] transition-opacity duration-300">
                <FeaturedProductCard product={product} shopSlug={shopSlug} />
              </div>
            ))}
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10 rounded-full h-10 w-10"
          onClick={scrollPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10 rounded-full h-10 w-10"
          onClick={scrollNext}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
        
        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                selectedIndex === index 
                  ? "bg-purple-600 w-6" 
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}