<template>
  <Layout img="/generativeArt/heading.png" title="Generative Art with HTML5 Canvas" date="December 2020">
    <div slot="content">
      <p>
        When starting a project without a specific goal in mind it can help to first pick a simple theme and keep
        abstracting from there. Here we start with a simple grid.
      </p>
      <canvas id="c0" />
      <p>Now let's change the intersections of the grid to circles and see where we can go from there.</p>
      <canvas id="c1" />
      <p>
        In tune with the title of this page, "Generative Art", it's time to add some randomness! Let's make the circles
        smaller and randomly show half of them with <code>Math.random() > 0.5</code>.
      </p>
      <canvas id="c2" />
      <p>
        Now let's also make the sizes of the circles random too! But instead of using the usual
        <code>Math.random()</code> which gives us a random number from 0 (inclusive) to 1 (exclusive) we will use the
        Gaussuan (or Normal) distribution. Gaussian distributions show up very often in nature and will give us a more
        organic randomness.
      </p>
      <canvas id="c3" />
      <p>
        And lastly let's all color! nice-color-palettes is a npm package with color paletters sourced from
        <a href="https://www.colourlovers.com/" target="_blank" rel="noopener noreferrer nofollow">
          ColourLovers.com
        </a>
        to give us nicely matching colors.
      </p>
      <canvas id="c4" />
    </div>
  </Layout>
</template>

<script>
import random from 'canvas-sketch-util/random';
import palettes from 'nice-color-palettes';
import _ from 'lodash';

import Layout from '~/layout/blog.vue';

export default {
  layout: 'empty',

  components: {
    Layout,
  },

  mounted() {
    function lerp(min, max, t) {
      return min * (1 - t) + max * t;
    }

    const canvas0 = document.querySelector('canvas#c0');
    if (canvas0) {
      const width = 2048;
      const height = 2048;

      canvas0.width = width;
      canvas0.height = height;

      const createGrid = () => {
        const points = [];
        const count = 5;
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            points.push([u, v]);
          }
        }

        return points;
      };

      const points = createGrid();
      const margin = 400;

      const ctx = canvas0.getContext('2d');
      if (ctx) {
        points.forEach(([u, v]) => {
          // const x = u * width;
          // const y = v * height;
          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, width - margin, v);

          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 30;

          ctx.moveTo(margin / 2, y);
          ctx.lineTo(width - margin / 2, y);
          ctx.stroke();

          ctx.moveTo(x, margin / 2);
          ctx.lineTo(x, height - margin / 2);
          ctx.stroke();
        });
      }
    }

    const canvas1 = document.querySelector('canvas#c1');
    if (canvas1) {
      const width = 2048;
      const height = 2048;

      canvas1.width = width;
      canvas1.height = height;

      const createGrid = () => {
        const points = [];
        const count = 5;
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            points.push([u, v]);
          }
        }

        return points;
      };

      const points = createGrid();
      const margin = 400;

      const ctx = canvas1.getContext('2d');
      if (ctx) {
        points.forEach(([u, v]) => {
          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, width - margin, v);

          ctx.beginPath();
          ctx.arc(x, y, 100, 0, Math.PI * 2, false);
          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 30;
          ctx.stroke();
        });
      }
    }

    const canvas2 = document.querySelector('canvas#c2');
    if (canvas2) {
      const width = 2048;
      const height = 2048;

      canvas2.width = width;
      canvas2.height = height;

      const createGrid = () => {
        const points = [];
        const count = 40;
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            points.push([u, v]);
          }
        }

        return points;
      };

      const points = createGrid().filter(() => Math.random() > 0.5);
      const margin = 100;

      const ctx = canvas2.getContext('2d');
      if (ctx) {
        points.forEach(([u, v]) => {
          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, width - margin, v);

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2, false);
          ctx.strokeStyle = '#ddd';
          ctx.lineWidth = 20;
          ctx.stroke();
          ctx.fillStyle = '#ddd';
          ctx.fill();
        });
      }
    }

    const canvas3 = document.querySelector('canvas#c3');
    if (canvas3) {
      const width = 2048;
      const height = 2048;

      canvas3.width = width;
      canvas3.height = height;

      const createGrid = () => {
        const points = [];
        const count = 40;
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            const radius = Math.max(0, random.gaussian() * 0.01);

            points.push({
              position: [u, v],
              radius,
            });
          }
        }

        return points;
      };

      const points = createGrid().filter(() => Math.random() > 0.5);
      const margin = 100;

      const ctx = canvas3.getContext('2d');
      if (ctx) {
        points.forEach((data) => {
          const {
            position: [u, v],
            radius,
          } = data;

          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, width - margin, v);

          ctx.beginPath();
          ctx.arc(x, y, radius * width, 0, Math.PI * 2, false);
          ctx.fillStyle = '#ddd';
          ctx.fill();
        });
      }
    }

    const canvas4 = document.querySelector('canvas#c4');
    if (canvas4) {
      const width = 2048;
      const height = 2048;

      canvas4.width = width;
      canvas4.height = height;

      const palette = _.chain(palettes).sample().shuffle().value();

      const createGrid = () => {
        const points = [];
        const count = 40;
        for (let x = 0; x < count; x++) {
          for (let y = 0; y < count; y++) {
            const u = count <= 1 ? 0.5 : x / (count - 1);
            const v = count <= 1 ? 0.5 : y / (count - 1);

            const radius = Math.max(0, random.gaussian() * 0.01);

            points.push({
              color: _.sample(palette),
              position: [u, v],
              radius,
            });
          }
        }

        return points;
      };

      const points = createGrid().filter(() => Math.random() > 0.5);
      const margin = 100;

      const ctx = canvas4.getContext('2d');
      if (ctx) {
        points.forEach((data) => {
          const {
            position: [u, v],
            radius,
            color,
          } = data;

          const x = lerp(margin, width - margin, u);
          const y = lerp(margin, width - margin, v);

          ctx.beginPath();
          ctx.arc(x, y, radius * width, 0, Math.PI * 2, false);
          ctx.fillStyle = color;
          ctx.fill();
        });
      }
    }
  },
};
</script>
