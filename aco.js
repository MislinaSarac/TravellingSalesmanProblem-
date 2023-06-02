class Ant {
  constructor(numCities, alpha, beta) {
    this.numCities = numCities;
    this.alpha = alpha; // Alfa parametresi, pheromone izinin etkisini kontrol eder 
    this.beta = beta; // Beta parametresi sezgisel bilginin etkisini kontrol eder
    this.tour = []; // Mevcut tur
    this.visited = new Array(numCities).fill(false); // Ziyaret edilen şehirleri takip etmek için dizi
    this.currentIndex = 0; // Mevcut şehir dizini
  }

  selectNextCity(pheromone, distance) {
    let currentCity = this.currentIndex;
    let sum = 0;
    let probabilities = new Array(this.numCities).fill(0);

    // Ziyartet edilmemiş her sehri seçme olasılıkları
    for (let i = 0; i < this.numCities; i++) {
      if (!this.visited[i]) {
        probabilities[i] =
          Math.pow(pheromone[currentCity][i], this.alpha) *
          Math.pow(1 / distance[currentCity][i], this.beta);
        sum += probabilities[i];
      }
    }

    //Bisonraki şehri seçme
    let random = Math.random() * sum;
    let nextCity = -1;
    let cumulative = 0;
    for (let i = 0; i < this.numCities; i++) {
      if (!this.visited[i]) {
        cumulative += probabilities[i];
        if (cumulative >= random) {
          nextCity = i;
          break;
        }
      }
    }

    this.tour.push(nextCity);
    this.visited[nextCity] = true;
    this.currentIndex = nextCity;
  }
  //Şehirler arası mesafeyi inceler
  calculateTourLength(distance) {
    let tourLength = 0;
    for (let i = 0; i < this.numCities - 1; i++) {
      let cityA = this.tour[i];
      let cityB = this.tour[i + 1];
      tourLength += distance[cityA][cityB];
    }
    tourLength += distance[this.tour[this.numCities - 1]][this.tour[0]]; // Başlangıc şehrine döner
    return tourLength;
  }
}

class AntColonyOptimizer {
  constructor(numCities, numAnts, alpha, beta, rho, Q) {
    this.numCities = numCities;
    this.numAnts = numAnts;
    this.alpha = alpha; //Alfa parametresi, pheromone izinin etkisini kontrol eder
    this.beta = beta; //Beta parametresi sezgisel bilginin etkisini kontrol eder
    this.rho = rho; // Rho parametresi, pheromone buharlaşma oranını kontrol eder
    this.Q = Q; // Q parametre biriken pheromone miktarını kontrol eder
    this.pheromone = new Array(numCities)
      .fill(0)
      .map(() => new Array(numCities).fill(1)); // İlk pheromone seviyesi
  }

  optimize(distance, maxIterations) {
    let bestTour = null;
    let bestTourLength = Infinity;

    for (let iter = 0; iter < maxIterations; iter++) {
      let ants = [];
      for (let antIndex = 0; antIndex < this.numAnts; antIndex++) {
        let ant = new Ant(this.numCities, this.alpha, this.beta);
        ants.push(ant);
      }

      for (let ant of ants) {
        ant.tour.push(Math.floor(Math.random() * this.numCities)); // Random başlangıç seçimi
        ant.visited[ant.tour[0]] = true;
        ant.currentIndex = ant.tour[0];

        for (let i = 0; i < this.numCities - 1; i++) {
          ant.selectNextCity(this.pheromone, distance);
        }

        let tourLength = ant.calculateTourLength(distance);
        if (tourLength < bestTourLength) {
          bestTourLength = tourLength;
          bestTour = ant.tour.slice();
        }
      }

      // Pheromone seviyelerini güncelleme
      for (let i = 0; i < this.numCities; i++) {
        for (let j = 0; j < this.numCities; j++) {
          if (i !== j) {
            this.pheromone[i][j] *= 1 - this.rho;
            this.pheromone[i][j] = Math.max(this.pheromone[i][j], 0.0001);

            for (let ant of ants) {
              if (ant.tour.includes(i) && ant.tour.includes(j)) {
                this.pheromone[i][j] +=
                  this.Q / ant.calculateTourLength(distance);
              }
            }
          }
        }
      }
    }

    return {
      bestTour: bestTour,
      bestTourLength: bestTourLength,
    };
  }
}

//örnek
const numCities = 10;
const numAnts = 20;
const alpha = 1;
const beta = 2;
const rho = 0.1;
const Q = 1;
const maxIterations = 100;

//Random disctance matris oluşturma
let distance = new Array(numCities)
  .fill(0)
  .map(() => new Array(numCities).fill(0));
for (let i = 0; i < numCities; i++) {
  for (let j = 0; j < numCities; j++) {
    if (i !== j) {
      distance[i][j] = Math.random() * 100 + 1; // Random mesafe 1 ve 100 arası
    }
  }
}

let optimizer = new AntColonyOptimizer(numCities, numAnts, alpha, beta, rho, Q);
let result = optimizer.optimize(distance, maxIterations);

console.log("Best tour:", result.bestTour);
console.log("Best tour length:", result.bestTourLength);
