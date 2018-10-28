import * as d3 from 'd3';
import populationCSV from './population.csv';

const size = {
  width: 800,
  height: 600,
  margin: 80,
};

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

readCSV.then(() => {
  const xMin = d3.min(populationData, d => d.year);
  const xMax = d3.max(populationData, d => d.year);
  const yMax = d3.max(populationData, d => d.population);

  const xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([0, size.width - size.margin]);

  const yScale = d3
    .scaleLinear()
    .domain([10000000, yMax])
    .range([size.height - size.margin, size.margin]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).ticks(10);

  const line = d3
    .line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.population))
    .curve(d3.curveMonotoneX);

  const svgGraphic = d3
    .select('#chart')
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  svgGraphic
    .append('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(${size.margin}, ${size.height - size.margin})`,
    )
    .call(xAxis);

  svgGraphic
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${size.margin}, 0)`)
    .call(yAxis);

  svgGraphic
    .append('path')
    .datum(populationData)
    .attr('class', 'line')
    .attr('transform', `translate(${size.margin}, 0)`)
    .attr('d', line);
});

let thicknessValue = 1;
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');

increaseBtn.addEventListener('click', () => {
  const line = document.getElementsByClassName('line')[0];
  thicknessValue += 1;
  line.style.strokeWidth = thicknessValue;
});

decreaseBtn.addEventListener('click', () => {
  const line = document.getElementsByClassName('line')[0];
  if (thicknessValue === 1) {
    thicknessValue = 1;
    alert('최소 굵기입니다.');
  } else {
    thicknessValue -= 1;
  }
  line.style.strokeWidth = thicknessValue;
});
