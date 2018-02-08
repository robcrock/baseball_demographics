d3.csv('data/data_pivot.csv', function (error, data) {

  if (error) throw error;

  const keys = ['White', 'Asian', 'Latino', 'African American'];

  initializeChart(data, keys);

});

function initializeChart(data, keys) {
  // create new chart using Chart constructor
  const chart = new areaChart({
    element: document.querySelector('.container'),
    data: data,
    keys: keys
  });
}
