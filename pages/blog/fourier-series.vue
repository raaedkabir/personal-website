<template>
  <Layout img="/fourier-series/heading.png" title="Fourier Series Visualization" date="February 2020">
    <div slot="content">
      <blockquote>
        <p>
          Many thanks to 3Blue1Brown for teaching me what is a
          <AppLink href="https://www.youtube.com/watch?v=r6sGWTCMz2k" target="_blank" rel="noopener noreferrer"
            >Fourier Series</AppLink
          >
          and to
          <AppLink href="https://www.instagram.com/graheeth_hazare/" target="_blank" rel="noopener noreferrer"
            >Graheeth</AppLink
          >
          for giving me the idea to make this.
        </p>
      </blockquote>
      <h2 class="heading__section">What is a Fourier Series?</h2>
      <p>
        Fourier series are a way of representing periodic functions as a sum of sine waves. The more complex the
        function, the greater number of sine waves are needed to get that output. For functions that are not periodic,
        the Fourier series is replaced by the Fourier transform, which swaps between time- and frequency-domain. Jez
        Swanson has a great
        <AppLink href="http://www.jezzamon.com/fourier/index.html" target="_blank" rel="noopener noreferrer"
          >Interactive Introduction</AppLink
        >
        to Fourier transforms.
      </p>
      <p>
        Below we have a Fourier series for a
        <AppLink href="https://en.wikipedia.org/wiki/Fourier_series" target="_blank" rel="noopener noreferrer"
          >square wave</AppLink
        >, and if you pull the slider more to the right you can see that the graph looks closer and closer to a square
        wave as more sine waves are added.
      </p>
      <div ref="squareWave" />
      <p>
        My end goal with this Fourier series experiment is to create a whacky way to draw text. When I think of math and
        visual stuff on the web in the same sphere the first thing that comes to mind are SVGs. So my idea is to write
        text, convert that into an SVG and get the xy-coordinates of that SVG to feed into a function to finally get out
        a visualization. But first, we're no longer dealing with periodic functions so we'll need the Fourier transform.
      </p>
      <p>
        On Wikipedia under the
        <AppLink
          href="https://en.wikipedia.org/wiki/Discrete_Fourier_transform"
          target="_blank"
          rel="noopener noreferrer"
          >Discrete Fourier transform</AppLink
        >
        page we can use the following formula:
      </p>
      <img
        src="../../assets/images/blog/fourier-series/discrete-fourier-transform-equation.png"
        alt="Discrete Fourier transform formula"
      />
      <p>The real value is our x-axis and the imaginary value is the y-axis.</p>
      <p>The important variables are:</p>
      <ul class="mt-0">
        <li class="mt-0">x<sub>n</sub> for the input</li>
        <li class="mt-0">X<sub>k</sub> for the transform output</li>
      </ul>
      <p>Applying the Fourier transform for the values 0 to 2π we should get a circle.</p>
      <div ref="circle" />
      <p>
        Next up is to get the raw coordinate values for the characters we want to display. Using
        <AppLink href="https://github.com/opentypejs/opentype.js" target="_blank" rel="noopener noreferrer"
          >opentype.js</AppLink
        >
        we can parse font and get out the SVG path of a provided text. The font I'm using here is Roboto Black. Then by
        running
        <AppPrism lang="javascript">path.getTotalLength()</AppPrism> to get the total length of the path and then
        running <AppPrism lang="javascript">path.getPointAtLength(x)</AppPrism> we can get the position of the points in
        the xy-coordinate plane to feed into the Fourier transform function. Let's try writing the classic 'Hello
        World!'.
      </p>
      <div ref="textOneLine" />
      <p>
        Great, it works! But while it does work it is drawing the 'signal' as one straight line so let's break up each
        character into their own signal to make it look better.
      </p>
      <div ref="textMultiLine" />
      <p>Try typing in the field below and watch the Fourier series do its magic!</p>
      <input v-model="text" :maxlength="12" type="text" @keydown.enter="drawText" />
      <AppButton flat @click="drawText">Draw!</AppButton>
    </div>
  </Layout>
