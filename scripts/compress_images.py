import os
import sys
from PIL import Image

# Configurar salida UTF-8 para consola de Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

def compress_image_to_webp(input_path, output_path=None, max_size=(1600, 1200), quality=80):
    """
    Comprime una imagen y la convierte a formato WebP.
    """
    if not os.path.exists(input_path):
        print(f"[X] El archivo no existe: {input_path}")
        return False

    if output_path is None:
        base_name = os.path.splitext(input_path)[0]
        output_path = f"{base_name}.webp"

    try:
        with Image.open(input_path) as img:
            # Convertir RGBA/P a RGB si no tiene transparencia necesaria
            if img.mode in ("P", "CMYK"):
                img = img.convert("RGBA")

            # Redimensionar manteniendo proporción de aspecto
            img.thumbnail(max_size, Image.Resampling.LANCZOS)

            # Guardar en formato WebP con optimización
            img.save(output_path, "WEBP", quality=quality, optimize=True)

            orig_size = os.path.getsize(input_path) / 1024
            new_size = os.path.getsize(output_path) / 1024
            savings = max(0, int(((orig_size - new_size) / orig_size) * 100))

            print(f"[OK] Imagen optimizada a WebP con éxito:")
            print(f"   - Archivo origen:  {os.path.basename(input_path)} ({orig_size:.1f} KB)")
            print(f"   - Archivo WebP:    {os.path.basename(output_path)} ({new_size:.1f} KB)")
            print(f"   - Ahorro obtenido: {savings}%\n")
            return True
    except Exception as e:
        print(f"[X] Error al procesar {input_path}: {e}")
        return False

def compress_directory(dir_path, quality=80):
    """
    Escanea un directorio recursivamente y convierte archivos JPG, JPEG, PNG a WebP.
    """
    print(f"[*] Escaneando directorio: {dir_path}...\n")
    supported_exts = ('.jpg', '.jpeg', '.png', '.bmp', '.tiff')
    processed_count = 0

    for root, _, files in os.walk(dir_path):
        for file in files:
            if file.lower().endswith(supported_exts) and not file.lower().endswith('.webp'):
                full_path = os.path.join(root, file)
                compress_image_to_webp(full_path, quality=quality)
                processed_count += 1

    print(f"[*] ¡Proceso completado! Total de imágenes convertidas: {processed_count}")

if __name__ == '__main__':
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if os.path.isdir(target):
            compress_directory(target)
        else:
            compress_image_to_webp(target)
    else:
        # Por defecto escanea public/
        public_dir = os.path.join(project_root, "public")
        compress_directory(public_dir)
