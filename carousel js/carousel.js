const emblaNode = document.querySelector('.embla')
const options = { loop: false }
const plugins = [EmblaCarouselAutoplay()]
const emblaApi = EmblaCarousel(emblaNode, options, plugins)

