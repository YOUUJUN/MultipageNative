const Path = require("path");
const glob = require("glob");

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')

console.log('get in...',glob.sync("./src/pages/**/*.js"))

const getHtmlConfig = (name, chunks) =>{
    return {
        template : `./src/pages/${name}/${name}.html`,
        filename : `html/${name}.html`,
        inject : true,
        hash : true,
        chunks : chunks,

    }
}


const getEntry = () => {
    const entry = {};
    glob.sync("./src/pages/**/*.js").forEach(
        (filePath) => {
            console.log("filePath", filePath);
            let start = filePath.indexOf("pages/") + 6;
            let end = filePath.length - 3;
            let cache = filePath.slice(start, end);
            console.log('cache', cache);
            cache = cache.slice(0, cache.lastIndexOf('/'));
            entry[cache] = filePath;
        }
    );
    return entry;
};

const entryObj = getEntry();

module.exports = {
    mode : 'development',
    entry : entryObj,
    
    output : {
        path : Path.resolve(__dirname, '../dist'),
        filename : 'js/[name][hash].bundle.js',
    },

    resolve : {
        alias : {
            '@' : Path.resolve(__dirname, '../src')
        }
    },

    plugins : [
        new CleanWebpackPlugin(),
        
    ]

};

const htmlArr = [];
Object.keys(entryObj).forEach(html => {
    htmlArr.push({
        _html : html,
        title : '',
        chunks : ['vendor', 'common', html],
    })
})


htmlArr.forEach(html => {
    console.log('html==>', html);
    module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(html._html, html.chunks)))
})