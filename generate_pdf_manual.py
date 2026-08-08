import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas

# Palette definition
PRIMARY = colors.HexColor("#0F172A")      # Dark Navy
SECONDARY = colors.HexColor("#0284C7")    # Vibrant Blue
ACCENT = colors.HexColor("#10B981")       # Emerald Green
BG_LIGHT = colors.HexColor("#F8FAFC")     # Soft light gray
TEXT_DARK = colors.HexColor("#334155")    # Charcoal body text
BORDER_COLOR = colors.HexColor("#E2E8F0") # Subtle line border
WARN_BG = colors.HexColor("#FEF3C7")      # Soft amber background
WARN_BORDER = colors.HexColor("#F59E0B")  # Amber border

class NumberedCanvas(canvas.Canvas):
    """
    Canvas to dynamic multi-page count (e.g. Página X de Y) and standard headers/footers
    """
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Don't draw headers on page 1 (Cover)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(54, 750, "URBANOS INMOBILIARIA & GESTIÓN — Manual de Usuario")
            self.setFont("Helvetica", 8)
            self.drawRightString(612 - 54, 750, "Carga de Propiedades")
            
            self.setStrokeColor(BORDER_COLOR)
            self.setLineWidth(0.75)
            self.line(54, 742, 612 - 54, 742)
            
            # Footer
            self.line(54, 50, 612 - 54, 50)
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawString(54, 38, "Guía Paso a Paso para la Publicación de Inmuebles")
            page_text = f"Página {self._pageNumber} de {page_count}"
            self.drawRightString(612 - 54, 38, page_text)

        self.restoreState()

