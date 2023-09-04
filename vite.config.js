import vue from '@vitejs/plugin-vue'
import { createSvg } from './src/icons/index';

export default {
    base: './',
    plugins: [
        vue(),
        createSvg('./src/icons/svg/') // 这里已经将src/icons/svg/下的svg全部导入，无需再单独导入
    ],
    optimizeDeps: {
        include: ['schart.js']
    }
}