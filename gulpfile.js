const { src, dest, watch, parallel } = require("gulp");

// CSS
const sass = require("gulp-sass")(require("sass"));
const global = require("gulp-livereload");
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");

//Imagenes
const cache = require("gulp-cache");
const imagenmin = require("gulp-imagemin");
const webp = require("gulp-webp");
const avif = require("gulp-avif");

// JavaScript
const terser = require("gulp-terser-js");


function css(done) {
    // ! Identidicar el archivo SASS
    // ! Compilar el archivo SASS
    // ! Almacenarla en el disco duro
    src("./src/**/*.scss").pipe(sourcemaps.init()).pipe( plumber() ).pipe( sass() ).pipe( postcss([ autoprefixer(), cssnano() ])).pipe(sourcemaps.write(".")).pipe( dest("build/css") );


    done(); // Esto avisara cuando lleguemos al final de todo y nos quite el error
}

function imagenes(done) {
    
    const opciones = {
        optimizationLevel: 3
    }

    src("./src/img/**/*.{png,jpg}").pipe(cache(imagenmin(opciones))).pipe(dest("build/img"));

    done();
}

function versionWebp(done) {

    const opciones = {
        quality: 50
    };

    src("./src/img/**/*.{png,jpg}").pipe(webp(opciones)).pipe(dest("build/img"));

    done();
}

function versionAvif(done) {

    const opciones = {
        quality: 50
    };

    src("./src/img/**/*.{png,jpg}").pipe(avif(opciones)).pipe(dest("build/img"));

    done();
}

function javascript(done) {
    src("./src/js/**/*.js").pipe(sourcemaps.init()).pipe( terser() ).pipe(sourcemaps.write(".")).pipe(dest("build/js"));

    done();
}

function dev(done) {
    watch("./src/**/*.scss", css);
    watch("./src/js/**/*.js", javascript);

    done(); // Esto avisara cuando lleguemos al final de todo y nos quite el error

}

exports.css = css;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
exports.versionWebp = versionWebp;
exports.imagenes = imagenes;
exports.versionAvif = versionAvif;
exports.javascript = javascript;