// vairables
let currentQuestion = 1;
let totalQuestions = 3;
const moviesArray = {};
// Obtengo el elemento de la pregunta
const questionText = document.getElementById("question-text");
const movieCards = document.querySelectorAll(".movie-card");

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
      findMaxQuest([moviesArray]);
      // Generar los círculos dinámicamente
      updateProgressCircles(totalQuestions);
      formQuestions("quest1", "A");
      updateQuestion(1);
    })
    .catch((error) => console.error("Error loading the movie data:", error));
});

// Función para generar los spans dinámicamente
function updateProgressCircles(totalQuestions) {
  const circlesContainer = document.querySelector(".circles");
  const progressText = document.querySelector(".progress > span");

  // Limpiar los spans actuales (si hay)
  circlesContainer.innerHTML = "";

  // Generar los nuevos spans dinámicamente
  for (let i = 1; i <= totalQuestions; i++) {
    const span = document.createElement("span");
    span.id = `question${i}`;
    span.className = "circle";
    span.setAttribute("role", "listitem");
    span.setAttribute("aria-label", `Question ${i}`);
    span.setAttribute("tabindex", "0");
    circlesContainer.appendChild(span);
  }

  // Actualizar el texto de progreso
  progressText.textContent = `QUESTION 0 OF ${totalQuestions}:`;
}

// Funcion para inicializar progress questions (los circulos)
function formQuestions(questions, leterOption) {
  console.log("formQuestions ->", questions, moviesArray, leterOption);

  // Obtener todas las preguntas dinámicamente
  const questionElements = Array.from(
    document.querySelectorAll('[id^="question"]')
  ); // Selecciona elementos con IDs que comienzan con "question"

  // Extraer el número de la pregunta actual
  const match = questions.match(/^quest(\d+)/);
  if (!match) {
    console.error("Formato de pregunta inválido:", questions);
    return;
  }

  const currentQuestion = parseInt(match[1], 10); // Número de la pregunta actual

  // Desactivar todas las preguntas
  questionElements.forEach((el) => el.classList.remove("active"));

  // Activar la pregunta actual
  const currentQuestionElement = document.getElementById(
    `question${currentQuestion}`
  );
  if (currentQuestionElement) {
    currentQuestionElement.classList.add("active");
  } else {
    console.error(
      `No se encontró el elemento con ID: question${currentQuestion}`
    );
  }

  // Actualizar y cargar opciones de películas
  updateQuestion(currentQuestion);
  optionsMovie(questions, moviesArray, leterOption);

  // Enfocar la pregunta actual si es necesario
  const questionText = document.getElementById("questionText");
  if (questionText) {
    questionText.focus();
  }
}

// Funcion para actualizar el marcador de preguntas
function updateQuestion(current) {
  const questionSpan = document.querySelector(
    ".progress-container .progress > span"
  );
  questionSpan.textContent = `QUESTION ${current} OF ${totalQuestions}:`;
}

