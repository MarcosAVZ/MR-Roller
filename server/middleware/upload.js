import multer from 'multer'

// Carpeta donde se van a guardar las imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads') // ✅ carpeta de destino
  },
  filename: (req, file, cb) => {
    // Cambiar el nombre antes de guardarlo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  }
})

export const upload = multer({ storage })
