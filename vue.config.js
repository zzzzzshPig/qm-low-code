const path = require('path')

module.exports = {
    css: {
        loaderOptions: {
            less: {
                modifyVars: {},
                javascriptEnabled: true
            }
        }
    },

    configureWebpack: {
        resolve: {
            alias: {
                'qm-lowCode-component': path.resolve(__dirname, 'src/components')
            }
        }
    },

    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [
                path.resolve(__dirname, './src/assets/less/variable.less')
            ]
        }
    }
}
