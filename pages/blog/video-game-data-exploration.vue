<template>
  <Layout img="/video-game-data-exploration/heading.png" title="My Data Exploration Process" date="January 2020">
    <div slot="content">
      <h2 class="heading__section">List Data Attributes</h2>
      <blockquote>
        <p>List all the Data Attributes and their types and highlight the ones which might be interesting.</p>
      </blockquote>
      <img src="~/assets/images/blog/video-game-data-exploration/data attributes.jpg" alt="data attributes sketch" />
      <p>I also like to see all the unique values for a categorical attribute to understand the data better.</p>
      <pre><AppPrism lang="javascript">
      let genres = [];
      data.forEach((d) => genres.push(d.Genre));
      genres = [...new Set(genres)];

      // genres = [Sports, Platform, Racing, Role‑Playing, Puzzle, Misc, Shooter, Simulation, Action, Fighting, Adventure, Strategy, Unknown]

      const countGenres = _.chain(rawData)
        .countBy("Genre")
        .value();
      
      // countGenres = {
      //   Action: 3370,
      //   Adventure: 1303,
      //   Fighting: 849,
      //   Misc: 1750,
      //   Platform: 888,
      //   Puzzle: 580,
      //   Racing: 1249,
      //   Role-Playing: 1500,
      //   Shooter: 1323,
      //   Simulation: 874,
      //   Sports: 2348,
      //   Strategy: 683,
      //   Unknown: 2
      // }
      </AppPrism></pre>

      <h2 class="heading__section">Ask Questions</h2>
      <blockquote>
        <p>
          Ask questions about the interesting data attributes and formulate a hypothesis. The hypothesis will act as a
          guide when exploring the data. (I try to avoid using versus and try for full sentences.)
        </p>
      </blockquote>
      <ul>
        <li>Is there a relationship between Sales and the Publisher/Developer?</li>
        <li>How does Meta Score and User Score correlate against each other?</li>
        <li>Is there an increase in the number of M-rated games as gamers grow older?</li>
        <li>Have the genre preferences changed over the years?</li>
      </ul>
      <p>Then I sketch what these hypotheses might look like on a simple chart.</p>
      <img src="~/assets/images/blog/video-game-data-exploration/questions.jpg" alt="asking questions sketch" />

      <h2 class="heading__section">Explore the Data</h2>
      <blockquote>
        <p>
          Usually I'd do this with Seaborn in Python but to show it in this page I'm using Vega-Lite. Any high-level
          charting library will work really, just plot simple charts only. Look for any interesting patterns or trends.
        </p>
        <p>
          To limit the scale of the data I'm only taking the top 10 Games in Sales for every Year, which gives me 370
          data points.
        </p>
      </blockquote>
      <div class="d-flex justify-center">
        <div id="visScatter"></div>
      </div>
      <p>
        Unsurprisingly to me at least, some of the major outliers between Critic and User Scores are the Call of Duty
        games. They seem to appear twice so that is perhaps because the game is realeased on multiple consoles. That is
        something to consider later on. The rest of the data generally follows the same trend.
      </p>
      <div class="d-flex justify-center">
        <div id="visStackedHistogram"></div>
      </div>
      <p>
        Judging by the stacked colors we can see that Shooter and Role-Playing games are by far the most popular games
        based on the number of user counts. Since this dataset currently only shows the top 10 in Sales every Year the
        results are probably skewed towards the high-budget AAA games. Which games are these? What would the colors look
        like if we included the whole dataset? Something to put on the tab and check out later.
      </p>
      <div class="d-flex justify-center">
        <div id="visLineSales"></div>
      </div>
      <p>
        All the regions follow the same trend but there was a spike in 2006 so it might be worth looking at what caused
        that. I should also note that inflation has not been accounted for.
      </p>
      <div class="d-flex justify-center">
        <div id="visLineGenres"></div>
      </div>
      <p>
        Sorting by genre we can see that the spike in 2006 is from the Sports genre. Apparently it is coming from Wii
        Sports, which makes sense since it was packaged with the hugely successful Nintendo Wii console.
      </p>

      <h2 class="heading__section">Analyze the Data</h2>
      <blockquote>
        <p>
          The data aboved seemed to have an anomoly but it was just Wii Sports which had the special circumstance of
          being packaged with a console. Before moving on it would be great to take a break and check the validitiy of
          the data and find other sources for missing data. After filtering out games missing a Critic or User score the
          dataset went from 370 values to 164 so I can't say in full faith that this was a completely accurate
          exploratory analysis.
        </p>
        <p>
          One I've explored the questions I had and also my tangent questions, I can decide a theme to center the entire
          design around. What message do I want to communicate through the data visualization? I want to focus on the
          comparison between the North America, Europe and Japan sales as a measure of popularity over the years and
          sort the data by genre. Does the North American consumers buy more Actions games over time? Which Region has a
          greater trend towards buying Role-Playing games? This is where I do a final sketch and finally bring out
          D3.js.
        </p>
      </blockquote>
      <img src="~/assets/images/blog/video-game-data-exploration/final sketch.jpg" alt="final sketch" />

      <h3 class="text-center">North America</h3>
      <svg id="dataVizNA"></svg>
      <h3 class="text-center">Europe</h3>
      <svg id="dataVizEU"></svg>
      <h3 class="text-center">Japan</h3>
      <svg id="dataVizJP"></svg>
      <p class="ma-0">
        <AppLink
          href="https://codepen.io/toddlowell/pen/qBaLPYQ"
          title="Source Code"
          target="_blank"
          rel="noopener noreferrer"
          >Source Code</AppLink
        >
      </p>
      <p>
        An issue with the dataset I'm using is that the sales is aggregated by year and not something more granular like
        by month so the graph produces deep valleys instead of a gradual incline/decline. I also chose a random dataset
        and didn't check it out beforehand so it seems that data is missing in more recent years which is why the curve
        tapers off after 2010. But since this was just for personal practice that's fine.
      </p>

      <h2 class="heading__section">Resources</h2>
      <ul>
        <li>
          <AppLink href="https://blog.datawrapper.de/" title="Datawrapper" target="_blank" rel="noopener noreferrer"
            >Datawrapper</AppLink
          >
          has an absolutely amazing blog where I learned
          <AppLink
            href="https://blog.datawrapper.de/beautifulcolors/"
            title="How to pick more beautiful colors for your data visualizations"
            target="_blank"
            rel="noopener noreferrer"
            >colors</AppLink
          >
          from.
        </li>
        <li>
          <AppLink
            href="https://bl.ocks.org/nbremer"
            title="Nadieh Bremer’s Blocks"
            target="_blank"
            rel="noopener noreferrer"
            >Nadieh Bremer’s Blocks</AppLink
          >
          are a great place to see creative visualization and how they're done.
        </li>
        <li>
          <AppLink href="https://pudding.cool/" title="The Pudding" target="_blank" rel="noopener noreferrer"
            >The Pudding</AppLink
          >,
          <AppLink href="https://infowetrust.com/" title="Info We Trust" target="_blank" rel="noopener noreferrer"
            >Info We Trust</AppLink
          >,
          <AppLink href="https://www.datasketch.es/" title="Data Sketches" target="_blank" rel="noopener noreferrer"
            >Data Sketches</AppLink
          >,
          <AppLink
            href="https://www.informationisbeautifulawards.com/"
            title="Information is Beautiful Awards"
            target="_blank"
            rel="noopener noreferrer"
            >Information is Beautiful Awards</AppLink
          >
          and
          <AppLink
            href="https://flowingdata.com/category/projects/"
            title="FlowingData"
            target="_blank"
            rel="noopener noreferrer"
            >FlowingData</AppLink
          >
          are also some nice inspirational sources for creative coding.
        </li>
      </ul>

      <h2 class="heading__section">Code Snippets</h2>
      <h3 class="heading__sub-section">Get Top 3 Genres:</h3>
      <pre><AppPrism lang="javascript">
        const topTen = _.chain(data)
          .countBy('genre')
          .toPairs()
          .sortBy(d => -d[1])
          .take(10)
          .map(0)
          .value();
        </AppPrism></pre>
      <h3 class="heading__sub-section">Aggregate Sales by Year:</h3>
      <pre><AppPrism lang="javascript">
        const sales = _.chain(data)
          .map((d) => {
            return {
              salesNA: +d.NA_Sales,
              salesEU: +d.EU_Sales,
              salesJP: +d.JP_Sales,
              year: new Date(d.Year_of_Release)
            };
          })
          .reduce((result, obj) => {
            const key = obj.year.getFullYear();

            result[key] = {
              salesNA: obj.salesNA + ((result[key] && result[key].salesNA) || 0),
              salesEU: obj.salesEU + ((result[key] && result[key].salesEU) || 0),
              salesJP: obj.salesJP + ((result[key] && result[key].salesJP) || 0),
              year: obj.year
            };

            return result;
          }, {})
          .values()
          .sortBy("year")
          .value();
        </AppPrism></pre>
    </div>
  </Layout>
