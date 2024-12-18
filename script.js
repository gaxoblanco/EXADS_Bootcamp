// vairables
let currentQuestion = 1;
const totalQuestions = 3;
const moviesArray = {};

// funciona igual que un fech a una API
document.addEventListener("DOMContentLoaded", () => {
  // Cargar el archivo JSON que contiene los datos de las películas
  fetch("movies.json")
    .then((response) => response.json()) // Convertir la respuesta en formato JSON
    .then((data) => {
      // Guardar los datos en la variable data
      Object.assign(moviesArray, data);
      // Inicializar las imágenes en el HTML con los datos del JSON
      // initializeMovies(data);
      formQuestions("quest1", "A");
      updateQuestion(1);
    })
    .catch((error) => console.error("Error loading the movie data:", error));
});

// Funcion para actualizar el marcador de preguntas
function updateQuestion(current) {
  const questionSpan = document.querySelector(
    ".progress-container .progress > span"
  );
  questionSpan.textContent = `QUESTION ${current} OF ${totalQuestions}:`;
}

// Funcion para inicializar progress questions (los circulos)
function formQuestions(questions, leterOption) {
  console.log("formQuestions ->", questions, moviesArray, leterOption);
  // Obtener las preguntas por su ID
  const question1 = document.getElementById("question1");
  // Obtener las preguntas por su ID
  const question2 = document.getElementById("question2");
  // Obtener las preguntas por su ID
  const question3 = document.getElementById("question3");

  // switch case para cada pregunta
  switch (questions) {
    case "quest1":
      // Le agrego la class active
      question1.classList.add("active");
      // Cargo las preguntas/ movies
      optionsMovie(questions, moviesArray, leterOption);
      console.log("quest 1 active");

      break;
    case "quest2":
      // Le quito la class active
      question1.classList.remove("active");
      // Le agrego la class active
      question2.classList.add("active");
      updateQuestion(2);
      // Cargo las preguntas/ movies
      optionsMovie(questions, moviesArray, leterOption);
      console.log("quest 2 active");
      break;
    case "quest3":
      // Le quito la class active
      question2.classList.remove("active");
      // Le agrego la class active
      question3.classList.add("active");
      updateQuestion(3);
      // Cargo las preguntas/ movies
      optionsMovie(questions, moviesArray, leterOption);
      break;

    default:
      break;
  }
}

// Función para inicializar las imágenes
function optionsMovie(questions, movies, leterOption) {
  const movieCards = document.querySelectorAll(".movie-card");
  // Obtener las imágenes por su ID
  const movieA = document.getElementById("movieA").querySelector("img");
  const movieB = document.getElementById("movieB").querySelector("img");
  const movieC = document.getElementById("movieC").querySelector("img");

  if (currentQuestion !== totalQuestions) {
    // valido si desactivo algun opcion por falta de ruta
    followStep(currentQuestion, movies, movieCards);
  }

  // Obtener las películas correspondientes al grupo de preguntas
  const moviesToLoad = movies[`${questions}_${leterOption}`];
  // Verificar si moviesToLoad está definido
  if (!moviesToLoad) {
    console.error(
      `No se encontraron películas para la clave: ${questions}_${leterOption}`
    );
    currentQuestion--;
    // updateQuestion(currentQuestion);
    formQuestions(`quest${currentQuestion}`, leterOption);
    movieCards.forEach((card) => card.classList.remove("fade-out"));
    return;
  }

  setTimeout(() => {
    // Asignar las imágenes y textos alternativos a cada película
    movieA.src = moviesToLoad[0].img;
    movieA.alt = moviesToLoad[0].img_alt;

    movieB.src = moviesToLoad[1].img;
    movieB.alt = moviesToLoad[1].img_alt;

    movieC.src = moviesToLoad[2].img;
    movieC.alt = moviesToLoad[2].img_alt;

    movieCards.forEach((card) => card.classList.remove("fade-out"));
  }, 800);
}

// Buscar si la pregunta tiene una siguiente opción
function followStep(currentQuestion, movies, movieCards) {
  // Definir las letras posibles para validar (A, B, C)
  const options = ["A", "B", "C"];
  // Buscar si existe una opción para la siguiente pregunta
  options.forEach((option) => {
    // nextKey == a la siguiente pregunta del grupo option
    const nextKey = `quest${currentQuestion + 1}_${option}`;
    const nextMovies = movies[nextKey];

    if (!nextMovies) {
      console.log(`No hay opciones para la clave: ${nextKey}`);
      // Al caso de que no exista la ruta, deshabilito la opcion
      movieCards.forEach((card) => {
        if (card.id === `movie${option}`) {
          card.classList.add("disable");
        }
      });
    } else {
      console.log(`Existen opciones para la clave: ${nextKey}`);
    }
  });
}

// Función para quitar la clase 'disable' de todas las tarjetas
function resetDisableState() {
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((card) => {
    if (card.classList.contains("disable")) {
      card.classList.remove("disable"); // Elimina la clase disable
    }
  });
  console.log("Se ha eliminado la clase 'disable' de todas las tarjetas.");
}

// Función pasar al siguiente grupo de preguntas/ movies
function nextGroup(idMovie) {
  // Llamar a la función para quitar las clases 'disable'
  resetDisableState();

  // Incrementar el número de la pregunta actual
  currentQuestion++;

  // Agrego la class fade-out a .movie-card
  const movieCards = document.querySelectorAll(".movie-card");
  movieCards.forEach((card) => card.classList.add("fade-out"));
  // Uso un switch case para cada pregunta, usando idMovie para resolver que grupo de asignar
  switch (idMovie) {
    case "movieA":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "A");
      console.log("idmovie, currentQuestion", idMovie, currentQuestion);

      break;
    case "movieB":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "B");
      console.log("idmovie, currentQuestion", idMovie, currentQuestion);
      break;
    case "movieC":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "C");
      break;
    default:
      // error por defecto
      console.error("Error loading the movie data:", idMovie);

      break;
  }
}

// Seleccionamos todas las imágenes dentro de .movie-card
document.querySelectorAll(".movie-card").forEach((figure) => {
  // Escuchar el evento de clic en cada tarjeta de película
  figure.addEventListener("click", (event) => {
    // Obtener el ID de la tarjeta de película (figure)
    const movieId = figure.id;

    // Verificar si la tarjeta tiene la clase "disable"
    if (figure.classList.contains("disable")) {
      console.log(
        `La tarjeta ${movieId} está deshabilitada. No se puede hacer clic.`
      );
      return; // Salir si la tarjeta está deshabilitada
    }

    // Si no tiene la clase "disable", ejecutar la función nextGroup
    console.log(`Se hizo clic en la tarjeta ${movieId}`);
    nextGroup(movieId);
  });
});
