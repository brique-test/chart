import * as d3 from 'd3';
import populationCSV from './population.csv';

// d3.js로 구현할 차트 박스의 너비, 높이, 마진 값
const size = {
  width: 800,
  height: 600,
  margin: 80,
};

// csv 파일에서 읽어들인 데이터를 담는 배열
const populationData = [];

// 파일을 읽어들인 뒤에 모든 연산이 시작되어야 해서
// Promise 객체를 이용한 비동기 체인 구현
const readCSV = new Promise((resolve) => {
  resolve(
    // csv 파일을 row 단위로 순차적으로 읽어들일 때
    d3.csv(populationCSV, (data) => {
      // 각 row 에서 year, population 값을 object에 저장
      const item = {
        year: parseInt(data.year, 10),
        population: parseInt(data.population, 10),
      };
      // 데이터를 담은 object를 배열에 추가
      populationData.push(item);
    }),
  );
});

// readCSV Promise가 정상적으로 마무리되면 실행
readCSV.then(() => {
  // x축(년도)의 최솟값, 최댓값, 그리고 y축(인구)의 최댓값을 구함
  const xMin = d3.min(populationData, d => d.year);
  const xMax = d3.max(populationData, d => d.year);
  const yMax = d3.max(populationData, d => d.population);

  // x축, y축의 스케일
  const xScale = d3
    .scaleLinear() // 선형 스케일
    .domain([xMin, xMax]) // 축의 최솟값과 최댓값
    .range([0, size.width - size.margin]); // 축의 길이

  const yScale = d3
    .scaleLinear()
    .domain([10000000, yMax])
    .range([size.height - size.margin, size.margin]);

  // x축, y축
  // tick: 눈금 옵션
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  const yAxis = d3.axisLeft(yScale).ticks(10);

  // 그래프 라인
  const line = d3
    .line()
    .x(d => xScale(d.year)) // x 좌표값은 year 사용
    .y(d => yScale(d.population)) // y 좌표값은 population 사용
    .curve(d3.curveMonotoneX); // 라인을 부드럽게 처리

  // 캔버스 역할을 하는 svg 삽입하고 너비, 높이 지정
  const svgGraphic = d3
    .select('#chart')
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  // DOM 위에 x축 그리기
  svgGraphic
    .append('g')
    .attr('class', 'x-axis')
    .attr(
      'transform',
      `translate(${size.margin}, ${size.height - size.margin})`,
    )
    .call(xAxis);

  // DOM 위에 y축 그리기
  svgGraphic
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${size.margin}, 0)`)
    .call(yAxis);

  // DOM 위에 line 그리기
  svgGraphic
    .append('path')
    .datum(populationData)
    .attr('class', 'line')
    .attr('transform', `translate(${size.margin}, 0)`)
    .attr('d', line);
});

// 굵기 값 변수 지정
let thicknessValue = 1;
// 증가 버튼, 감소 버튼 DOM
const increaseBtn = document.getElementById('increase');
const decreaseBtn = document.getElementById('decrease');

// 증가 버튼 이벤트 리스너
increaseBtn.addEventListener('click', () => {
  const line = document.getElementsByClassName('line')[0];
  // 굵기 값을 1 증가시킨 뒤 line 객체에 적용
  thicknessValue += 1;
  line.style.strokeWidth = thicknessValue;
});

// 감소 버튼 이벤트 리스너
decreaseBtn.addEventListener('click', () => {
  const line = document.getElementsByClassName('line')[0];
  if (thicknessValue === 1) {
    // 조건문: 굵기 값이 1이면 더 이상 굵기를 줄일 수 없다는 경고
    thicknessValue = 1;
    alert('최소 굵기입니다.');
  } else {
    // 굵기 값이 1보다 크면 1 갑소시킨 뒤 line 객체에 적용
    thicknessValue -= 1;
  }
  line.style.strokeWidth = thicknessValue;
});
