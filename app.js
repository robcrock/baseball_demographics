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
      year: d.year,
      percent_of_players: +d.of_players
    };
  });

  // We need keys for each demographic
  const nested = d3.nest()
    .key(d => d.year)

    // Nest gives us an array of entries for each year,
    // each entry corresponding to one ethnicity.
    // BUT, d3.stack needs to have an object instead,
    // where each ethnicity is key on the object,
    // and the percentage of is the value.
    // So, we need to convert these arrays to objects:
    .rollup(array => {
      const object = {};
      array.forEach(entry => {
        object[entry.ethnicity] = entry.percent_of_players;
      });
      return object;
    })
    
    // Another more concise but cryptic way to do the same rollup thing:
    // .rollup(array => array.reduce((object, entry) => {
    //   object[entry.ethnicity] = entry.percent_of_players;
    //   return object;
    // }, {}))

    .entries(baseballDemographics);

  // Determine the set of ethnicities.
  const keys = Object.keys(nested[0].value);

  // Flatten the nested data structure into an
  // array of objects, one object for each year,
  // so we can pass this array into d3.stack.
  const stackable = nested.map(entry => {

    // We parse the year into a date here,
    // because if we do this earlier,
    // it gets converted from a Date to a String by d3.nest.
    entry.value.year = new Date(entry.key);

    // Each of these objects looks something like this:
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
