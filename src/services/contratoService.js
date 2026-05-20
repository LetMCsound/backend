import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export const contratoService = {
  /**
   * Genera un PDF de contrato de licencia.
   * @returns {Promise<Uint8Array>} Bytes del PDF
   */
  async generarPDF({ titulo, precio, licencia, comprador }) {
    const fecha = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    const idTransaccion = crypto.randomUUID().slice(0, 8).toUpperCase()

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4
    const { width, height } = page.getSize()

    const fontBold   = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const purple = rgb(0.694, 0.349, 1.0)
    const black  = rgb(0.05, 0.05, 0.05)
    const gray   = rgb(0.45, 0.45, 0.45)
    const white  = rgb(1, 1, 1)

    // Cabecera morada
    page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: purple })
    page.drawText('LETMC SOUND', { x: 40, y: height - 42, size: 26, font: fontBold, color: white })
    page.drawText('Contrato de Licencia', { x: 40, y: height - 65, size: 12, font: fontNormal, color: rgb(0.9, 0.85, 1) })

    // Badge de licencia
    const badgeColor = licencia.toLowerCase() === 'exclusiva' ? rgb(0.78, 0.64, 0) : purple
    page.drawRectangle({ x: width - 160, y: height - 70, width: 120, height: 30, color: badgeColor })
    page.drawText(licencia.toUpperCase(), { x: width - 150, y: height - 58, size: 11, font: fontBold, color: white })

    let y = height - 120
    const drawLine = (yPos) => page.drawLine({
      start: { x: 40, y: yPos }, end: { x: width - 40, y: yPos },
      thickness: 0.5, color: rgb(0.85, 0.85, 0.85)
    })

    // Info transacción
    page.drawText(`ID Transacción: ${idTransaccion}`, { x: 40, y, size: 9, font: fontNormal, color: gray })
    page.drawText(`Fecha: ${fecha}`, { x: width - 200, y, size: 9, font: fontNormal, color: gray })
    y -= 25; drawLine(y); y -= 20

    // Partes
    page.drawText('PARTES DEL ACUERDO', { x: 40, y, size: 11, font: fontBold, color: purple }); y -= 18
    page.drawText('Vendedor:', { x: 40, y, size: 10, font: fontBold, color: black })
    page.drawText('LetMC Sound (Kairo Wave)', { x: 120, y, size: 10, font: fontNormal, color: black }); y -= 16
    page.drawText('Comprador:', { x: 40, y, size: 10, font: fontBold, color: black })
    page.drawText(comprador, { x: 120, y, size: 10, font: fontNormal, color: black })
    y -= 25; drawLine(y); y -= 20

    // Objeto
    page.drawText('OBJETO DEL CONTRATO', { x: 40, y, size: 11, font: fontBold, color: purple }); y -= 18
    page.drawText('Beat / Obra musical:', { x: 40, y, size: 10, font: fontBold, color: black })
    page.drawText(`"${titulo}"`, { x: 155, y, size: 10, font: fontNormal, color: black }); y -= 16
    page.drawText('Licencia:', { x: 40, y, size: 10, font: fontBold, color: black })
    page.drawText(licencia, { x: 120, y, size: 10, font: fontNormal, color: black }); y -= 16
    page.drawText('Precio:', { x: 40, y, size: 10, font: fontBold, color: black })
    page.drawText(`$${precio}`, { x: 120, y, size: 10, font: fontBold, color: purple })
    y -= 25; drawLine(y); y -= 20

    // Condiciones
    const condiciones = this._getCondiciones(licencia)
    page.drawText('CONDICIONES DE LA LICENCIA', { x: 40, y, size: 11, font: fontBold, color: purple }); y -= 18
    for (const linea of condiciones) {
      if (linea === '') { y -= 8; continue }
      if (linea.startsWith('##')) {
        page.drawText(linea.replace('## ', ''), { x: 40, y, size: 10, font: fontBold, color: black })
      } else {
        page.drawText(linea, { x: 50, y, size: 9.5, font: fontNormal, color: black })
      }
      y -= 15
      if (y < 120) break
    }

    y -= 10; drawLine(y); y -= 20
    page.drawText('ACEPTACIÓN', { x: 40, y, size: 11, font: fontBold, color: purple }); y -= 16
    page.drawText('Al realizar esta compra, el comprador acepta todos los términos y condiciones indicados.',
      { x: 40, y, size: 9, font: fontNormal, color: gray, maxWidth: width - 80 })
    y -= 50
    drawLine(y + 20)
    page.drawText('Firma LetMC Sound', { x: 60, y, size: 9, font: fontNormal, color: gray })
    page.drawText('Firma Comprador', { x: width - 180, y, size: 9, font: fontNormal, color: gray })

    // Footer
    page.drawRectangle({ x: 0, y: 0, width, height: 35, color: rgb(0.07, 0.07, 0.1) })
    page.drawText('LetMC Sound  ·  Todos los derechos reservados',
      { x: 40, y: 12, size: 8, font: fontNormal, color: rgb(0.5, 0.5, 0.5) })
    page.drawText(`Contrato #${idTransaccion}`,
      { x: width - 150, y: 12, size: 8, font: fontNormal, color: rgb(0.5, 0.5, 0.5) })

    return { bytes: await pdfDoc.save(), idTransaccion }
  },

  _getCondiciones(licencia) {
    const l = licencia.toLowerCase()
    if (l === 'standard') return [
      '## Entregables', 'Archivo de audio en formato MP3.',
      '', '## Derechos otorgados',
      '- Uso para demos y proyectos personales.',
      '- Streaming limitado: hasta 50,000 reproducciones.',
      '- 1 video musical sin monetización.',
      '', '## Restricciones',
      '- No incluye stems ni archivos WAV.',
      '- No permite uso en radio ni TV.',
      '- No transfiere la propiedad del beat.',
      '', '## Créditos', 'El comprador debe acreditar: "Prod. by Kairo Wave".'
    ]
    if (l === 'premium') return [
      '## Entregables', 'Archivos de audio en formato MP3 y WAV de alta calidad.',
      '', '## Derechos otorgados',
      '- Distribución en plataformas digitales (Spotify, Apple Music, etc.).',
      '- Streaming: hasta 500,000 reproducciones.',
      '- 1 video musical con monetización permitida.',
      '- Transmisión en radio: hasta 2 estaciones regionales.',
      '- Actuaciones en vivo con fines de lucro: permitido.',
      '', '## Restricciones',
      '- No transfiere la propiedad del beat.',
      '- No puede revenderse el instrumental por separado.',
      '', '## Créditos', 'El comprador debe acreditar: "Prod. by Kairo Wave".'
    ]
    return [
      '## Entregables', 'Archivos MP3, WAV de alta calidad (24-bit) y TRACKOUTS / STEMS completos.',
      '', '## Derechos otorgados (ILIMITADOS)',
      '- Streams en Spotify / Apple Music: ILIMITADOS.',
      '- Ventas físicas y digitales: ILIMITADAS.',
      '- Videos musicales: ILIMITADOS.',
      '- Transmisión en Radio y TV: ILIMITADA.',
      '- Uso comercial y sincronización: PERMITIDO SIN RESTRICCIONES.',
      '', '## Exclusividad',
      'El vendedor no volverá a licenciar este beat a partir de la fecha del contrato.',
      'Las licencias no exclusivas vendidas anteriormente siguen siendo válidas.'
    ]
  }
}
