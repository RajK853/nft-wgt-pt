import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import type { EmblaCarouselType as CarouselApi, EmblaOptionsType } from "embla-carousel"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"

export type { CarouselApi }
type CarouselOptions = EmblaOptionsType

export interface CarouselProps
  extends React.ComponentPropsWithoutRef<"div"> {
  opts?: CarouselOptions
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

export interface CarouselContextValue {
  carouselRef: (node: HTMLDivElement | null) => void
  api: CarouselApi | undefined
  orientation: "horizontal" | "vertical"
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollNext: () => void
  scrollPrev: () => void
  scrollTo: (index: number) => void
  selectedIndex: number
  scrollSnaps: number[]
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a Carousel component")
  }
  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  CarouselProps
>(({ children, className, opts, orientation = "horizontal", ...props }, ref) => {
  const [carouselRef, api] = useEmblaCarousel({
    ...opts,
    axis: orientation === "horizontal" ? "x" : "y",
  })
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

  const onSelect = React.useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  const scrollTo = React.useCallback((index: number) => {
    api?.scrollTo(index)
  }, [api])

  React.useEffect(() => {
    if (!api) return

    // Initialize scroll snaps
    setScrollSnaps(api.scrollSnapList())
    onSelect(api)

    api.on("reInit", () => {
      setScrollSnaps(api.scrollSnapList())
      onSelect(api)
    })
    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <CarouselContext.Provider
      value={{
        carouselRef: carouselRef as unknown as (node: HTMLDivElement | null) => void,
        api,
        orientation,
        canScrollPrev,
        canScrollNext,
        scrollNext,
        scrollPrev,
        scrollTo,
        selectedIndex,
        scrollSnaps,
      }}
    >
      <div
        ref={ref}
        className={cn("relative", className)}
        role="region"
        aria-label="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef as unknown as React.RefObject<HTMLDivElement>}
      className="overflow-hidden"
    >
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-label="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-10 w-10 rounded-full transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        "disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        orientation === "horizontal"
          ? "-left-3 sm:-left-12 top-1/2 -translate-y-1/2 z-10"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-10 w-10 rounded-full transition-all duration-200",
        "hover:scale-105 hover:shadow-md",
        "disabled:opacity-30 disabled:hover:scale-100 disabled:hover:shadow-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2",
        orientation === "horizontal"
          ? "-right-3 sm:-right-12 top-1/2 -translate-y-1/2 z-10"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

// New Pagination Dots Component
interface CarouselPaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of visible dots to show before collapsing (default: 5) */
  maxDots?: number
}

const CarouselPagination = React.forwardRef<
  HTMLDivElement,
  CarouselPaginationProps
>(({ className, maxDots = 5, ...props }, ref) => {
  const { selectedIndex, scrollSnaps, scrollTo } = useCarousel()
  const totalSlides = scrollSnaps.length

  // Don't render if there's only 1 slide or no slides
  if (totalSlides <= 1) return null

  // Handle case where there are more dots than maxDots
  const displayDots = totalSlides <= maxDots
    ? scrollSnaps.map((_, i) => i)
    : (() => {
        const half = Math.floor(maxDots / 2)
        const start = Math.max(0, selectedIndex - half)
        const end = Math.min(totalSlides - 1, start + maxDots - 1)
        const adjustedStart = Math.max(0, end - maxDots + 1)
        return Array.from({ length: Math.min(maxDots, totalSlides) }, (_, i) => adjustedStart + i)
      })()

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-1.5 mt-4",
        className
      )}
      role="tablist"
      aria-label="Carousel pagination"
      {...props}
    >
      {displayDots.map((dotIndex) => {
        const isActive = dotIndex === selectedIndex
        return (
          <button
            key={dotIndex}
            role="tab"
            aria-selected={isActive}
            aria-label={`Go to slide ${dotIndex + 1}`}
            onClick={() => scrollTo(dotIndex)}
            className={cn(
              "relative h-2 w-2 rounded-full transition-all duration-200",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          >
            <span className="sr-only">Slide {dotIndex + 1}</span>
          </button>
        )
      })}

      {totalSlides > maxDots && (
        <span className="ml-2 text-xs text-muted-foreground">
          {selectedIndex + 1} / {totalSlides}
        </span>
      )}
    </div>
  )
})
CarouselPagination.displayName = "CarouselPagination"

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselPagination,
}
