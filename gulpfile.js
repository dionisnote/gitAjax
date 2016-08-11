var gulp = require("gulp");
var wp = require("gulp-webpack");

var tsFiles = ['./dev/**/*.ts'];

var wpOptions =  {
    entry: "./dev/app.ts",
    output: {
        filename : "app.js"
    },
    module : {
        loaders : [
            { test: /\.ts?$/, loader: "ts-loader" }
        ]
    }    
};

gulp.task('tscripts', function(){
    gulp.src( tsFiles )
        .pipe( wp( wpOptions ) )
        .pipe( gulp.dest('./public/js/') )
});

gulp.task('default', ['tscripts']);