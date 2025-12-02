import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	plugins: [
		react(),
		tailwindcss()
	],
	base: '/L3InfoAcadMatfiGroupe15/', // <-- obligatoire pour GitHub Pages
})

