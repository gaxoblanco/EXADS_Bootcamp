// Espera a que el documento esté listo
// funciona igual que un fech a una API
document.addEventListener("DOMContentLoaded", () => {
  // Cargar el archivo JSON que contiene los datos de las películas
  fetch("movies.json")
    .then((response) => response.json()) // Convertir la respuesta en formato JSON
    .then((data) => {
      // Inicializar las imágenes en el HTML con los datos del JSON
      // initializeMovies(data);
      formQuestions("quest1", data);
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
function formQuestions(questions, data) {
  // switch case para cada pregunta
  switch (questions) {
    case "quest1":
      // Obtener las preguntas por su ID
      const question1 = document.getElementById("question1");
      // Le agrego la class active
      question1.classList.add("active");
      // Cargo las preguntas/ movies
      optionsMovie(questions, data);
      break;
    case "quest2":
      // Obtener las preguntas por su ID
      const question2 = document.getElementById("question2");
      // Le agrego la class active
      question2.classList.add("active");
      updateQuestion(2);
      break;
    case "quest3":
      // Obtener las preguntas por su ID
      const question3 = document.getElementById("question3");
      // Le agrego la class active
      question3.classList.add("active");
      updateQuestion(3);
      break;

    default:
      break;
  }
}

// Función para inicializar las imágenes
function optionsMovie(questions, movies) {
  // Obtener las imágenes por su ID
  const movie1 = document.getElementById("movie1");
  const movie2 = document.getElementById("movie2");
  const movie3 = document.getElementById("movie3");

  // Obtener las películas correspondientes al grupo de preguntas
  const moviesToLoad = movies[questions];

  // Asignar las imágenes y textos alternativos a cada película
  movie1.src = moviesToLoad[0].img;
  movie1.alt = moviesToLoad[0].img_alt;

  movie2.src = moviesToLoad[1].img;
  movie2.alt = moviesToLoad[1].img_alt;

  movie3.src = moviesToLoad[2].img;
  movie3.alt = moviesToLoad[2].img_alt;
}

// Función para cambiar una película
function changeMovie(index, movieData) {}

// Ejemplo de cómo cambiar una película (por ejemplo, al hacer click en una imagen):
document.querySelectorAll(".movie-card img").forEach((img, index) => {
  img.addEventListener("click", () => {
    // Llamar a la función de cambiar imagen al hacer clic
    changeMovie(index, {
      img: "new-image-path.jpg", // Nueva ruta de la imagen
      img_alt: "New Movie", // Nuevo texto del atributo alt
    });
  });
});
