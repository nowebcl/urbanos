import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether, HRFlowable, PageBreak
)
from reportlab.pdfgen import canvas

# Theme Palette (Urbanos Inmobiliaria)
NAVY_DARK = colors.HexColor("#0B132B")
NAVY_CARD = colors.HexColor("#1E293B")
ORANGE_BRAND = colors.HexColor("#EA580C")
TEAL_ACCENT = colors.HexColor("#0D9488")
BG_LIGHT = colors.HexColor("#F8FAFC")
BG_CARD_LIGHT = colors.HexColor("#F1F5F9")
TEXT_DARK = colors.HexColor("#1E293B")
TEXT_MUTED = colors.HexColor("#64748B")
BORDER_LIGHT = colors.HexColor("#CBD5E1")
SUCCESS_BG = colors.HexColor("#ECFDF5")
SUCCESS_BORDER = colors.HexColor("#10B981")
INFO_BG = colors.HexColor("#EFF6FF")
INFO_BORDER = colors.HexColor("#3B82F6")

class NumberedCanvas(canvas.Canvas):
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
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(NAVY_DARK)
            self.drawString(54, 750, "URBANOS GESTIÓN INMOBILIARIA")
            self.setFont("Helvetica", 8)
            self.setFillColor(TEXT_MUTED)
            self.drawRightString(612 - 54, 750, "Informe Técnico de Entrega & Manual de Accesos")
            
            self.setStrokeColor(BORDER_LIGHT)
            self.setLineWidth(0.75)
            self.line(54, 742, 612 - 54, 742)
            
        # Footer (all pages)
        self.setStrokeColor(BORDER_LIGHT)
        self.setLineWidth(0.75)
        self.line(54, 45, 612 - 54, 45)
        
        self.setFont("Helvetica", 8)
        self.setFillColor(TEXT_MUTED)
        self.drawString(54, 32, "https://urbanosinmobiliaria.cl — Documento Confidencial de Entrega")
        self.drawRightString(612 - 54, 32, f"Página {self._pageNumber} de {page_count}")
        
        self.restoreState()


