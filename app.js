d3.csv('data.csv', function (error, data) {
  
  if (error) throw error;

  ///////////////////////////////////////////
  // PROCESS THE DATA TO MATCH OUR AREA CHART
  // https://github.com/d3/d3-shape#_stack

  // Start by sorting the years so the don't get jumbled
  data.sort((a, b) => {
    return +a.year - +b.year;
  })

  // Convert our data into the proper data types
  const baseballDemographics = data.map(function (d) {
    return {
      ethnicity: d.ethnicity,
      year: d.year,
      percent_of_players: +d.of_players
    };
  });

  // We need keys for each demographic
  const nested = d3.nest()
    .key(d => d.year)
    // d3.stack needs an array of keys for each year whos values
    // are an array of objects with ethnicity as the key and the
    // percentage its value.
    //
    // [{
    //    key: 1970,
    //    values: {
    //      white: .9,
    //      african-american: .05,
    //      asian: .3,
    //      latino: .02
    //    },...
    //  }]
    //
    .rollup(array => {
      const object = {};
      array.forEach(entry => {
        object[entry.ethnicity] = entry.percent_of_players;
      });
      return object;
    })
    .entries(baseballDemographics);

  // This could have been done programatically, but I am going
  // for a specific ordering of the layers, so I'll specify that // here.
  const keys = ['White', 'Asian', 'Latino', 'African American'];

  // Flatten the nested data structure into an
  // array of objects to pass this array into d3.stack.
  const stackable = nested.map(entry => {
    // We parse the year into a date here,
    // because if we do this earlier,
    // it gets converted to a String by d3.nest.
    entry.value.year = new Date(entry.key);
    // {
    //   year: new Date(...)
    //   Latino: 0.05,
    //   Asian: 0,
    //   African American: 0.052,
    //   White: 0.898,
    // }
    return entry.value;
  });

  initializeAreaChart(stackable, keys);

});

function initializeAreaChart(data, keys) {
  // create new chart using Chart constructor
  const chart = new Chart({
    element: document.querySelector('.chart-container'),
    data: data,
    keys: keys
  });
  // redraw chart on each resize
  // in a real-world example, it might be worth ‘throttling’ this
  // more info: http://sampsonblog.com/749/simple-throttle-function
  d3.select(window).on('resize', () => chart.draw());
}
