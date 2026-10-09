export type SiteRoute = {
  /** used in test titles and screenshot file names */
  name: string;
  path: string;
  /** the full document title, including the " | Raaed Kabir" suffix from the title template */
  title: string;
  /** the page's main heading */
  heading: string | RegExp;
  /** elements that are drawn after load (charts, sketches) and have to exist before the page counts as ready */
  ready?: string[];
  /** how long to run the frozen clock so entrance animations finish, in ms (default 3000) */
  settleMs?: number;
  /** regions that keep changing even with a frozen clock and seeded randomness, hidden in screenshots */
  mask?: string[];
};

// every page of the site; add new pages here so they get smoke, visual and accessibility tests
export const routes: SiteRoute[] = [
  {
    name: 'home',
    path: '/',
    title: 'Welcome! | Raaed Kabir',
    heading: 'My name is Raaed Kabir.',
    // the hero types out four greetings, which takes about 11 seconds
    settleMs: 15000,
  },
  {
    name: 'about',
    path: '/about',
    title: 'About Me | Raaed Kabir',
    heading: /About Me/,
    ready: ['#chart svg'],
  },
  {
    name: 'works',
    path: '/works',
    title: 'My Works | Raaed Kabir',
    heading: /My Works/,
  },
  {
    name: 'components',
    path: '/works/components',
    title: 'CSS Only Components | Raaed Kabir',
    heading: 'Pure CSS Component Library',
  },
  {
    name: 'resume',
    path: '/resume',
    title: 'Resume | Raaed Kabir',
    heading: /Resume/,
  },
  {
    name: 'blog-fourier-series',
    path: '/blog/fourier-series',
    title: 'Fourier Series Visualization | Raaed Kabir',
    heading: 'Fourier Series Visualization',
    ready: ['.p5Canvas >> nth=3'],
    settleMs: 1000,
    // the four p5 sketches redraw every frame and don't come out identical between runs
    mask: ['.p5Canvas'],
  },
  {
    name: 'blog-video-game-data-exploration',
    path: '/blog/video-game-data-exploration',
    title: 'My Data Exploration Process | Raaed Kabir',
    heading: 'My Data Exploration Process',
    ready: [
      '#visScatter canvas',
      '#visStackedHistogram canvas',
      '#visLineSales canvas',
      '#visLineGenres canvas',
      '#dataVizNA path',
    ],
  },
  {
    name: 'blog-development-process',
    path: '/blog/development-process',
    title: 'My Development Process | Raaed Kabir',
    heading: 'My Development Process',
  },
  {
    name: 'blog-generative-art',
    path: '/blog/generative-art',
    title: 'Generative Art | Raaed Kabir',
    heading: 'Generative Art',
    ready: ['svg circle'],
  },
];