</template>

<script>
import Layout from '~/layout/blog.vue';
const opentype = require('opentype.js');

/**
 * @callback P5Instance
 * @param {import('../../node_modules/@types/p5')} s - p5.js instance
 * @returns {void}
 */

export default {
  layout: 'empty',

  components: {
    Layout,
  },

  data() {
    return {
      value: 5,
      text: 'Hello World!',
      textCanvas: null,
    };
  },

  async mounted() {
    this.squareWave();

    this.fourierCircle();

    const textPath = await this.textToSVG();
    this.fourierTextOneLine(textPath);

    this.fourierTextMultiLine(textPath);
  },

  methods: {
    async drawText() {
      const textPath = await this.textToSVG();
      this.fourierTextMultiLine(textPath);
    },
    // Discrete Fourier Transform
    dft(x) {
      // formula from:
      // https://en.wikipedia.org/wiki/Discrete_Fourier_transform

      const X = [];
      const N = x.length;

      for (let k = 0; k < N; k++) {
        let re = 0;
        let im = 0;

        for (let n = 0; n < N; n++) {
          const theta = (2 * Math.PI * k * n) / N;
          re += x[n] * Math.cos(theta);
          im -= x[n] * Math.sin(theta);
        }

        re = re / N;
        im = im / N;

        // rotations per unit of time
        const freq = k;
        // radius length
        const amp = Math.sqrt(re * re + im * im);
        // angle offset
        const phase = Math.atan2(im, re);

        X[k] = {
          re,
          im,
          freq,
          amp,
          phase,
        };
      }

      return X;
    },

    epicycle(x, y, rotation, fourier, s, time, path) {
      for (let i = 0; i < fourier.length; i++) {
        const prevX = x;
        const prevY = y;

        const { freq, amp: radius, phase } = fourier[i];

        x += radius * s.cos(freq * time + phase + rotation);
        y += radius * s.sin(freq * time + phase + rotation);
        if (path.length > 1000) path.pop();

        // draw circle
        s.stroke(255);
        s.noFill();
        s.ellipse(prevX, prevY, radius * 2);

        // draw arrow
        s.fill(255);
        s.line(prevX, prevY, x, y);
        s.stroke('#66fcf1');
        s.fill('#66fcf1');
        s.ellipse(x, y, 6);
      }

      return s.createVector(x, y);
    },

    async textToSVG() {
      // load a font asynchronously
      const font = await opentype.load('/fonts/Roboto-Black.ttf');
      const path = font.getPath(this.text, 0, 0, 20).toPathData();

      return path;
    },

    async squareWave() {
      const { default: P5 } = await import('p5');

      /** @type {P5Instance}  */
      const sketchSquareWave = (s) => {
        let time = 0;
        const wave = [];
        let slider = null;
        let sliderTooltip = null;
        let sliderWrap = null;
        let img = null;

        s.preload = () => {
          img = s.loadImage(require('../../assets/images/blog/fourier-series/square-wave-equation.png'));
        };

        s.setup = () => {
          s.createCanvas(800, 250);
          sliderWrap = s.createDiv();
          sliderWrap.style('position', 'relative');

          sliderTooltip = s.createDiv();
          sliderTooltip.style('display', 'none');
          sliderTooltip.addClass('slider-value');
          sliderWrap.child(sliderTooltip);

          slider = s.createSlider(1, 50, 4);
          sliderWrap.child(slider);
          slider.style('width', '100%');
          slider.input(() => {
            const min = slider.attribute('min');
            const val = slider.value();
            const max = slider.attribute('max');
            const newVal = Number(((val - min) * 100) / (max - min));
            const newPosition = 10 - newVal * 0.2;
            // console.log(slider.attribute('min'), slider.value(), slider.attribute('max'));
            // console.log(newVal, newPosition);

            sliderTooltip.html(val);
            sliderTooltip.style('left', `calc(${newVal}% + (${newPosition}px))`);
          });

          slider.mouseOver(() => {
            const min = slider.attribute('min');
            const val = slider.value();
            const max = slider.attribute('max');
            const newVal = Number(((val - min) * 100) / (max - min));
            const newPosition = 10 - newVal * 0.2;

            sliderTooltip.html(val);
            sliderTooltip.style('left', `calc(${newVal}% + (${newPosition}px))`);
            sliderTooltip.style('display', 'block');
          });

          slider.mouseOut(() => {
            sliderTooltip.style('display', 'none');
          });
        };

        s.draw = () => {
          s.clear();
          s.image(img, 0, 0, 177, 70);
          s.translate(150, 140);
          let x = 0;
          let y = 0;

          for (let i = 0; i < slider.value(); i++) {
            const prevX = x;
            const prevY = y;
            const n = i * 2 + 1;
            const radius = 60 * (4 / (n * s.PI));

            x += radius * s.cos(n * time);
            y += radius * s.sin(n * time);
            if (wave.length > 500) wave.pop();

            // draw circle
            s.stroke(255);
            s.noFill();
            s.ellipse(prevX, prevY, radius * 2);

            // draw arrow
            s.fill(255);
            s.line(prevX, prevY, x, y);
            s.stroke('#66fcf1');
            s.fill('#66fcf1');
            s.ellipse(x, y, 6);
          }

          // store last y value for wave
          wave.unshift(y);
          s.translate(150, 0);
          s.line(x - 150, y, 0, wave[0]);

          s.beginShape();
          s.noFill();
          wave.forEach((y, x) => {
            s.vertex(x, y);
          });
          s.endShape();

          time -= 0.02;
        };
      };

      // eslint-disable-next-line no-unused-vars
      const canvas = new P5(sketchSquareWave, this.$refs.squareWave);
    },

    async fourierCircle() {
      const { default: P5 } = await import('p5');

      /** @type {P5Instance}  */
      const sketchCircle = (s) => {
        let time = 0;
        let path = [];
        let fourierY;
        let fourierX;
        const x = [];
        const y = [];

        s.setup = () => {
          s.createCanvas(800, 410);
          s.frameRate(20);

          for (let i = 0; i < 50; i++) {
            // circle
            const angle = s.map(i, 0, 50, 0, s.TWO_PI);

            // // noise
            // const angle = s.map(i, 0, 100, 0, s.TWO_PI);
            // x[i] = s.noise(angle) * 200;
            // y[i] = s.noise(angle + 200) * 200;

            x.push(s.cos(angle) * 100);
            y.push(s.sin(angle) * 100);
          }

          fourierX = this.dft(x);
          fourierY = this.dft(y);

          fourierX.sort((a, b) => b.amp - a.amp);
          fourierY.sort((a, b) => b.amp - a.amp);
        };

        s.draw = () => {
          const offsetX = 0;
          const offsetY = 0;
          s.clear();
          s.textSize(20);
          s.fill(255, 255, 255);
          s.stroke(255, 255, 255);
          s.text(`FPS: ${s.frameRate().toFixed(0)}`, 5, 20);

          const vectorX = this.epicycle(400, 100, 0, fourierX, s, time, path);
          const vectorY = this.epicycle(100, 300, s.HALF_PI, fourierY, s, time, path);
          const vector = s.createVector(vectorX.x, vectorY.y);

          path.unshift(vector);
          s.line(vectorX.x, vectorX.y, vector.x + offsetX, vector.y + offsetY);
          s.line(vectorY.x, vectorY.y, vector.x + offsetX, vector.y + offsetY);

          s.translate(offsetX, offsetY);
          s.beginShape();
          s.noFill();
          path.forEach((_, i) => {
            s.vertex(path[i].x, path[i].y);
          });
          s.endShape();

          const dt = s.TWO_PI / fourierY.length;
          time += dt;

          if (time > s.TWO_PI) {
            time = 0;
            path = [];
          }
        };
      };

      // eslint-disable-next-line no-unused-vars
      const canvas = new P5(sketchCircle, this.$refs.circle);
    },

    async fourierTextOneLine(textPath) {
      const { default: P5 } = await import('p5');

      /** @type {P5Instance}  */
      const sketchEpicycles = (s) => {
        let time = 0;
        let path = [];
        let fourierY;
        let fourierX;
        const x = [];
        const y = [];

        const textPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        textPathEl.setAttribute('d', textPath);
        const textPathLength = Math.floor(textPathEl.getTotalLength());

        const drawing = [];
        for (let i = 0; i < textPathLength; i++) {
          drawing.push({
            x: textPathEl.getPointAtLength(i).x * 5,
            y: textPathEl.getPointAtLength(i).y * 5,
          });
        }

        s.setup = () => {
          s.createCanvas(800, 450);
          s.frameRate(60);

          const skipPoints = 1;
          for (let i = 0; i < drawing.length; i += skipPoints) {
            x.push(drawing[i].x);
            y.push(drawing[i].y);
          }

          fourierX = this.dft(x);
          fourierY = this.dft(y);

          fourierX.sort((a, b) => b.amp - a.amp);
          fourierY.sort((a, b) => b.amp - a.amp);
        };

        s.draw = () => {
          const offsetX = -200;
          const offsetY = -20;
          s.clear();
          s.textSize(20);
          s.fill(255, 255, 255);
          s.stroke(255, 255, 255);
          s.text(`FPS: ${s.frameRate().toFixed(0)}`, 5, 20);

          const vectorX = this.epicycle(400, 100, 0, fourierX, s, time, path);
          const vectorY = this.epicycle(100, 300, s.HALF_PI, fourierY, s, time, path);
          const vector = s.createVector(vectorX.x, vectorY.y);

          path.unshift(vector);
          s.line(vectorX.x, vectorX.y, vector.x + offsetX, vector.y + offsetY);
          s.line(vectorY.x, vectorY.y, vector.x + offsetX, vector.y + offsetY);

          s.translate(offsetX, offsetY);
          s.beginShape();
          s.noFill();
          path.forEach((_, i) => {
            s.vertex(path[i].x, path[i].y);
          });
          s.endShape();

          const dt = s.TWO_PI / fourierY.length;
          time += dt;

          if (time > s.TWO_PI) {
            s.noLoop();

            setTimeout(() => {
              time = 0;
              path = [];
              s.loop();
            }, 2000);
          }
        };
      };

      // eslint-disable-next-line no-unused-vars
      const canvas = new P5(sketchEpicycles, this.$refs.textOneLine);
    },

    async fourierTextMultiLine(textPath) {
      const { default: P5 } = await import('p5');

      /** @type {P5Instance}  */
      const sketchEpicycles = (s) => {
        let time = 0;
        let paths = [];
        let pathNum = 0;
        let fourierY;
        let fourierX;
        const x = [];
        const y = [];
        let vectorXprev = null;
        let vectorYprev = null;

        const textPathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        textPathEl.setAttribute('d', textPath);
        const textPathLength = Math.floor(textPathEl.getTotalLength());

        const drawing = [];
        for (let i = 0; i < textPathLength; i++) {
          drawing.push({
            x: textPathEl.getPointAtLength(i).x * 5,
            y: textPathEl.getPointAtLength(i).y * 5,
          });
        }

        s.setup = () => {
          s.createCanvas(800, 450);
          s.frameRate(60);

          const skipPoints = 1;
          for (let i = 0; i < drawing.length; i += skipPoints) {
            x.push(drawing[i].x);
            y.push(drawing[i].y);
          }

          fourierX = this.dft(x);
          fourierY = this.dft(y);

          fourierX.sort((a, b) => b.amp - a.amp);
          fourierY.sort((a, b) => b.amp - a.amp);
        };

        s.draw = () => {
          const offsetX = -200;
          const offsetY = -20;
          s.clear();
          s.textSize(20);
          s.fill(255, 255, 255);
          s.stroke(255, 255, 255);
          s.text(`FPS: ${s.frameRate().toFixed(0)}`, 5, 20);

          const vectorX = this.epicycle(400, 100, 0, fourierX, s, time, paths);
          const vectorY = this.epicycle(100, 300, s.HALF_PI, fourierY, s, time, paths);

          if (vectorXprev && (Math.abs(vectorX.x - vectorXprev) > 10) | (Math.abs(vectorY.y - vectorYprev) > 10)) {
            pathNum++;
          }

          const vector = s.createVector(vectorX.x, vectorY.y);

          // define array if not already
          if (!paths[pathNum]) paths[pathNum] = [];
          // push path point
          paths[pathNum].unshift(vector);
          // draw lines from epicycle to drawing
          s.line(vectorX.x, vectorX.y, vector.x + offsetX, vector.y + offsetY);
          s.line(vectorY.x, vectorY.y, vector.x + offsetX, vector.y + offsetY);

          s.translate(offsetX, offsetY);
          for (const path of paths) {
            s.beginShape();
            s.noFill();
            path.forEach((_, i) => {
              s.vertex(path[i].x, path[i].y);
            });
            s.endShape();
          }

          // console.log(path);

          vectorXprev = vectorX.x;
          vectorYprev = vectorY.y;
          const dt = s.TWO_PI / fourierY.length;
          time += dt;

          if (time > s.TWO_PI) {
            s.noLoop();

            setTimeout(() => {
              time = 0;
              paths = [];
              pathNum = 0;
              vectorXprev = null;
              vectorYprev = null;
              s.loop();
            }, 2000);
          }
        };
      };

      if (this.textCanvas) this.textCanvas.remove();

      this.textCanvas = new P5(sketchEpicycles, this.$refs.textMultiLine);
    },
  },

  head() {
    return {
      title: this.title,
    };
  },
};
</script>

