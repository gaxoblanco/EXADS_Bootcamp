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
    })
    .catch((error) => console.error("Error loading the movie data:", error));
});

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
      break;
    case "quest3":
      // Obtener las preguntas por su ID
      const question3 = document.getElementById("question3");
      // Le agrego la class active
      question3.classList.add("active");
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
