d3.csv('data/data_pivot.csv', function (error, data) {

  if (error) throw error;

  initializeChart(data);

});

function initializeChart(data) {
  // create new chart using Chart constructor
  const chart = new areaChart({
    element: document.querySelector('.container'),
    data: data
  });
}