<style lang="scss">
input[type='range'] {
  -webkit-appearance: none;
  border-radius: 5px;

  &::-webkit-slider-runnable-track {
    cursor: pointer;
    width: 100%;
    height: 4px;
    background: var(--clr-secondary);
    border-radius: 25px;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    cursor: pointer;
    margin-top: -8px;
    height: 20px;
    width: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 1);
  }

  &:hover {
    &::-webkit-slider-thumb {
      background: var(--clr-primary);
    }
  }

  &:focus {
    outline: none;

    &::-webkit-slider-thumb {
      background: var(--clr-primary);
      box-shadow: 0 0 0 3px var(--clr-dark), 0 0 0 6px var(--clr-primary);
    }
  }
}

.slider-value {
  position: absolute;
  top: -100%;
  width: 28px;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-align: center;
  background: var(--clr-secondary);
  transform: translate(-50%, 0px);
  border-radius: 5px;

  &::before {
    content: '';
    position: absolute;
    width: 5px;
    height: 5px;
    border-top: 10px solid var(--clr-secondary);
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    top: 90%;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

<style lang="scss" scoped>
input[type='text'] {
  font-family: inherit;
  color: black;
  padding: 1.5rem 2rem;
  background: rgba(white, 0.8);
  border: none;
  border-bottom: solid 3px transparent;
  width: 100%;
  display: block;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-bottom: solid 3px var(--clr-primary);
    box-shadow: 0 0.5rem 0.5rem rgba(black, 0.6);
  }

  &:hover {
    background: rgba(#eee, 0.8);
  }
}

button {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
