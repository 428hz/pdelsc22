import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, 
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https://picsum.photos https://i.pravatar.cc https://xvcstpiaobjmxhcvacmg.supabase.co; connect-src 'self' https://xvcstpiaobjmxhcvacmg.supabase.co ws: wss:;"
    }
  }
})