const colorThief = new ColorThief();

document.addEventListener('DOMContentLoaded', function () {
    main()
}, false);

const main = () => {
    const posterElement = document.getElementById("poster")

    const generateGradient = () => {
        const palette = colorThief.getPalette(posterElement)
        const body = document.querySelector("body")
        body.style.background = getGradientBackground(palette)
        // body.style.backgroundSize = "500% 500%"
    }

    if (posterElement.complete) generateGradient() 
    else posterElement.addEventListener('load', generateGradient);
}

function getGradientBackground(palette) {
    // let gradient = "radial-gradient(at -50% top,";
    let gradient = "radial-gradient(at 100% bottom,";

    // for (let i = 0; i < palette.length; i++) {
    for (let i = 0; i < 6; i++) {
        const color = palette[i];
        gradient += `${rgb(color)},`;
        i++;
    }
    gradient += `${rgb(palette[4])},`;
    gradient = gradient.slice(0, -1) // Remove last comma
    gradient += ")"
    console.log(gradient)
    return gradient
}

function rgb(values) {
    return 'rgb(' + values.join(',') + ')';
}