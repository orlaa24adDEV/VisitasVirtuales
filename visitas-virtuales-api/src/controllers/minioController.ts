import type { Request, Response } from 'express';
import minioService from '../services/minioService.ts';
import { env } from '../env.ts';

export const simpleUploadHandler = async (req: Request, res: Response) => {
  // Derivar nombre, tipo MIME y buffer del fichero interceptado por Multer
  const fileName = req.file?.originalname;
  const mimeType = req.file?.mimetype;
  const buffer = req.file?.buffer;

  if (!fileName || !mimeType || !buffer) {
    return res.status(400).json({ error: 'Fichero no proporcionado o inválido.' });
  }

  try {
    const sanitizedFileName = await minioService.simpleUpload(fileName, mimeType, buffer);
    // Construir la URL pública del fichero subido
    const fileUrl = `${env.FRONTEND_URL}/assets/${sanitizedFileName}`;
    res.json({ message: 'Fichero subido exitosamente.', fileUrl });
  } catch (e) {
    console.error('Error subiendo el fichero:', e);
    res.status(500).json({ error: 'Error subiendo el fichero.' });
  }
}