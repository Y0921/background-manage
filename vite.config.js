import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  resolve:{//配置文件路径
    alias:{
      "@":path.resolve(__dirname,"src")
    }
  },
  server:{
    proxy:{
      '/api':{
        target:'http://background-manage.top',
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }

  },
  plugins: [vue(),WindiCSS()],
})
