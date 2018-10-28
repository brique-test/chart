import * as d3 from 'd3';
import populationCSV from './population.csv';

const populationData = [];

const readCSV = new Promise((resolve) => {
  resolve(
    d3.csv(populationCSV, (data) => {
      const item = {
        year: parseInt(data.year, 10),
        population: parseInt(data.population, 10),
      };
      populationData.push(item);
    }),
  );
});

readCSV
  .then(() => {
    const xMin = d3.min(populationData, d => d.year);
    const xMax = d3.max(populationData, d => d.year);
    const yMax = d3.max(populationData, d => d.population);

    return {
      xMin,
      xMax,
      yMax,
    };
  })
  .then((value) => {
    const xScale = d3
      .scaleLinear()
      .domain([value.xMin, value.xMax])
      .range([0, 740]);

    const yScale = d3
      .scaleLinear()
      .domain([10000000, value.yMax])
      .range([540, 0]);

    return {
      xScale,
      yScale,
    };
  })
  .then((value) => {
    const xAxis = d3.axisBottom(value.xScale).tickFormat(d3.format('d'));
    const yAxis = d3.axisLeft(value.yScale).ticks(10);

    return {
      xAxis,
      yAxis,
    };
  })
  .then((value) => {
    const svgGraphic = d3
      .select('#chart')
      .append('svg')
      .attr('width', 800)
      .attr('height', 600);

    svgGraphic
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(60, 540)')
      .call(value.xAxis);

    svgGraphic
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(60, 0)')
      .call(value.yAxis);
  });
