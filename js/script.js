const colorThief = new ColorThief();

document.addEventListener('DOMContentLoaded', function () {
    main()
}, false);

const main = () => {
    const posterElement = document.getElementById("poster")

    const generateGradient = () => {
        const c = colorThief.getPalette(posterElement)
        const body = document.querySelector("body")

        body.style.background = getGradientBackground(c)
        body.style.backgroundSize = "400% 400%"
    }

    if (posterElement.complete) generateGradient() 
    else posterElement.addEventListener('load', generateGradient);
}

function getGradientBackground(palette) {
    let gradient = "radial-gradient(at -50% top,";

    for (let i = 0; i < palette.length; i++) {
        const color = palette[i];
        gradient += `${rgb(color)},`;
        i++;
    }
    // palette.forEach(color => {
    //     gradient += `${rgb(color)},`
    // });
    gradient = gradient.slice(0, -1) // Remove last comma
    gradient += ")"
    console.log(gradient)
    return gradient
}

function rgb(values) {
    return 'rgb(' + values.join(',') + ')';
}