def create_manual_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=60
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=30,
        textColor=PRIMARY,
        spaceAfter=8
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=14,
        textColor=TEXT_DARK,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'Bullet_Custom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    tip_style = ParagraphStyle(
        'Tip_Text',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B")
    )

    story = []

    # Logo header if exists
    logo_path = os.path.join(os.path.dirname(__file__), 'public', 'logo.png')
    if os.path.exists(logo_path):
        try:
            img = Image(logo_path, width=160, height=50)
            img.hAlign = 'LEFT'
            story.append(img)
            story.append(Spacer(1, 10))
        except Exception:
            pass

    # Title & Subtitle
    story.append(Paragraph("Manual de Usuario: Carga de Propiedades", title_style))
    story.append(Paragraph("Guía sencilla y fácil para publicar inmuebles en la plataforma URBANOS", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=SECONDARY, spaceBefore=0, spaceAfter=15))

    # Welcome callout box
    welcome_text = """
    <b>¡Bienvenido/a al Panel de Administración de URBANOS!</b><br/>
    Esta guía no técnica ha sido diseñada especialmente para que puedas subir, editar y gestionar tus propiedades de forma rápida, intuitiva y sin necesidad de conocimientos informáticos avanzados. Sigue estos sencillos pasos para tener tu propiedad publicada en minutos.
    """
    welcome_table = Table([[Paragraph(welcome_text, tip_style)]], colWidths=[504])
    welcome_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), BG_LIGHT),
        ('BOX', (0, 0), (-1, -1), 1, SECONDARY),
        ('PADDING', (0, 0), (-1, -1), 10),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(welcome_table)
    story.append(Spacer(1, 15))

    # PASO 1: Acceso al Panel
    story.append(Paragraph("Paso 1: Acceso al Panel de Administración", h1_style))
    story.append(Paragraph("Para comenzar a gestionar propiedades, sigue estos simples pasos para iniciar sesión:", body_style))
    
    p1_items = [
        "<b>1. Abre tu navegador de internet:</b> Puedes usar Google Chrome, Safari, Edge o Firefox en tu computador o teléfono.",
        "<b>2. Ingresa la dirección de la página:</b> Escribe la dirección web de tu sitio e ingresa a la sección de administración agregando <code>/admin</code> al final (ejemplo: <i>www.tuweb.cl/admin</i>).",
        "<b>3. Ingresa tus credenciales de acceso:</b>",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Correo electrónico:</b> Tu correo registrado (ej: <code>admin@urbanosinmobiliaria.cl</code>).",
        "&nbsp;&nbsp;&nbsp;&nbsp;• <b>Contraseña:</b> Tu clave secreta asignada.",
        "<b>4. Presiona el botón 'Iniciar Sesión':</b> Accederás de inmediato al Panel de Control."
    ]
    for item in p1_items:
        story.append(Paragraph(item, bullet_style))
    story.append(Spacer(1, 10))

    # Tip box
    tip1 = """<b>💡 Consejo de Seguridad:</b> Guarda tu contraseña en un lugar seguro. Si ingresas desde un equipo compartido o público, recuerda cerrar sesión al finalizar haciendo clic en el botón <b>"Cerrar Sesión"</b> en la parte superior derecha."""
    tip_table1 = Table([[Paragraph(tip1, tip_style)]], colWidths=[504])
    tip_table1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EFF6FF")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#93C5FD")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(tip_table1)
    story.append(Spacer(1, 15))

    # PASO 2: La pestaña Propiedades
    story.append(Paragraph("Paso 2: Ubicar el Formulario de Carga", h1_style))
    story.append(Paragraph("Una vez adentro del panel verás un menú superior con distintas pestañas:", body_style))
    
    p2_items = [
        "<b>• Pestaña 'Propiedades':</b> Es la primera opción y donde podrás crear nuevas publicaciones y ver el listado de propiedades guardadas.",
        "<b>• Botón 'Nueva Propiedad':</b> En la parte superior encontrarás el formulario titulado <b>'Agregar Nueva Propiedad'</b> listo para ser completado."
    ]
    for item in p2_items:
        story.append(Paragraph(item, bullet_style))
    story.append(Spacer(1, 15))

    # PASO 3: Completar el Formulario Paso a Paso
    story.append(Paragraph("Paso 3: Completar la Información del Inmueble", h1_style))
    story.append(Paragraph("El formulario está organizado en campos muy simples. A continuación te explicamos qué escribir en cada uno:", body_style))

    form_data = [
        [Paragraph("<b>Campo</b>", h2_style), Paragraph("<b>¿Qué debes ingresar?</b>", h2_style), Paragraph("<b>Ejemplo Práctico</b>", h2_style)],
        
        [Paragraph("<b>Título de la Propiedad</b>", body_style), 
         Paragraph("Nombre atractivo y claro que resumen la oferta.", body_style), 
         Paragraph("<i>Exclusivo Departamento Vista al Parque</i>", body_style)],
        
        [Paragraph("<b>Código / Ref.</b>", body_style), 
         Paragraph("Código interno de identificación para tu control.", body_style), 
         Paragraph("<i>URB-2026-01</i>", body_style)],
        
        [Paragraph("<b>Operación</b>", body_style), 
         Paragraph("Selecciona si la propiedad está para la Venta o Arriendo.", body_style), 
         Paragraph("<i>Venta</i> o <i>Arriendo</i>", body_style)],

        [Paragraph("<b>Tipo de Propiedad</b>", body_style), 
         Paragraph("Categoría del inmueble (Casa, Depto, Oficina, Terreno, etc.).", body_style), 
         Paragraph("<i>Departamento</i>", body_style)],

        [Paragraph("<b>Comuna</b>", body_style), 
         Paragraph("Comuna donde se encuentra la propiedad.", body_style), 
         Paragraph("<i>Las Condes, Providencia, Viña del Mar</i>", body_style)],

        [Paragraph("<b>Ubicación / Dirección</b>", body_style), 
         Paragraph("Sector, barrio o dirección descriptiva.", body_style), 
         Paragraph("<i>Av. Apoquindo / El Golf</i>", body_style)],

        [Paragraph("<b>Precio y Moneda</b>", body_style), 
         Paragraph("Monto numérico y tipo de moneda (UF o CLP).", body_style), 
         Paragraph("<i>7.500 UF</i> o <i>$450.000 CLP</i>", body_style)],

        [Paragraph("<b>Habitaciones / Baños</b>", body_style), 
         Paragraph("Cantidad de dormitorios y baños con los que cuenta.", body_style), 
         Paragraph("<i>3 Dormitorios / 2 Baños</i>", body_style)],

        [Paragraph("<b>Superficie (m²)</b>", body_style), 
         Paragraph("Metros cuadrados útiles y superficie total de terreno.", body_style), 
         Paragraph("<i>85 m² útiles / 100 m² total</i>", body_style)]
    ]

    form_table = Table(form_data, colWidths=[120, 224, 160])
    form_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 6),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(form_table)
    story.append(Spacer(1, 15))

    # Page Break for clean layout before Photos section
    story.append(PageBreak())

    # PASO 4: Carga de Fotografías
    story.append(Paragraph("Paso 4: Carga de Fotos (¡La Parte Más Importante!)", h1_style))
    story.append(Paragraph("Las imágenes son lo primero que miran los clientes. Una publicación con buenas fotos recibe hasta 3 veces más consultas.", body_style))

    photo_steps = [
        "<b>1. Imagen Principal (Portada):</b> Selecciona o arrastra tu imagen. <b>¡Compresión WebP Automática!</b> El sistema reduce automáticamente el peso de la foto entre 75% y 90% convirtiéndola a WebP de ultra-alta velocidad sin perder calidad.",
        "<b>2. Galería de Fotos (Imágenes adicionales):</b> Puedes subir hasta 5 fotos adicionales de dormitorios, cocina, terraza y áreas comunes. Todas serán optimizadas automáticamente.",
        "<b>3. Recomendación de imágenes:</b> Utiliza fotografías tomadas en formato horizontal (apaisado), con buena luz natural y en orden (primero vista/living, luego cocina y dormitorios)."
    ]
    for step in photo_steps:
        story.append(Paragraph(step, bullet_style))
    story.append(Spacer(1, 10))

    # Warning Box for Photos
    warn_text = """
    <b>📸 Consejos para Fotos Perfectas:</b><br/>
    • Procura que la propiedad se vea limpia y ordenada en la fotografía.<br/>
    • Evita fotos borrosas, muy oscuras o a contraluz.<br/>
    • La primera foto debe ser la más espectacular (ej: una vista despejada o el living luminoso).
    """
    warn_table = Table([[Paragraph(warn_text, tip_style)]], colWidths=[504])
    warn_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), WARN_BG),
        ('BOX', (0, 0), (-1, -1), 1, WARN_BORDER),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(warn_table)
    story.append(Spacer(1, 15))

    # PASO 5: Descripción y Destacado
    story.append(Paragraph("Paso 5: Descripción Descriptiva y Opción 'Destacada'", h1_style))
    
    p5_items = [
        "<b>• Descripción Detallada:</b> Redacta un texto amigable destacando los puntos fuertes del inmueble. Por ejemplo: <i>'Excelente departamento remodelado, cercano a metro, supermercados y colegios. Cuenta con bodega, estacionamiento subterráneo y orientación oriente.'</i>",
        "<b>• Marcar como 'Destacada':</b> Si activas la casilla <b>'Propiedad Destacada'</b>, la propiedad aparecerá con prioridad en el carrusel de la página principal del sitio web."
    ]
    for item in p5_items:
        story.append(Paragraph(item, bullet_style))
    story.append(Spacer(1, 15))

    # PASO 6: Guardar y Publicar
    story.append(Paragraph("Paso 6: Publicar y Revisar la Propiedad", h1_style))
    story.append(Paragraph("Cuando termines de completar los datos:", body_style))

    p6_items = [
        "<b>1. Presiona el botón verde 'Guardar Propiedad':</b> El sistema guardará la información de forma inmediata.",
        "<b>2. Mensaje de Confirmación:</b> Verás una alerta de confirmación indicando que la propiedad ha sido guardada exitosamente.",
        "<b>3. Ver en el Sitio Web:</b> Haz clic en el botón <b>'Ver en Catálogo'</b> o visita la página principal para comprobar cómo quedó publicada tu propiedad."
    ]
    for item in p6_items:
        story.append(Paragraph(item, bullet_style))
    story.append(Spacer(1, 15))

    # PASO 7: Modificar o Eliminar
    story.append(Paragraph("Paso 7: Cómo Modificar o Eliminar una Propiedad", h1_style))
    story.append(Paragraph("En la parte inferior del panel encontrarás la lista de <b>'Propiedades Registradas'</b>.", body_style))

    p7_items = [
        "<b>• Para Editar (Cambiar precio, fotos o datos):</b> Haz clic en el botón azul con forma de lápiz ✏️ <b>'Editar'</b>. El formulario se llenará automáticamente con los datos de esa propiedad para que los modifiques y vuelvas a presionar 'Guardar'.",
        "<b>• Para Eliminar (Si la propiedad se vendió o arrendó):</b> Haz clic en el botón rojo 🗑️ <b>'Eliminar'</b>. El sistema te pedirá confirmación antes de retirarla del sitio web."
    ]
    for item in p7_items:
        story.append(Paragraph(item, bullet_style))
    story.append(Spacer(1, 15))

    # FAQ / Resumen Final Box
    faq_header = Paragraph("Preguntas Frecuentes y Ayuda Rápida", h1_style)
    story.append(faq_header)

    faq_data = [
        [Paragraph("<b>Pregunta</b>", h2_style), Paragraph("<b>Respuesta Sencilla</b>", h2_style)],
        [Paragraph("<b>¿Cuánto tarda en aparecer la propiedad en el sitio?</b>", body_style),
         Paragraph("Es <b>inmediato</b>. Apenas presionas 'Guardar', la propiedad queda publicada en vivo en el catálogo de URBANOS.", body_style)],
        [Paragraph("<b>¿Puedo cambiar el precio después?</b>", body_style),
         Paragraph("Sí, en cualquier momento presiona <b>'Editar'</b>, cambia el valor (ej: de UF a CLP o nuevo monto) y guarda los cambios.", body_style)],
        [Paragraph("<b>¿Qué hago si me equivoqué en una foto?</b>", body_style),
         Paragraph("Simplemente edita la propiedad, reemplaza el enlace de la imagen o borra la foto incorrecta y guarda.", body_style)],
        [Paragraph("<b>¿Necesitas ayuda adicional?</b>", body_style),
         Paragraph("Si tienes dudas o problemas técnicos, contacta al equipo de soporte de URBANOS al correo: <code>contacto@urbanosinmobiliaria.cl</code>", body_style)]
    ]

    faq_table = Table(faq_data, colWidths=[200, 304])
    faq_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BG_LIGHT),
        ('GRID', (0, 0), (-1, -1), 0.5, BORDER_COLOR),
        ('PADDING', (0, 0), (-1, -1), 7),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(faq_table)
    story.append(Spacer(1, 20))

    # Footer thank you message
    thank_text = """
    <b>URBANOS Inmobiliaria & Gestión</b> — Creando experiencias ágiles y eficientes.<br/>
    <i>Este manual está diseñado para ser impreso o guardado en formato PDF.</i>
    """
    story.append(Paragraph(thank_text, ParagraphStyle('Thank', parent=body_style, alignment=1, textColor=colors.HexColor("#64748B"))))

    # Build document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generado con éxito en: {filename}")

if __name__ == '__main__':
    out_dir = os.path.dirname(__file__)
    pdf_filename = os.path.join(out_dir, "public", "Manual_Usuario_Publicar_Propiedades_Urbanos.pdf")
    create_manual_pdf(pdf_filename)
    
    # Also save a copy directly in the project root for easy user download
    pdf_root = os.path.join(out_dir, "Manual_Usuario_Publicar_Propiedades_Urbanos.pdf")
    create_manual_pdf(pdf_root)
