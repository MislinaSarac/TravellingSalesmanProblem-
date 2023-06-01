let cities = [];
const totalCities = 12;

const popSize = 500;
let population = [];
let fitness = [];

let recordDistance = Infinity;
let bestEver;
let currentBest;

let statusP;

function setup() {
  createCanvas(600, 600);
  let order = Array.from({ length: totalCities }, (_, i) => i);

  for (let i = 0; i < totalCities; i++) {
    let v = createVector(random(width), random(height / 2));
    cities[i] = v;
  }

  for (let i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }
  statusP = createP("").style("font-size", "32pt");
}

function draw() {
  background(0);

  // GA
  calculateFitness();
  normalizeFitness();
  nextGeneration();

  stroke(255);
  strokeWeight(4);
  noFill();
  beginShape();
  for (let i = 0; i < bestEver.length; i++) {
    let n = bestEver[i];
    vertex(cities[n].x, cities[n].y);
    ellipse(cities[n].x, cities[n].y, 16, 16);
  }
  endShape();

  translate(0, height / 2);
}

function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}

function calcDistance(points, order) {
  let sum = 0;
  for (let i = 0; i < order.length - 1; i++) {
    let cityA = points[order[i]];
    let cityB = points[order[i + 1]];
    let d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}
