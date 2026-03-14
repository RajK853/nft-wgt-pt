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

  const onSelect = React.useCallback((emblaApi: CarouselApi) => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev()
  }, [api])

  const scrollNext = React.useCallback(() => {
    api?.scrollNext()
  }, [api])

  React.useEffect(() => {
    if (!api) return

    onSelect(api)
    api.on("reInit", onSelect)
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
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
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
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
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

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
