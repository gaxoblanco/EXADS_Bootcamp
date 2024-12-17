// vairables
let currentQuestion = 1;
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
  const totalQuestions = 3;
  const questionSpan = document.querySelector(
    ".progress-container .progress > span"
  );
  questionSpan.textContent = `QUESTION ${current} OF ${totalQuestions}:`;
}

// Funcion para inicializar progress questions
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
  // Obtener las imágenes por su ID
  const movie1 = document.getElementById("movie1");
  const movie2 = document.getElementById("movie2");
  const movie3 = document.getElementById("movie3");

  // Obtener las películas correspondientes al grupo de preguntas
  const moviesToLoad = movies[`${questions}_${leterOption}`];

  // Verificar si moviesToLoad está definido
  if (!moviesToLoad) {
    console.error(
      `No se encontraron películas para la clave: ${questions}_${leterOption}`
    );
    return;
  }

  // Asignar las imágenes y textos alternativos a cada película
  movie1.src = moviesToLoad[0].img;
  movie1.alt = moviesToLoad[0].img_alt;

  movie2.src = moviesToLoad[1].img;
  movie2.alt = moviesToLoad[1].img_alt;

  movie3.src = moviesToLoad[2].img;
  movie3.alt = moviesToLoad[2].img_alt;
}

// Función pasar al siguiente grupo de preguntas/ movies
function nextGroup(idMovie) {
  console.log("idMovie", idMovie);

  currentQuestion++;
  console.log("currentQ", currentQuestion);

  // Uso un switch case para cada pregunta, usando idMovie para resolver que grupo de asignar
  switch (idMovie) {
    case "movie1":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "A");
      console.log("idmovie, currentQuestion", idMovie, currentQuestion);

      break;
    case "movie2":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "B");
      console.log("idmovie, currentQuestion", idMovie, currentQuestion);
      break;
    case "movie3":
      // Llamo a la siguiente pregunta
      formQuestions(`quest${currentQuestion}`, "C");
      break;
    default:
      // error por defecto
      console.error("Error loading the movie data:", error);

      break;
  }
}

// Seleccionamos todas las imágenes dentro de .movie-card
document.querySelectorAll(".movie-card img").forEach((img) => {
  img.addEventListener("click", (event) => {
    // Obtener el valor del atributo alt de la imagen clickeada
    const movieAlt = event.target.id;

    // Llamar a la función nextGroup con el valor del alt y el id actual de la imagen
    nextGroup(movieAlt);
  });
});
