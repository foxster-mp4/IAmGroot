$(document).ready(function() {
    $.getJSON("data.json", function (data) {
        // Poster & background 
        $("#poster-container").html(`<img src="${data.posters[Math.floor(Math.random() * data.posters.length)]}" id="poster" alt="poster">`);
        setBackground();

        // Title
        if (data.name != null) {
            document.title = data.name + " – Now Showing";
            $("#title").text(data.name);
        }

        // Description
        if (data.description != null)
            $("#description").text(data.description);

        // Genre
        if (data.genre != null)
            $("#genre").text(data.genre);

        // Year
        if (data.year != null)
            $("#year").text(data.year);

        // Trailer
        if (data.trailerURL != null) {
            $("#trailer").attr("href", data.trailerURL);
            $("#trailer").removeClass("disabled");
            $("#trailer-button-text").text("Watch Trailer");
        }
        
        const episodes = data.episodes;
        if (episodes == null || episodes.length == 0) {
            $("#main-button").addClass("disabled");
            $("#main-button-text").text("Coming Soon");
            return;
        }
        
        let latestEpisode;
        if (episodes.length > 1) { // More than 1 episode; add button to select episode
            let episodeOptions = "";
            for (let i = 0; i < episodes.length; i++) {
                const episode = episodes[i];
                episodeOptions += `<li><a class="dropdown-item`;
                if (i == episodes.length - 1) { // Latest episode
                    latestEpisode = episode;
                    episodeOptions += ` selected`;
                }
                episodeOptions += `" href="${episode.url}" n=${i}>`
                if (episode.number != null)
                    episodeOptions += `Episode ${episode.number}`;
                else 
                    episodeOptions += `bruh`;
                // if (episode.number != null && episode.name != null)
                //     episodeOptions += " – "
                // if (episode.name != null)
                //     episodeOptions += `${episode.name}`
                episodeOptions += `</a></li>`;
            }

            // Add option to select episode
            $("#main-button-container").append(`
                <button type="button" class="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu">
                    ${episodeOptions}
                </ul>
            `);
        } else latestEpisode = episodes[0]; // 1 episode (movie)

        updateMainButton(latestEpisode); // Function hoisting example

        function updateMainButton(episode) { // Must not use arrow function since it won't be hoisted
            // Set "play" icon
            $("#main-button-icon").addClass("bi-play-fill").removeClass("bi-arrow-down-circle");
            $("#main-button").removeClass("disabled"); // Enable button
            
            let episodeTitle = "";
            if (episode.number != null) {
                episodeTitle = `Episode ${episode.number}`;
            } else if (episode.name != null) {
                episodeTitle = episode.name;
            } else {
                episodeTitle = "Now";
            }

            console.log(episode.url)
            
            // Main URL is available
            if (episode.url != null && episode.url.trim().length > 0) {
                $("#main-button-text").text(`Watch ${episodeTitle}`);
                $("#main-button").attr("href", episode.url);
            } 

            // Download URL is available
            else if (episode.downloadURL != null && episode.downloadURL.trim().length > 0) { 
                $("#main-button-icon").removeClass("bi-play-fill").addClass("bi-arrow-down-circle"); // Set "download" icon
                $("#main-button-text").text(`Download ${episodeTitle}`);
                $("#main-button").attr("href", episode.downloadURL);
            }

            // No URL available
            else {
                $("#main-button").addClass("disabled");
                $("#main-button-text").text("Coming Soon");
                $("#main-button").attr("href", "#");
            }
        }

        // Episode option click listener
        $(".dropdown-item").click(function(event) {
            event.preventDefault(); // Prevent page reload since dropdown items are <a> elements

            const n = parseInt($(this).attr("n"));
            const episode = episodes[n];

            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            updateMainButton(episode);
        });
    });
});

function setBackground() {
    const colorThief = new ColorThief();
    const poster = document.getElementById("poster");
    
    const generateGradient = () => {
        const palette = colorThief.getPalette(poster);
        const body = document.querySelector("body");
        body.style.background = getGradientBackground(palette);
        body.style.backgroundSize = "150% 100%";
        body.style.backgroundPosition = "0% 50%";
    }

    if (poster.complete) // Poster loaded
        generateGradient();
    else { // Wait for poster to be loaded
        poster.addEventListener('load', generateGradient);
    }
}

function getGradientBackground(palette) {
    let gradient = "radial-gradient(at -55% top,";
    for (let i = 0; i < palette.length; i++) {
        const colorValues = palette[i];
        gradient += `${rgb(colorValues)},`;
        i++; // Increment i by 2
    }
    gradient = gradient.slice(0, -1) + ")"; // Remove last comma
    return gradient;
}

const rgb = (values) => `rgb(${values.join(',')})`;