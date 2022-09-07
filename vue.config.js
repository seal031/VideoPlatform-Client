module.exports = {
    publicPath: "./",
    outputDir: "dist",
    devServer: { 
        // open: process.platform === 'chrome', // 默认打开的浏览器
        // port: 8080, // 端口号
        hotOnly: true, // 热加载
        proxy: { // 跨域配置
            '/Test': { // 过滤的api
                target: 'http://47.93.84.178:14474/', // 要访问的URL
                ws: true,
                changeOrigin: true, // true，启用跨域
                // pathRewrite:{ // 要转发到的地址，根据需要也可不配置
                //         '^/Test':''
                // }
            }
        }
    }
}