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
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Guardar los datos en la variable data
      Object.assign(moviesArray, data);
      // Inicializar las imágenes en el HTML con los datos del JSON
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
  // console.log("formQuestions ->", questions, moviesArray, leterOption);

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

// Funcion para cargar las opciones de las peliculas
function optionsMovie(questions, movies, leterOption) {
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
  // Asignar la pregunta al elemento HTML
  questionText.textContent = question;

  // Limpiar el contenedor de películas antes de agregar nuevas
  const moviesContainer = document.querySelector(".movies-container");
  moviesContainer.innerHTML = "";

  setTimeout(() => {
    // Iterar sobre cada película en moviesToLoad
    moviesToLoad.forEach((movie, index) => {
      // Crear el elemento figure
      const movieCard = document.createElement("figure");
      movieCard.id = `movie${String.fromCharCode(65 + index)}`;
      movieCard.className = "movie-card";
      movieCard.setAttribute("role", "button");
      movieCard.setAttribute("tabindex", "0");

      // Crear el elemento img
      const img = document.createElement("img");
      img.src = movie.img;
      img.alt = movie.img_alt;

      // Crear el elemento figcaption
      const figcaption = document.createElement("figcaption");
      figcaption.className = "off";
      figcaption.textContent = movie.img_alt;

      // Agregar img y figcaption a movieCard
      movieCard.appendChild(img);
      movieCard.appendChild(figcaption);

      // Agregar movieCard al contenedor de películas
      moviesContainer.appendChild(movieCard);
    });

    // Agregar event listeners a las nuevas tarjetas de película
    addEventListenersToMovieCards();

    if (currentQuestion !== totalQuestions) {
      // Validar si alguna opción debe ser desactivada
      followStep(
        currentQuestion,
        movies,
        document.querySelectorAll(".movie-card")
      );
    }

    movieCards.forEach((card) => card.classList.remove("fade-out"));
    questionText.classList.remove("fade-out");
  }, 500);
}

// Buscar si la pregunta tiene una siguiente opción
function followStep(currentQuestion, movies, movieCards) {
  // Generar un array de letras basado en la longitud de movieCards
  const options = Array.from({ length: movieCards.length }, (_, index) =>
    String.fromCharCode(65 + index)
  );

  // Buscar si existe una opción para la siguiente pregunta
  options.forEach((option) => {
    // nextKey == a la siguiente pregunta del grupo option
    const nextKey = `quest${currentQuestion + 1}_${option}`;
    const nextMovies = movies[nextKey];

    if (!nextMovies) {
      // Al caso de que no exista la ruta, deshabilito la opcion
      movieCards.forEach((card) => {
        if (card.id === `movie${option}`) {
          card.classList.add("disable");
        }
      });
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
    // console.log("currentQuestion", currentQuestion);
    // console.log("totalQuestions", totalQuestions);
  }

  // Agrego la class fade-out a .movie-card
  movieCards.forEach((card) => card.classList.add("fade-out"));
  // Agrego la class fede-aut a questionText
  questionText.classList.add("fade-out");

  // obtengo la ultima letra de idMovie
  const lastLetter = idMovie.charAt(idMovie.length - 1);
  formQuestions(`quest${currentQuestion}`, lastLetter);
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
  totalQuestions = maxValue;
}
// Función para agregar event listeners a las tarjetas de película
function addEventListenersToMovieCards() {
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
