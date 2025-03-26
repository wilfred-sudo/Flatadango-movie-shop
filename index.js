document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "https://flatadango-movie-shop.onrender.com/films";

    const filmsList = document.getElementById("films");
    const moviePoster = document.getElementById("movie-poster");
    const movieTitle = document.getElementById("movie-title");
    const movieDescription = document.getElementById("movie-description");
    const movieRuntime = document.getElementById("movie-runtime");
    const movieShowtime = document.getElementById("movie-showtime");
    const movieTickets = document.getElementById("movie-tickets");
    const buyTicketButton = document.getElementById("buy-ticket");
    const deleteMovieButton = document.getElementById("delete-movie");

    function fetchMovies() {
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(movies => {
                filmsList.innerHTML = "";
                movies.forEach(movie => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;
                    li.classList.add("film-item");
                    li.addEventListener("click", () => loadMovieDetails(movie));
                    filmsList.appendChild(li);
                });
            })
            .catch(error => console.error("Error fetching movies:", error));
    }

    function loadMovieDetails(movie) {
        moviePoster.src = movie.poster;
        movieTitle.textContent = movie.title;
        movieDescription.textContent = movie.description;
        movieRuntime.textContent = `Runtime: ${movie.runtime} min`;
        movieShowtime.textContent = `Showtime: ${movie.showtime}`;
        movieTickets.textContent = `Tickets Available: ${movie.capacity - movie.tickets_sold}`;

        buyTicketButton.onclick = () => buyTicket(movie);
        deleteMovieButton.onclick = () => deleteMovie(movie.id);
    }

    function buyTicket(movie) {
        if (movie.tickets_sold < movie.capacity) {
            fetch(`${API_URL}/${movie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(updatedMovie => {
                movie.tickets_sold = updatedMovie.tickets_sold;
                loadMovieDetails(movie);
            })
            .catch(error => console.error("Error updating ticket count:", error));
        } else {
            alert("Sold Out!");
        }
    }

    function deleteMovie(movieId) {
        fetch(`${API_URL}/${movieId}`, {
            method: "DELETE"
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(() => fetchMovies())
        .catch(error => console.error("Error deleting movie:", error));
    }

    fetchMovies();
});