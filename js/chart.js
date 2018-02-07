class Chart {

  constructor(opts) {
    // load in arguments from config object
    this.data = opts.data;
    this.keys = opts.keys;
    this.layers = opts.layers;
    this.element = opts.element;
    // create the chart
    this.draw();
  }
 
  draw() {
    // define width, height and margin
    this.width = 925; // this.element.offsetWidth;
    this.height = 700; // this.width / 2;
    this.margin = {
      top: 10,
      right: 5,
      bottom: 45,
      left: 50
    };
    this.innerHeight = this.height - (this.margin.top + this.margin.bottom);
    this.innerWidth = this.width - (this.margin.right + this.margin.left);

    // set up parent element and SVG
    // this.element.innerHTML = '';
    const svg = d3.select(this.element).append('svg');
    svg.attr('width', this.width);
    svg.attr('height', this.height);

    // we'll actually be appending to a <g> element
    this.plot = svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Compute the stacked data.
    this.stacked = d3.stack().keys(this.keys)(this.data);

    // create the other stuff
    this.createScales();
    this.addAxes();
    this.addArea();
    // this.addLabels();
  }

  createScales() {
    // shorthand to save typing later
    const m = this.margin;

    // calculate max and min for data
    const xExtent = d3.extent(this.data, d => d.year);
    const yExtent = [
      d3.min(this.stacked, series => d3.min(series, d => d[0])),
      d3.max(this.stacked, series => d3.max(series, d => d[1]))
    ];

    this.xScale = d3.scaleTime()
      .range([0, this.innerWidth - m.right])
      .domain(xExtent);

    this.yScale = d3.scaleLinear()
      .range([this.innerHeight - (m.top + m.bottom), 0])
      .domain(yExtent);

    // Colors Ann Jackson used
    // [
    //   White '#A7ACB4',
    //   Asian '#CBDB97',
    //   Latino '#FD7F8B',
    //   African American '#78D9D5',
    //   Non-white '#F8D06D'
    // ]
    this.colorScale = d3.scaleOrdinal(['#A7ACB4', '#CBDB97', '#FD7F8B', '#78D9D5', '#F8D06D']);

  }

  addAxes() {
    const m = this.margin;

    // Ticks should be #666666

    // create and append axis elements
    // this is all pretty straightforward D3 stuff
    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .ticks(10)
      .tickSize('9');

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickValues([0, .25, .5, .75, 1])
      .tickFormat(d3.format(",.0%"))
      .tickSize('9');

    this.plot.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.innerHeight - (m.top + m.bottom) - 5})`)
      .call(xAxis);

    // Add x-axis title
    d3.select('.x.axis').append('text')
      .attr('x', this.innerWidth / 2)
      .attr('y', 40)
      .text('YEARS')
      .style('fill', '#333333')
      .style('font-size', '14px');

    this.plot.append("g")
      .attr("class", "y axis")
      .attr("transform", 'translate(5, 0)')
      .call(yAxis)

    // A y-axis title
    d3.select('.y.axis').append('text')
      .attr('x', -this.innerHeight / 2 + 25)
      .attr('y', -45)
      .attr('transform', `rotate(-90 0 0)`)
      .text('DEMOGRAPHIC MIX')
      .style('text-anchor', 'middle')
      .style('fill', '#333333')
      .style('font-size', '14px');
  }

  addArea() {
    const stackArea = d3.area()
      .x(d => this.xScale(d.data.year))
      .y0(d => this.yScale(d[0]))
      .y1(d => this.yScale(d[1]));

    this.plot.selectAll('.area')
      .data(this.stacked)
      .enter().append('path')
        .attr('class', 'area')
        .attr('fill', d => this.colorScale(d.key))
        .attr('d', stackArea);

    console.log(this.stacked);

    const labels = this.plot.selectAll('.area-label')
      .data(this.stacked)

    console.log(labels);

    labels
      .enter().append('text')
      .attr('class', 'area-label')
      .merge(labels)
      .text(d => d.key)
      .attr('transform', d3.areaLabel(stackArea))
  }

  // addLabels() {
  //   const labels = this.plot.selectAll('text').data(this.stacked)

  //   labels
  //     .enter().append('text')
  //     .attr('class', 'area-label')
  //     .merge(labels)
  //     .text(d => d.key)
  //     .attr('transform', d3.areaLabel(stackArea))
  // }
}
