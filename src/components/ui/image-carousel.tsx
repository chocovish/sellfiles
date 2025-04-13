import * as React from "react"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "./button"

type ThumbnailItem = {
  id: string;
  fileUrl: string;
  preview: string;
  isFeatured: boolean;
};

interface ImageCarouselProps {
  images: ThumbnailItem[];
  className?: string;
  showThumbnails?: boolean;
  showControls?: boolean;
  aspectRatio?: 'square' | 'video' | 'auto';
}

export function ImageCarousel({
  images,
  className,
  showThumbnails = false,
  showControls = true,
  aspectRatio = 'square'
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [thumbnailsRef, thumbnailsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: 'aspect-auto'
  }

  const onThumbnailClick = React.useCallback(
    (index: number) => {
      if (!emblaApi || !thumbnailsApi) return
      emblaApi.scrollTo(index)
      setSelectedIndex(index)
    },
    [emblaApi, thumbnailsApi]
  )

  const onSelect = React.useCallback(() => {
    if (!emblaApi || !thumbnailsApi) return
    const currentIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(currentIndex)
    thumbnailsApi.scrollTo(currentIndex)
  }, [emblaApi, thumbnailsApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext()
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }
  }, [emblaApi])

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative">
        <div className="overflow-hidden rounded-lg" ref={emblaRef}>
          <div className="flex">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={cn(
                  "relative flex-[0_0_100%] min-w-0",
                  aspectRatioClasses[aspectRatio]
                )}
              >
                <img
                  src={image.fileUrl || image.preview}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {image.isFeatured && (
                  <div className="absolute top-2 left-2 bg-yellow-400 text-xs text-white px-2 py-1 rounded-full">
                    Featured
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {showControls && images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={scrollPrev}
              disabled={selectedIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
              onClick={scrollNext}
              disabled={selectedIndex === images.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                selectedIndex === index ? "bg-white" : "bg-white/50"
              )}
              onClick={() => onThumbnailClick(index)}
            />
          ))}
        </div>
      </div>

      {showThumbnails && images.length > 1 && (
        <div className="overflow-hidden" ref={thumbnailsRef}>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={image.id}
                className={cn(
                  "relative flex-[0_0_80px] h-20 rounded-md overflow-hidden",
                  selectedIndex === index && "ring-2 ring-primary"
                )}
                onClick={() => onThumbnailClick(index)}
              >
                <img
                  src={image.fileUrl || image.preview}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {image.isFeatured && (
                  <div className="absolute top-1 left-1 bg-yellow-400 w-2 h-2 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 