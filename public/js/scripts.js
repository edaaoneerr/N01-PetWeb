document.addEventListener('DOMContentLoaded', function() {
    const logoSvg = document.getElementById('logo');
    logoSvg.addEventListener('load', function() {
        const svgDoc = logoSvg.contentDocument;
        const svgElement = svgDoc.documentElement;

        svgElement.style.cursor = 'pointer'; // Set cursor to pointer for the SVG element

        svgElement.addEventListener('click', function() {
            window.location.href = '/';
        });
    });
});