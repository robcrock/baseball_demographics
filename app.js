d3.csv('data.csv', function (error, data) {
  if (error) throw error;

////////////////////////////////////////////////////////////////////////////////
// PROCESS THE DATA TO MATCH OUR AREA CHART
// http://d3-wiki.readthedocs.io/zh_CN/master/Stack-Layout/

  // Start by sorting our data so the lines look right
  data.sort((a, b) => {
    return a.year - b.year;
  })

  // Convert our data into the proper data types
  const baseballDemographics = data.map(function (d) {
    return {
      ethnicity: d.ethnicity,
      year: new Date(d.year),
      percent_of_players: +d.of_players
    };
  });

  // We need keys for each demographic
  const layers = d3.nest()
    .key(d => d.ethnicity)
    .entries(baseballDemographics);

  // Remove the redundant ethnicity from our values
  layers.forEach(function(layer) {
    layer.values.forEach(function(year) {
      delete year.ethnicity;
    })
  })

  initializeAreaChart(layers);

});

function initializeAreaChart(data) {
  // create new chart using Chart constructor
  const chart = new Chart({
    element: document.querySelector('.chart-container'),
    data: data
  });
  // redraw chart on each resize
  // in a real-world example, it might be worth ‘throttling’ this
  // more info: http://sampsonblog.com/749/simple-throttle-function
  d3.select(window).on('resize', () => chart.draw());
}