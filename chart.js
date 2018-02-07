class Chart {

  constructor(opts) {
    // load in arguments from config object
    console.log(opts);
    this.data = opts.data;
    this.keys = opts.keys;
    this.layers = opts.layers;
    this.element = opts.element;
    // create the chart
    this.draw();
  }

  draw() {
    // define width, height and margin
    this.width = this.element.offsetWidth;
    this.height = this.width / 2;
    this.margin = {
      top: 20,
      right: 75,
      bottom: 45,
      left: 50
    };
    this.innerHeight = this.height - (this.margin.top + this.margin.bottom);
    this.innerWidth = this.width - (this.margin.right + this.margin.left);

    // set up parent element and SVG
    this.element.innerHTML = '';
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

    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  }

  addAxes() {
    const m = this.margin;

    // create and append axis elements
    // this is all pretty straightforward D3 stuff
    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .ticks(10);

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickFormat(d3.format(",.0%"));

    this.plot.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.innerHeight - (m.top + m.bottom)})`)
      .call(xAxis);

    // Add x-axis title
    d3.select('.x.axis').append('text')
      .attr('x', this.width / 2)
      .attr('y', 40)
      .text('Years')
      .style('fill', '#666666')
      .style('font-size', '14px');

    this.plot.append("g")
      .attr("class", "y axis")
      .call(yAxis)

    // A y-axis title
    d3.select('.y.axis').append('text')
      .attr('x', -this.innerHeight / 2)
      .attr('y', -35)
      .attr('transform', `rotate(-90 0 0)`)
      .text('Demographic Mix')
      .style('text-anchor', 'middle')
      .style('fill', '#666666')
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

  }
}
