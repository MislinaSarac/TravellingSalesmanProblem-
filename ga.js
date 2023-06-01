function calculateFitness() {
  var currentRecord = Infinity;
  for (var i = 0; i < population.length; i++) {
    var d = calcDistance(cities, population[i]);
    if (d < recordDistance) {
      recordDistance = d;
      bestEver = population[i];
    }
    if (d < currentRecord) {
      currentRecord = d;
      currentBest = population[i];
    }
    fitness[i] = 1 / (Math.pow(d, 8) + 1);
  }
}

function normalizeFitness() {
  var sum = fitness.reduce((a, b) => a + b, 0);
  for (var i = 0; i < fitness.length; i++) {
    fitness[i] /= sum;
  }
}

function nextGeneration() {
  var newPopulation = [];
  for (var i = 0; i < population.length; i++) {
    var orderA = pickOne(population, fitness);
    var orderB = pickOne(population, fitness);
    var order = crossOver(orderA, orderB);
    mutate(order, 0.01);
    newPopulation[i] = order;
  }
  population = newPopulation;
}

function pickOne(list, prob) {
  var r = Math.random();
  var index = 0;
  while (r > 0) {
    r -= prob[index];
    index++;
  }
  index--;
  return list[index].slice();
}

function crossOver(orderA, orderB) {
  var start = Math.floor(Math.random() * orderA.length);
  var end = Math.floor(Math.random() * (orderA.length - start)) + start;
  var newOrder = orderA.slice(start, end);
  for (var i = 0; i < orderB.length; i++) {
    var city = orderB[i];
    if (!newOrder.includes(city)) {
      newOrder.push(city);
    }
  }
  return newOrder;
}

function mutate(order, mutationRate) {
  for (var i = 0; i < totalCities; i++) {
    if (Math.random() < mutationRate) {
      var indexA = Math.floor(Math.random() * order.length);
      var indexB = (indexA + 1) % totalCities;
      swap(order, indexA, indexB);
    }
  }
}

function swap(arr, i, j) {
  var temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
