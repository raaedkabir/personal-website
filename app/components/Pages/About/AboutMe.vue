<template>
  <div>
    <AppModal class="modal" :open="showDialog" title="Buy Me a Coffee" @close="(showDialog = false), (amount = null)">
      <template>
        <div class="d-flex justify-between mt-3">
          <div class="modal__item">
            <img src="@/assets/images/coffee/beans.svg" alt="coffee beans" />
            <AppButton flat :class="{ selected: amount === 100 }" @click="amount = 100">$ 1</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/paper-cup.svg" alt="coffee cup" />
            <AppButton flat :class="{ selected: amount === 500 }" @click="amount = 500">$ 5</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/machine.svg" alt="coffee machine" />
            <AppButton flat :class="{ selected: amount === 2000 }" @click="amount = 2000">$ 20</AppButton>
          </div>
          <div class="modal__item">
            <img src="@/assets/images/coffee/shop.svg" alt="coffee shop" />
            <AppButton flat :class="{ selected: amount === 5000 }" @click="amount = 5000">$ 50</AppButton>
          </div>
        </div>
        <div class="d-flex justify-center">
          <AppStripe v-if="showStripe" :amount="amount" style="margin: 3rem 0 0" />
        </div>
        <div class="attribution">
          <p>
            Icons made by
            <AppLink
              href="https://www.flaticon.com/authors/srip"
              title="srip"
              target="_blank"
              rel="noopener noreferrer nofollow"
              >srip</AppLink
            >
            from
            <AppLink
              href="https://www.flaticon.com/"
              title="Flaticon"
              target="_blank"
              rel="noopener noreferrer nofollow"
              >www.flaticon.com</AppLink
            >.
          </p>
          <p>All prices in CAD.</p>
        </div>
      </template>
    </AppModal>

    <div class="about-me">
      <div class="about-me--image">
        <img src="@/assets/images/me.png" alt="photo of myself" @load="onImgLoad" />
        <div id="chart"></div>
      </div>
      <div class="about-me--text">
        <p>
          I'm a self-taught programmer and Electrical Engineering graduate from
          <span class="upm-color">UPM</span>.
        </p>
        <br />
        <p>
          I started out with Python but accidentally stumbled into the world of JavaScript and Frontend Development
          where I found my home. I discovered that creating Web Apps fulfilled my two biggest passions of creating
          things and programming.
        </p>
        <br />
        <p>
          If you'd like, <span class="link" @click="showDialog = true">click here</span> to buy me a cup of coffee and
          help keep me awake.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  data() {
    return {
      showDialog: false,
      showStripe: false,
      amount: null,
    };
  },

  watch: {
    amount(val, oldVal) {
      if (val) this.showStripe = true;
      else this.showStripe = false;

      if (val && oldVal !== null) {
        this.showStripe = false;
        this.$nextTick(() => {
          this.showStripe = true;
        });
      }
    },
  },

  methods: {
		onImgLoad() {
      // Set the dimensions of the chart
      const img = document.querySelector('.about-me--image > img');
      const multiplier = 1.5;
      const diameter = img.width * multiplier;

      // Set the minimum inner radius and max outer radius of the chart
      const innerRadius = (diameter / multiplier / 2) * .95;
      const outerRadius = innerRadius * .6;

      // Add the svg canvas for the line chart
      const svg = d3.select('#chart')
        .append('svg')
        .attr('width', diameter)
        .attr('height', diameter)
        .append('g')
        .attr('transform', 'translate(' + (diameter / 2) + ', ' + (diameter / 2) + ')');

      const numColors = 10;
      const colorScale = d3.scaleLinear()
        .domain([0, (numColors - 1) / 2, numColors - 1])
        .range(['#50c7e6', '#66fcf1'])
        .interpolate(d3.interpolateHcl);

      svg.append('defs').append('radialGradient')
        .attr('id', 'gradientRainbow')
        .attr('gradientUnits', 'userSpaceOnUse') 
        .attr('cx', '0%')
        .attr('cy', '0%')
        .attr('r', '45%')
        .selectAll('stop') 
        .data(d3.range(numColors))                  
        .enter().append('stop') 
        .attr('offset', function(d, i) { return (i / (numColors - 1) * 50 + 40) + '%'; })   
        .attr('stop-color', function(d) { return colorScale(d); });

      // Create the data
      function getRandomNumber(start, end) {
        return (Math.random() * (end - start) * 100) / 100 + start;
      }

      // Create approximate bell curve
      function rnd2() {
        return ((Math.random() + Math.random() + Math.random() + Math.random()) - 2) / 2;
      }
      
      // Adjust circle sizes to browser size
      const circleRanges = [20 * diameter / 1000, 6 * diameter / 1000];
    
      // Create random dataset
      const dataset = [];
      for (let i = 0; i < 2000; i++) {
        let outward = Math.abs(rnd2()) * (outerRadius * 0.8) + innerRadius; // getRandomNumber(innerRadius, outerRadius),
        const radius = Math.abs(rnd2() * circleRanges[0] + circleRanges[1]); // getRandomNumber(1, 18);
    
        if (outward - radius < innerRadius) {
          outward = innerRadius + radius;
        }

        dataset.push({
          outward, 
          theta: getRandomNumber(1, 360) * Math.PI / 180,
          radius,
        })	
      }

      // Append the lines radiating outward
      const lineWrapper = svg.append('g').attr('class', 'lineWrapper');

      lineWrapper.selectAll('.lines')
        .data(d3.range(1, 80))
        .enter().append('line')
        .attr('class', 'lines')
        .attr('transform', function(d, i) { return 'rotate(' + ( getRandomNumber(1, 360) ) + ')'; })
        .attr('x1', 0)
        .attr('y1', function(d) { return getRandomNumber(innerRadius, outerRadius * 1.3); })
        .attr('x2', 0)
        .attr('y2', function(d) { return getRandomNumber(innerRadius, outerRadius * 1.3); })
        .style('stroke', 'url(#gradientRainbow)')
        .style('stroke-width', function(d) { return getRandomNumber(0.5, 3); })
        .style('opacity', 0)
        .transition().duration(750)
        .style('opacity', function(d) { return getRandomNumber(0.2, 0.7); });

      // Append the circles
      const circleWrapper = svg.append('g').attr('class', 'circleWrapper');

      circleWrapper.selectAll('.dots')
        .data(dataset)
        .enter().append('circle')
        .attr('class', 'dots')
        .attr('cx', function(d) { return d.outward * Math.cos(d.theta); })
        .attr('cy', function(d) { return d.outward * Math.sin(d.theta); })
        .attr('r', function(d) { return d.radius; })
        .style('fill', 'url(#gradientRainbow)')
        .style('opacity', 0)
        .transition().duration(750)
        .style('opacity', function(d) { return getRandomNumber(0.2, 0.7); });
    }
  }
};
</script>

<style lang="scss" scoped>
.about-me {
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @include respond(phone) {
    grid-template-columns: 1fr;
  }

  &--text {
    grid-area: 1 / 2 / 2 / 4;
    margin-left: 5rem;

    @include respond(phone) {
      grid-area: inherit;
      margin-left: 0;
      margin-top: 4rem;
    }
  }

  &--image {
    position: relative;
    grid-area: 1 / 1 / 2 / 2;

    @include respond(phone) {
      grid-area: inherit;
    }

    img {
      margin: 0 auto;
      max-height: 320px;
      border-radius: 50%;
    }

    div {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;

      svg {
        overflow: visible;
      }
    }
  }

  p {
    font-size: 2rem;

    .upm-color {
      font-weight: 700;
      color: #c8234a;
    }
  }
}

.modal {
  img {
    height: 8rem;
  }

  .attribution {
    text-align: right;
    margin-top: 2rem;
    font-size: 1.4rem;
    font-weight: 300;
  }

  .selected {
    background: var(--clr-dark);
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      margin-bottom: 2rem;
    }
  }
}
</style>
