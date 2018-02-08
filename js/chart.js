class areaChart {

  constructor(opts) {

    // load in arguments from config object
    this.element = opts.element;
    this.data = opts.data;

    // create the chart
    this.draw();

  }
 
  draw() {

    // define width, height and margin
    this.width = 800; // this.element.offsetWidth;
    this.height = 600; // this.width / 2;
    this.margin = {
      top: 10,
      right: 5,
      bottom: 45,
      left: 55
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

    // We need to create an array of keys for the
    // stack data structure
    // console.log(Object.keys(this.data[0]).slice(1));
    this.keyArray = Object.keys(this.data[0]).slice(1);
    

    // Compute the series data.
    const stack = d3.stack()
      .keys(this.keyArray);

    this.series = stack(this.data);

    // create the other stuff
    this.createScales();
    this.addAxes();
    this.addArea();
    this.addLabels();
    this.addHighlightBar();
    // this.addHighlightText();

  }

  createScales() {
    // shorthand to save typing later
    const m = this.margin;

    // calculate max and min for data
    const xExtent = d3.extent(this.data, d => d.year);
    const yExtent = [
      d3.min(this.series, series => d3.min(series, d => d[0])),
      d3.max(this.series, series => d3.max(series, d => d[1]))
    ];

    this.xScale = d3.scaleLinear()
      .range([0, this.innerWidth - m.right])
      .domain(xExtent);

    this.yScale = d3.scaleLinear()
      .range([this.innerHeight - (m.top + m.bottom), 0])
      .domain(yExtent);

    this.areaColorScale = d3.scaleOrdinal([
      '#D3D5D9',
      '#CBDB97',
      '#FEBFC5',
      '#BFDFDE',
      '#FBE7B6'
    ]);

    this.textColorScale = d3.scaleOrdinal([
      '#A7ACB4',
      '#909C6B',
      '#FD7F8B',
      '#78D9D5',
      '#F8D06D'
    ]);

  }

  addAxes() {

    const m = this.margin;

    // create and append axis elements
    // this is all pretty straightforward D3 stuff
    const xAxis = d3.axisBottom()
      .scale(this.xScale)
      .ticks(10)
      .tickFormat(d3.format(''));

    const yAxis = d3.axisLeft()
      .scale(this.yScale)
      .tickValues([0, .25, .5, .75, 1])
      .tickFormat(d3.format(",.0%"));

    // Add x-axis ticks
    this.plot.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${this.innerHeight - (m.top + m.bottom) - 5})`)
      .call(xAxis);

    // Add x-axis title
    d3.select('.x.axis').append('text')
      .attr('x', this.innerWidth / 2)
      .attr('y', 40)
      .text('YEARS')
      .style('text-anchor', 'middle');

    // Add y-axis ticks
    this.plot.append("g")
      .attr("class", "y axis")
      .attr("transform", 'translate(5, 0)')
      .call(yAxis)

    // Add y-axis title
    d3.select('.y.axis').append('text')
      .attr('x', -this.innerHeight / 2 + 25)
      .attr('y', -50)
      .attr('transform', `rotate(-90 0 0)`)
      .text('DEMOGRAPHIC MIX')
      .style('text-anchor', 'middle');

  }

  addArea() {

    const xDimension = Object.keys(this.data[0])[0];

    this.stackArea = d3.area()
      .x(d => this.xScale(d.data[xDimension]))
      .y0(d => this.yScale(d[0]))
      .y1(d => this.yScale(d[1]));

    this.plot.selectAll('.area')
      .data(this.series)
      .enter().append('path')
        .attr('class', 'area')
        .attr('fill', d => this.areaColorScale(d.key))
        .attr('d', this.stackArea);

  }

  addLabels() {

    const labels = this.plot.selectAll('.area-label')
      .data(this.series)

    labels
        .enter().append('text')
        .attr('class', 'area-label')
        .merge(labels)
        .text(d => d.key)
        .style('fill', d => this.textColorScale(d.key))
        .attr('transform', d3.areaLabel(this.stackArea))
  }

  addHighlightBar() {
    // Interact!
    this.plot.selectAll('.area,.area-label')
      .on('mousemove', () => {
        const mouseCoordinates = d3.mouse(this.plot.node());
        const mouseX = mouseCoordinates[0];
        const key = Math.round(this.xScale.invert(mouseX));
        const columnScale = d3.scaleLinear()
          .domain([1947, 2016])
          .range([0, 69]);

        // Filter to only the position under our mouse
        let column = []
        this.series.map(function(series) {
          series.forEach(function(entry, i) {
            if (i === columnScale(key)) {
              column.push(entry);
            }
          });
        });

        const highlightBars = this.plot.selectAll('.highlight')
          .data(column);

        const highlightBarsEnter = highlightBars.enter().append('rect')
          .attr('class', 'highlight')
          .style('pointer-events', 'none');

        highlightBars.merge(highlightBarsEnter)
          .attr('x', this.xScale(key))
          .attr('y', d => this.yScale(d[1]))
          .attr('width', this.innerWidth / (this.xScale.domain()[1] - this.xScale.domain()[0]))
          .attr('height', d => this.yScale(d[0]) - this.yScale(d[1]))
          .attr('fill', (d,i) => this.textColorScale(this.keyArray[i]));

      })
      .on('mouseout', () => {
        this.plot.selectAll('.highlight').remove();
      });
  }

  addHighlightText() {
    // Interact!
    this.plot.selectAll('.area,.area-label')

    .on('mousemove', () => {
      const mouseCoordinates = d3.mouse(this.plot.node());
      const mouseX = mouseCoordinates[0];
      const key = Math.round(this.xScale.invert(mouseX));
      const columnScale = d3.scaleLinear()
        .domain([1947, 2016])
        .range([0, 69]);

      // Filter to only the position under our mouse
      let column = []
      this.series.map(function (series) {
        series.forEach(function (entry, i) {
          if (i === columnScale(key)) {
            column.push(entry);
          }
        });
      });

      // WFT Why can't I see the text? It's an element in the DOM
      // but I can see the text on show up on the screen. Am I blind?
      const highlightText = this.plot.selectAll('.highlightText')
        .data(column);

      const highlightTextEnter = highlightText.enter().append('text')
        .attr('class', 'highlightText')
        .style('pointer-events', 'none');

      highlightText.merge(highlightTextEnter)
        .attr('x', this.xScale(key))
        .attr('y', d => (this.yScale(d[0]) - this.yScale(d[1])) / 2);

    })
    .on('mouseout', () => {
      this.plot.selectAll('.highlightText').remove();
    });
  }

}
