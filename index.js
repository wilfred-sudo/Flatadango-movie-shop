document.addEventListener("DOMContentLoaded", () => {
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
        fetch("http://localhost:5500/films")
            .then(response => response.json())
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
            fetch(`http://localhost:5500/films/${movie.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets_sold: movie.tickets_sold + 1 })
            }).then(() => {
                movie.tickets_sold++;
                loadMovieDetails(movie);
            });
        } else {
            alert("Sold Out!");
        }
    }

    function deleteMovie(movieId) {
        fetch(`http://localhost:5500/films/${movieId}`, { method: "DELETE" })
            .then(() => fetchMovies())
            .catch(error => console.error("Error deleting movie:", error));
    }

    fetchMovies();
});