def build_pdf(filename="Informe_Tecnico_Entrega_Urbanos.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=44,
        rightMargin=44,
        topMargin=48,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=NAVY_DARK,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=ORANGE_BRAND,
        spaceAfter=14
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=NAVY_DARK,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=14,
        textColor=ORANGE_BRAND,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK,
        spaceAfter=5
    )

    body_bold = ParagraphStyle(
        'Body_Bold_Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13,
        textColor=TEXT_DARK
    )

    code_style = ParagraphStyle(
        'Code_Custom',
        parent=styles['Normal'],
        fontName='Courier-Bold',
        fontSize=8.5,
        leading=11,
        textColor=NAVY_DARK
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=TEXT_DARK
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=NAVY_DARK
    )

    callout_text = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_DARK
    )

    story = []

    # 1. Header Banner & Title
    logo_path = os.path.join(os.path.dirname(__file__), "public", "logo.png")
    header_data = []
    
    if os.path.exists(logo_path):
        logo_img = Image(logo_path, width=130, height=40)
        logo_img.hAlign = 'LEFT'
        title_box = [
            Paragraph("INFORME TÉCNICO DE ENTREGA", title_style),
            Paragraph("Plataforma Web Inmobiliaria & Sistema de Gestión (CMS)", subtitle_style)
        ]
        header_table = Table([[logo_img, title_box]], colWidths=[140, 384])
        header_table.setStyle(TableStyle([
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('ALIGN', (0,0), (0,0), 'LEFT'),
            ('LEFTPADDING', (0,0), (-1,-1), 0),
            ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        story.append(header_table)
    else:
        story.append(Paragraph("INFORME TÉCNICO DE ENTREGA", title_style))
        story.append(Paragraph("Plataforma Web Inmobiliaria & Sistema de Gestión (CMS)", subtitle_style))

    story.append(HRFlowable(width="100%", thickness=1.5, color=ORANGE_BRAND, spaceBefore=4, spaceAfter=8))

    # Project Overview Info Box
    info_data = [
        [Paragraph("<b>Cliente:</b> Urbanos Gestión Inmobiliaria", body_style), Paragraph("<b>Fecha de Entrega:</b> Agosto 2026", body_style)],
        [Paragraph("<b>Dominio Principal:</b> https://urbanosinmobiliaria.cl", body_style), Paragraph("<b>Estado:</b> Producción (100% Operativo)", body_style)]
    ]
    info_table = Table(info_data, colWidths=[262, 262])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD_LIGHT),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 10))

    # SECTION 1: ACCESOS Y CREDENCIALES OFICIALES
    story.append(Paragraph("1. ACCESOS Y CREDENCIALES OFICIALES (DOMINIO .CL)", h1_style))
    story.append(Paragraph("A continuación se detallan los enlaces y credenciales de acceso bajo el dominio corporativo oficial:", body_style))

    cred_data = [
        [
            Paragraph("Servicio / Plataforma", table_header),
            Paragraph("Enlace Oficial (.cl)", table_header),
            Paragraph("Usuario / Correo", table_header),
            Paragraph("Contraseña Oficial", table_header)
        ],
        [
            Paragraph("<b>Sitio Web Público</b>", table_cell_bold),
            Paragraph("https://urbanosinmobiliaria.cl", table_cell),
            Paragraph("Acceso Abierto", table_cell),
            Paragraph("N/A", table_cell)
        ],
        [
            Paragraph("<b>Panel de Control (CMS)</b>", table_cell_bold),
            Paragraph("https://urbanosinmobiliaria.cl/admin", table_cell),
            Paragraph("<code>admin@urbanosinmobiliaria.cl</code><br/><i>o urbanos@urbanosinmobiliaria.cl</i>", table_cell),
            Paragraph("<code>Urbanos2026!Admin</code>", table_cell)
        ],
        [
            Paragraph("<b>Webmail Corporativo</b>", table_cell_bold),
            Paragraph("https://webmail.urbanosinmobiliaria.cl<br/><i>(o urbanosinmobiliaria.cl:2096)</i>", table_cell),
            Paragraph("<code>tu-cuenta@urbanosinmobiliaria.cl</code>", table_cell),
            Paragraph("Clave asignada a tu casilla", table_cell)
        ]
    ]
    cred_table = Table(cred_data, colWidths=[120, 164, 135, 105])
    cred_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY_DARK),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(cred_table)
    story.append(Spacer(1, 10))

    # SECTION 2: MANUAL Y TUTORIAL DE USO DEL CMS
    story.append(Paragraph("2. MANUAL Y TUTORIAL DE ADMINISTRACIÓN (CMS URBANOS)", h1_style))
    
    story.append(Paragraph("A. Inicio de Sesión y Barra Administrativa", h2_style))
    story.append(Paragraph(
        "1. Ingrese desde su navegador a <b>https://urbanosinmobiliaria.cl/admin</b>.<br/>"
        "2. Ingrese su correo (<code>admin@urbanosinmobiliaria.cl</code>) y contraseña oficial (<code>Urbanos2026!Admin</code>).<br/>"
        "3. Al ingresar, se activará el panel de administración y una barra flotante superior que le permitirá gestionar contenidos y regresar al catálogo público en cualquier momento.",
        body_style
    ))

    story.append(Paragraph("B. Publicación de Nuevas Propiedades", h2_style))
    story.append(Paragraph(
        "• <b>Formulario Principal:</b> Ingrese título del inmueble, código interno (ej: URB-1050), tipo de operación (Venta / Arriendo), tipo de inmueble (Casa, Departamento, Parcela, etc.), precio en UF o CLP, ubicación y características (dormitorios, baños, estacionamientos, superficie útil y total).<br/>"
        "• <b>Subida de Imágenes Automática:</b> Arrastre o seleccione la imagen principal y hasta 7 fotografías adicionales para la galería. El sistema cuenta con un <b>optimizador inteligente integrado</b> que convierte y comprime automáticamente los archivos al formato ultraligero <b>.WebP</b>, reduciendo el peso hasta en un 80% sin perder calidad visual.<br/>"
        "• <b>Publicación Instantánea:</b> Al presionar <i>'Publicar Propiedad'</i>, el inmueble queda disponible de inmediato en la base de datos y visible en el catálogo web.",
        body_style
    ))

    story.append(Paragraph("C. Edición y Eliminación de Inmuebles", h2_style))
    story.append(Paragraph(
        "• <b>Buscador en Tiempo Real:</b> Filtre el catálogo de propiedades por código, título o comuna.<br/>"
        "• <b>Edición:</b> Haga clic en el botón <i>'Editar'</i> (ícono de lápiz) sobre cualquier propiedad. Los datos se cargarán en el formulario superior para modificar valores, agregar fotos o corregir textos.<br/>"
        "• <b>Eliminar:</b> Presione <i>'Eliminar'</i> (ícono de papelera) y confirme para dar de baja la propiedad de forma inmediata.",
        body_style
    ))

    story.append(Paragraph("D. Gestión de Consultas y Prospectos (Leads)", h2_style))
    story.append(Paragraph(
        "En la pestaña <b>'Consultas / Leads'</b> se almacenan todas las solicitudes enviadas por clientes desde la web (nombre, teléfono, correo, propiedad consultada, fecha y mensaje completo), permitiendo un seguimiento comercial rápido y ordenado.",
        body_style
    ))

    story.append(Spacer(1, 8))

    # SECTION 3: GUÍA DE CONFIGURACIÓN DE CORREOS CORPORATIVOS
    story.append(Paragraph("3. CONFIGURACIÓN DE CORREOS CORPORATIVOS (@urbanosinmobiliaria.cl)", h1_style))
    
    story.append(Paragraph("Opción 1: Acceso Directo por Webmail (Navegador Web)", h2_style))
    story.append(Paragraph(
        "Permite revisar el correo desde cualquier dispositivo sin instalar aplicaciones:<br/>"
        "1. Ingrese a: <b>https://webmail.urbanosinmobiliaria.cl</b> (o directo en <code>https://urbanosinmobiliaria.cl:2096</code>).<br/>"
        "2. Ingrese su correo completo (ej: <code>urbanos@urbanosinmobiliaria.cl</code>) y su clave.<br/>"
        "3. Seleccione <b>Roundcube</b> para acceder a su bandeja de entrada y redactar correos.",
        body_style
    ))

    story.append(Paragraph("Opción 2: Configuración en Microsoft Outlook (PC, Mac, iPhone, Android)", h2_style))
    story.append(Paragraph("Para vincular la casilla corporativa en la app de Outlook, seleccione <b>Configuración Manual (IMAP)</b> con los siguientes parámetros técnicos:", body_style))

    email_params = [
        [Paragraph("Parámetro", table_header), Paragraph("Servidor Entrante (IMAP)", table_header), Paragraph("Servidor Saliente (SMTP)", table_header)],
        [Paragraph("<b>Nombre de Servidor</b>", table_cell_bold), Paragraph("<code>mail.urbanosinmobiliaria.cl</code>", table_cell), Paragraph("<code>mail.urbanosinmobiliaria.cl</code>", table_cell)],
        [Paragraph("<b>Puerto de Conexión</b>", table_cell_bold), Paragraph("<b>993</b>", table_cell), Paragraph("<b>465</b>", table_cell)],
        [Paragraph("<b>Tipo de Cifrado / Seguridad</b>", table_cell_bold), Paragraph("SSL / TLS (Obligatorio)", table_cell), Paragraph("SSL / TLS (Obligatorio)", table_cell)],
        [Paragraph("<b>Autenticación</b>", table_cell_bold), Paragraph("Correo completo y Contraseña", table_cell), Paragraph("Sí (Mismas credenciales que IMAP)", table_cell)]
    ]
    email_table = Table(email_params, colWidths=[150, 187, 187])
    email_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY_DARK),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,-1), 1, BORDER_LIGHT),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_LIGHT),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, BG_LIGHT]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(email_table)
    story.append(Spacer(1, 8))

    # SECTION 4: TÉRMINOS DE GARANTÍA Y SOPORTE TÉCNICO
    story.append(Paragraph("4. TÉRMINOS DE GARANTÍA, SOPORTE Y CONTINUIDAD OPERATIVA", h1_style))

    warranty_boxes = [
        [
            Paragraph("<b>GARANTÍA DE AJUSTES INICIALES</b><br/><b>Vigencia:</b> 1 Mes (30 días corridos)<br/><br/>"
                      "Cubre ajustes menores de diseño, afinamiento de textos, actualización de teléfonos o datos de contacto, "
                      "cambios de fotografías institucionales y ajustes en campos de formularios sin costo adicional.", callout_text),
            Paragraph("<b>GARANTÍA TÉCNICA DE PLATAFORMA</b><br/><b>Vigencia:</b> 12 Meses (1 Año Completo)<br/><br/>"
                      "Cubre corrección de bugs o errores de programación, mantenimiento de estabilidad en base de datos, "
                      "soporte ante incidentes en carga de imágenes, disponibilidad de APIs y respaldo técnico continuo.", callout_text)
        ]
    ]
    warranty_table = Table(warranty_boxes, colWidths=[257, 257])
    warranty_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), INFO_BG),
        ('BACKGROUND', (1,0), (1,0), SUCCESS_BG),
        ('BOX', (0,0), (0,0), 1, INFO_BORDER),
        ('BOX', (1,0), (1,0), 1, SUCCESS_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(warranty_table)
    story.append(Spacer(1, 12))

    # Final Sign-off Box
    signoff_p = Paragraph(
        "<b>Canal Oficial de Soporte y Mesa de Ayuda:</b><br/>"
        "Correo Electrónico: <code>contacto@urbanosinmobiliaria.cl</code> | Sitio Web: <b>https://urbanosinmobiliaria.cl</b><br/>"
        "<i>Documento oficial de entrega y conformidad técnica de software.</i>",
        body_style
    )
    story.append(signoff_p)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF successfully created: {filename}")

if __name__ == '__main__':
    output_pdf = sys.argv[1] if len(sys.argv) > 1 else "Informe_Tecnico_Entrega_Urbanos.pdf"
    build_pdf(output_pdf)