</template>

<script>
import _ from 'lodash';
import vegaEmbed from 'vega-embed';
import * as d3 from 'd3';
import { legendColor } from 'd3-svg-legend';

import Layout from '~/layout/blog.vue';

export default {
  layout: 'empty',

  components: {
    Layout,
  },

  async fetch() {
    this.csvData = await d3.csv(
      'https://gist.githubusercontent.com/ToddLowell/599a07d370dcefc6659c2b91dacaf542/raw/385abd5224858adb617552dcb96323d9d0783441/Video%2520Game%2520Sales%2520with%2520Ratings.csv'
    );

    this.vegaLiteClean(this.csvData);
    this.d3Clean(this.csvData);
  },

  data() {
    return {
      csvData: null,
      colors: [
        '#ecdb54',
        '#e34132',
        '#6ca0dc',
        '#944743',
        '#dbb2d1',
        '#ec9787',
        '#00a68c',
        '#645394',
        '#6c4f3d',
        '#bc6ca7',
        '#bfd833',
        '#2e4a62',
      ],
    };
  },

  fetchOnServer: false,

  methods: {
    vegaLiteClean(gameData) {
      const data = _.chain(gameData)
        .groupBy('Year_of_Release')
        .filter((d) => {
          return d.length >= 10;
        })
        .sortBy('Global_Sales')
        .map((d) =>
          d.filter((d, i) => {
            if (i < 10) return d;
          })
        )
        .flatten()
        // check if it exists
        .filter((d) => {
          return d.Critic_Score && d.User_Score && d.Year_of_Release !== 'N/A';
        })
        // format the data
        .map((d) => {
          return {
            title: d.Name,
            criticScore: +d.Critic_Score,
            criticCount: +d.Critic_Count,
            userScore: +d.User_Score * 10,
            userCount: +d.User_Count,
            genre: d.Genre,
            salesNA: +d.NA_Sales * 1000000,
            salesEU: +d.EU_Sales * 1000000,
            salesJP: +d.JP_Sales * 1000000,
            salesOther: +d.Other_Sales * 1000000,
            salesGlobal: +d.Global_Sales * 1000000,
            year: new Date(d.Year_of_Release),
          };
        })
        .value();

      this.vegaLiteDataExploration(data);
    },

    vegaLiteDataExploration(data) {
      // Vega-Lite Stuff
      const scatterPlot = {
        width: 500,
        autosize: {
          type: 'fit-x',
          contains: 'content',
        },
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        title: 'Meta Score vs. User Score',
        data: {
          values: data,
        },
        mark: { type: 'point', tooltip: { content: 'data' } },
        encoding: {
          x: { field: 'userScore', type: 'quantitative' },
          y: { field: 'criticScore', type: 'quantitative' },
        },
      };
      vegaEmbed('#visScatter', scatterPlot);

      const stackedHistogram = {
        width: 500,
        autosize: {
          type: 'fit-x',
          contains: 'content',
        },
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        title: 'Score against Count by Genre',
        data: {
          values: data,
        },
        mark: { type: 'bar' },
        encoding: {
          x: { bin: true, field: 'userScore', type: 'quantitative' },
          y: { field: 'userCount', type: 'quantitative' },
          color: {
            field: 'genre',
            type: 'nominal',
          },
          tooltip: [{ field: 'userCount', type: 'quantitative' }],
        },
      };
      vegaEmbed('#visStackedHistogram', stackedHistogram);

      const stackedLineSales = {
        width: 500,
        autosize: {
          type: 'fit-x',
          contains: 'content',
        },
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        title: 'Sales by Region over the Years',
        data: {
          values: data,
        },
        repeat: {
          layer: ['salesNA', 'salesEU', 'salesJP', 'salesOther'],
        },
        spec: {
          mark: { type: 'line' },
          encoding: {
            x: { field: 'year', type: 'temporal', timeUnit: 'year', title: 'Year' },
            y: {
              aggregate: 'mean',
              field: { repeat: 'layer' },
              type: 'quantitative',
              title: 'Mean of Sales by Region',
            },
            color: {
              datum: { repeat: 'layer' },
              type: 'nominal',
            },
          },
        },
      };
      vegaEmbed('#visLineSales', stackedLineSales);

      const stackedLineGenres = {
        width: 500,
        autosize: {
          type: 'fit-x',
          contains: 'content',
        },
        $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
        title: 'Sales by Genre over the Years',
        data: {
          values: data,
        },
        mark: { type: 'line', tooltip: true },
        encoding: {
          x: { field: 'year', type: 'temporal', timeUnit: 'year', title: 'Year' },
          y: {
            aggregate: 'mean',
            field: 'salesGlobal',
            type: 'quantitative',
          },
          color: {
            field: 'genre',
            type: 'nominal',
            sort: {
              op: 'count',
              field: 'genre',
              type: 'quantitative',
              order: 'descending',
            },
          },
        },
      };
      vegaEmbed('#visLineGenres', stackedLineGenres);
    },

    d3Clean(rawData) {
      const data = _.chain(rawData)
        .filter((d) => {
          return d.Year_of_Release !== 'N/A' && +d.Year_of_Release < 2017 && d.Genre;
        })
        // format the data
        .map((d) => {
          return {
            genre: d.Genre,
            salesNA: +d.NA_Sales * 1000000,
            salesEU: +d.EU_Sales * 1000000,
            salesJP: +d.JP_Sales * 1000000,
            year: d3.timeParse('%Y')(d.Year_of_Release),
          };
        })
        .reduce((result, obj) => {
          const year = obj.year.getFullYear();

          result[obj.genre] = result[obj.genre] || {};
          result[obj.genre].genre = obj.genre;
          result[obj.genre].sales = result[obj.genre].sales || {};
          result[obj.genre].sales[year] = result[obj.genre].sales[year] || {};

          result[obj.genre].sales[year].salesNA = obj.salesNA + (result[obj.genre].sales[year].salesNA || 0);
          result[obj.genre].sales[year].salesEU = obj.salesEU + (result[obj.genre].sales[year].salesEU || 0);
          result[obj.genre].sales[year].salesJP = obj.salesJP + (result[obj.genre].sales[year].salesJP || 0);
          result[obj.genre].sales[year].year = obj.year;

          return result;
        }, {})
        .values()
        .map((d) => {
          return {
            genre: d.genre,
            sales: _.values(d.sales),
          };
        })
        .value();

      this.d3Plot(data);
    },

    d3Plot(data) {
      /// create scales ///
      const years = [];
      data.forEach((d) => {
        d.sales.forEach((i) => years.push(i.year));
      });

      let genres = [];
      data.forEach((d) => genres.push(d.genre));
      genres = [...new Set(genres)];

      const margin = { top: 0, right: 0, bottom: 20, left: 40 };
      const width = 700;
      const height = 300;

      const [minDate, maxDate] = d3.extent(years);
      const xScale = d3
        .scaleTime()
        .domain([d3.timeYear.floor(minDate), d3.timeYear.ceil(maxDate)])
        .range([margin.left, width - margin.right]);
      // console.log(xScale.domain(), xScale.range());

      const sales = _.chain(data)
        .map((d) => d.sales)
        .flatten()
        .map((d) => [d.salesNA, d.salesEU, d.salesJP])
        .flatten()
        .value();
      const yExtent = d3.extent(sales);
      const yScale = d3
        .scaleLinear()
        .domain(yExtent)
        .range([height - margin.bottom, margin.top]);
      // console.log(yScale.domain(), yScale.range());

      const colorScale = d3.scaleOrdinal().domain(genres).range(this.colors).unknown('#f00');
      // console.log(colorScale.range());

      const drawLineNA = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.salesNA))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const drawLineEU = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.salesEU))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const drawLineJP = d3
        .line()
        .x((d) => xScale(d.year))
        .y((d) => yScale(d.salesJP))
        .curve(d3.curveCatmullRom.alpha(0.5));

      /// draw SVG ///
      const svgNA = d3
        .select('#dataVizNA')
        .attr('width', width)
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`);

      const svgEU = d3
        .select('#dataVizEU')
        .attr('width', width)
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`);

      const svgJP = d3
        .select('#dataVizJP')
        .attr('width', width)
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', `0 0 ${width} ${height}`);

      [
        [svgNA, drawLineNA],
        [svgEU, drawLineEU],
        [svgJP, drawLineJP],
      ].forEach(([el, draw]) => {
        el.selectAll('path.line')
          .data(data)
          .join('path')
          .classed('line', true)
          .attr('d', (d) => draw(d.sales))
          .attr('fill', 'none')
          .attr('stroke', (d) => colorScale(d.genre))
          .attr('stroke-width', 1.5);
      });

      // axes
      const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
      const yAxis = d3
        .axisLeft(yScale)
        .tickFormat((d) => '$' + d / 1000000 + ' M')
        .tickSizeOuter(0);

      [svgNA, svgEU, svgJP].forEach((el) => {
        el.append('g')
          .classed('x-axis', true)
          .attr('transform', `translate(0, ${height - margin.bottom})`)
          .call(xAxis);

        el.append('g').classed('y-axis', true).attr('transform', `translate(${margin.left}, 0)`).call(yAxis);
      });

      // legend
      const legend = legendColor().title('Genres').scale(colorScale);

      [svgNA, svgEU, svgJP].forEach((el) => {
        el.append('g')
          .classed('legend', true)
          .attr('transform', `translate(${margin.left + 10}, 18) scale(0.5, 0.5)`)
          .attr('fill', '#fff')
          .attr('font-size', '1.5em')
          .call(legend)
          .select('.legendTitle')
          .attr('font-size', '1.5em');
      });

      /// mouse events ///

      // creating els
      const barNA = svgNA
        .append('line')
        .attr('opacity', 0)
        .attr('style', 'stroke: #999; stroke-width: 1.2; stroke-dasharray: 5 3;')
        .attr('y1', 0)
        .attr('y2', height - margin.bottom)
        .attr('x1', 200)
        .attr('x2', 200);

      const barEU = svgEU
        .append('line')
        .attr('opacity', 0)
        .attr('style', 'stroke: #999; stroke-width: 1.2; stroke-dasharray: 5 3;')
        .attr('y1', 0)
        .attr('y2', height - margin.bottom)
        .attr('x1', 200)
        .attr('x2', 200);

      const barJP = svgJP
        .append('line')
        .attr('opacity', 0)
        .attr('style', 'stroke: #999; stroke-width: 1.2; stroke-dasharray: 5 3;')
        .attr('y1', 0)
        .attr('y2', height - margin.bottom)
        .attr('x1', 200)
        .attr('x2', 200);

      // // not enough data points for marker
      // const marker = svg
      //   .append("circle")
      //   .attr("r", 4)
      //   .attr("cx", 100)
      // .attr("cy", 100)
      //   .attr("fill", "none")
      //   .attr("stroke", "red");

      // event listeners
      [svgNA, svgEU, svgJP].forEach((el) => {
        el.on('touchmove mousemove', (e) => {
          const m = d3.pointer(event);

          // check if within chart range
          if (m[0] > margin.left && m[0] < width - margin.right && m[1] < height - margin.bottom) {
            // console.log(d3.pointer(event), xScale.invert(m[0]));

            update(xScale.invert(m[0]));
          }
        }).on('touchend mouseleave', () => {
          // console.log("Mouse Exit");

          // hide bars
          [barNA, barEU, barJP].forEach((el) => {
            el.attr('opacity', 0);
          });
        });
      });

      function update(date) {
        // const bisect = d3.bisector((d) => d.year);
        // const i = bisect.right(data[0].sales, date);

        // // not enough data points for marker
        // if (i < data[0].sales.length) {
        //   marker.attr("cx", xScale(data[0].sales[i].year)).attr("cy", yScale(data[0].sales[i].salesNA));
        // }

        // update bar pos
        [barNA, barEU, barJP].forEach((el) => {
          el.attr('opacity', 1)
            .attr('x1', xScale(new Date(date)))
            .attr('x2', xScale(new Date(date)));
        });
      }
    },
  },
};
</script>