// Función para inicializar las imágenes
function optionsMovie(questions, movies, leterOption) {
  // Obtener las imágenes por su ID
  const movieA = document.getElementById("movieA").querySelector("img");
  const movieB = document.getElementById("movieB").querySelector("img");
  const movieC = document.getElementById("movieC").querySelector("img");
  // Obtengo el ID de las figcaption
  const figcaptionA = document
    .getElementById("movieA")
    .querySelector("figcaption");
  const figcaptionB = document
    .getElementById("movieB")
    .querySelector("figcaption");
  const figcaptionC = document
    .getElementById("movieC")
    .querySelector("figcaption");

  if (currentQuestion !== totalQuestions) {
    // valido si desactivo algun opcion por falta de ruta
    followStep(currentQuestion, movies, movieCards);
  }

  // Obtener las películas correspondientes al grupo de preguntas
  const moviesToLoad = movies[`${questions}_${leterOption}`].options;
  // Obtengo la pregunta
  const question = movies[`${questions}_${leterOption}`].question;
  // Verificar si moviesToLoad está definido
  if (!moviesToLoad) {
    console.error(
      `No se encontraron películas para la clave: ${questions}_${leterOption}`
    );
    // Prevengo que el error rompa el flujo del programa
    currentQuestion--;
    formQuestions(`quest${currentQuestion}`, leterOption);
    movieCards.forEach((card) => card.classList.remove("fade-out"));
    questionText.classList.remove("fade-out");
    return;
  }

  setTimeout(() => {
    // Asignar la pregunta al elemento HTML
    questionText.textContent = question;
    // Asignar las imágenes y textos alternativos a cada película
    movieA.src = moviesToLoad[0].img;
    movieA.alt = moviesToLoad[0].img_alt;
    figcaptionA.textContent = moviesToLoad[0].img_alt;

    movieB.src = moviesToLoad[1].img;
    movieB.alt = moviesToLoad[1].img_alt;
    figcaptionB.textContent = moviesToLoad[1].img_alt;

    movieC.src = moviesToLoad[2].img;
    movieC.alt = moviesToLoad[2].img_alt;
    figcaptionC.textContent = moviesToLoad[2].img_alt;

    movieCards.forEach((card) => card.classList.remove("fade-out"));
    questionText.classList.remove("fade-out");
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
  movieCards.forEach((card) => {
    if (card.classList.contains("disable")) {
      card.classList.remove("disable"); // Elimina la clase disable
    }
  });
  console.log("Se ha eliminado la clase 'disable' de todas las tarjetas.");
}

// Función pasar al siguiente grupo de preguntas/ movies
function nextGroup(idMovie) {
  // Llamar a la función para limpiar las clases 'disable'
  resetDisableState();

  // Incrementar el número de la pregunta actual
  currentQuestion++;

  // Si es el ultimo paso
  if (currentQuestion === totalQuestions + 1) {
    // paso a la siguiente pantalla intercambiando el article
    toggleArticles();
    console.log("currentQuestion", currentQuestion);
    console.log("totalQuestions", totalQuestions);
  }

  // Agrego la class fade-out a .movie-card
  movieCards.forEach((card) => card.classList.add("fade-out"));
  // Agrego la class fede-aut a questionText
  questionText.classList.add("fade-out");
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

function toggleArticles() {
  // Seleccionamos los artículos usando sus IDs
  const quizArticle = document.getElementById("quiz-article");
  const promoArticle = document.getElementById("promo-article");

  // Verificamos si los elementos existen
  if (quizArticle) {
    quizArticle.style.animation = "fadeOutScale 0.3s ease-in-out forwards";

    setTimeout(() => {
      quizArticle.classList.add("off");
    }, 300); // Duración coincide con la animación (0.3s)
  } else {
    console.error("No se encontró el elemento con id 'quiz-article'");
  }

  if (promoArticle) {
    setTimeout(() => {
      promoArticle.classList.remove("off");
    }, 300);
    // Agrega la animación de entrada
    promoArticle.style.animation = "fadeInScale 0.5s ease-in-out forwards";
  } else {
    console.error("No se encontró el elemento con id 'promo-article'");
  }
}

// Obtengo el numero de preguntas y las guardo en una variable
function findMaxQuest(data) {
  let maxValue = 0;
  data.forEach((item) => {
    Object.keys(item).forEach((key) => {
      // Verificamos si la clave coincide con el patrón questN (ignorando sufijos como _A)
      const match = key.match(/^quest(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        maxValue = Math.max(maxValue, num);
      }
    });
  });
  console.log("maxValue", maxValue);
  totalQuestions = maxValue;
}

// Seleccionamos todas las imágenes dentro de .movie-card
document.querySelectorAll(".movie-card").forEach((figure) => {
  // Función para manejar el clic y la tecla Enter
  const handleAction = () => {
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
  };

  // Escuchar el evento de clic en cada tarjeta de película
  figure.addEventListener("click", handleAction);

  // Escuchar el evento de tecla en cada tarjeta de película
  figure.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleAction();
    }
  });
});
