$(document).ready(function() {
    $.getJSON("https://raw.githubusercontent.com/foxster-mp4/NowShowing/master/data.json", function (data) {
        // Poster & background 
        $("#poster-container").html(`<img src="${data.posters[Math.floor(Math.random() * data.posters.length)]}" id="poster" alt="poster">`)
        setBackground()

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
            $("#trailer").removeClass("disabled")
        }
        
        const episodes = data.episodes;
        if (episodes == null || episodes.length == 0) {
            $("#watch-button").addClass("disabled");
            $("#watch-text").text("Coming Soon");
            return;
        }
        
        let latestEpisode;
        if (episodes.length > 1) { // More than 1 episode; add button to select episode
            let episodeOptions = ""
            
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
                // if (episode.number != null && episode.name != null)
                //     episodeOptions += " – "
                // if (episode.name != null)
                //     episodeOptions += `${episode.name}`
                episodeOptions += `</a></li>`;
            }

            // Add option to select episode
            $("#watch-button-container").append(`
                <button type="button" class="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                    <span class="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul class="dropdown-menu">
                    ${episodeOptions}
                </ul>
            `);
        } else latestEpisode = episodes[0]; // 1 episode (movie)

        $("#watch-button").removeClass("disabled");

        // Watch button text
        if (latestEpisode.url == null || latestEpisode.url.trim().length == 0) { // No URL
            $("#watch-button").addClass("disabled");
            $("#watch-text").text("Coming Soon");
        }  
        else if (latestEpisode.number != null) // Has episode number
            $("#watch-text").text(`Watch Episode ${latestEpisode.number}`);
        // else if (latestEpisode.name != null) // Has episode name
        //     $("#watch-text").text(`Watch ${latestEpisode.name}`);
        else // Default
            $("#watch-text").text("Watch Now");
        
        // Watch button href
        $("#watch-button").attr("href", latestEpisode.url);

        // Episode option click listener
        $(".dropdown-item").click(function(event) {
            event.preventDefault(); // Prevent page reload

            const n = parseInt($(this).attr("n"));
            const episode = episodes[n];

            $(".selected").removeClass("selected");
            $(this).addClass("selected");

            if (episode.url == null || episode.url.trim().length == 0) {
                $("#watch-text").text("Coming Soon");
                $("#watch-button").addClass("disabled");
            } else if (episode.url != null) {
                $("#watch-text").text(`Watch Episode ${episode.number}`);
                $("#watch-button").removeClass("disabled");
            }
            
            $("#watch-button").attr("href", episode.url);
        })
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