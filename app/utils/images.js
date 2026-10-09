// image URLs for paths built at runtime, e.g. imageUrl('/blog/fourier-series/heading.png')
const images = import.meta.glob('../assets/images/{blog,works}/**/*', { eager: true, import: 'default' });

export const imageUrl = (path) => images[`../assets/images${path}`];
