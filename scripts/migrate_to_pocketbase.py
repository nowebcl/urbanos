import json
import re
import os
import urllib.request
import urllib.parse

PB_URL = 'https://urbano.noweb.tech'
ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl'
ADMIN_PASS = 'Urbano2026!'

def get_pb_token():
    url = f"{PB_URL}/api/collections/_superusers/auth-with-password"
    payload = json.dumps({"identity": ADMIN_EMAIL, "password": ADMIN_PASS}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(req) as response:
            res = json.loads(response.read().decode('utf-8'))
            return res.get('token')
    except Exception as e:
        print(f"Error auth _superusers: {e}")
        # Try legacy admins
        url_legacy = f"{PB_URL}/api/admins/auth-with-password"
        req_legacy = urllib.request.Request(url_legacy, data=payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req_legacy) as response:
            res = json.loads(response.read().decode('utf-8'))
            return res.get('token')

def pb_request(endpoint, method='GET', data=None, token=None):
    url = f"{PB_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    if token:
        headers['Authorization'] = token
    
    payload = json.dumps(data).encode('utf-8') if data is not None else None
    req = urllib.request.Request(url, data=payload, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        print(f"HTTP Error {e.code} on {method} {endpoint}: {body}")
        raise e

def create_or_update_collection(token, col_def):
    name = col_def['name']
    try:
        existing = pb_request(f"/api/collections/{name}", method='GET', token=token)
        print(f"Colección '{name}' ya existe (id: {existing['id']})")
        return existing
    except:
        print(f"Creando colección '{name}'...")
        created = pb_request("/api/collections", method='POST', data=col_def, token=token)
        print(f"✅ Colección '{name}' creada con éxito (id: {created['id']})")
        return created

def main():
    token = get_pb_token()
    print("✅ Token obtenido exitosamente.")

    # 1. Definir colecciones
    collections = [
        {
            "name": "properties",
            "type": "base",
            "fields": [
                {"name": "legacy_id", "type": "number"},
                {"name": "code", "type": "text"},
                {"name": "slug", "type": "text"},
                {"name": "title", "type": "text", "required": True},
                {"name": "commune", "type": "text"},
                {"name": "location", "type": "text"},
                {"name": "address", "type": "text"},
                {"name": "price_display", "type": "text"},
                {"name": "price_uf", "type": "number"},
                {"name": "price_clp", "type": "number"},
                {"name": "bedrooms", "type": "number"},
                {"name": "bathrooms", "type": "number"},
                {"name": "parking", "type": "number"},
                {"name": "area", "type": "text"},
                {"name": "land_area", "type": "text"},
                {"name": "is_featured", "type": "bool"},
                {"name": "operation", "type": "text"},
                {"name": "type", "type": "text"},
                {"name": "image", "type": "text"},
                {"name": "gallery", "type": "json"},
                {"name": "description", "type": "text"},
                {"name": "features", "type": "json"},
                {"name": "map_coords", "type": "json"}
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        },
        {
            "name": "leads",
            "type": "base",
            "fields": [
                {"name": "name", "type": "text", "required": True},
                {"name": "email", "type": "text", "required": True},
                {"name": "phone", "type": "text"},
                {"name": "message", "type": "text"},
                {"name": "property_code", "type": "text"}
            ],
            "listRule": "@request.auth.id != ''",
            "viewRule": "@request.auth.id != ''",
            "createRule": "",
            "updateRule": "@request.auth.id != ''",
            "deleteRule": "@request.auth.id != ''"
        },
        {
            "name": "orders",
            "type": "base",
            "fields": [
                {"name": "order_type", "type": "text", "required": True},
                {"name": "name", "type": "text", "required": True},
                {"name": "phone", "type": "text", "required": True},
                {"name": "email", "type": "text", "required": True},
                {"name": "commune", "type": "text"},
                {"name": "operation_type", "type": "text"},
                {"name": "property_type", "type": "text"},
                {"name": "details", "type": "text"},
                {"name": "offer_amount", "type": "text"},
                {"name": "target_property", "type": "text"}
            ],
            "listRule": "@request.auth.id != ''",
            "viewRule": "@request.auth.id != ''",
            "createRule": "",
            "updateRule": "@request.auth.id != ''",
            "deleteRule": "@request.auth.id != ''"
        },
        {
            "name": "site_content",
            "type": "base",
            "fields": [
                {"name": "key", "type": "text", "required": True},
                {"name": "content", "type": "json"}
            ],
            "listRule": "",
            "viewRule": "",
            "createRule": "",
            "updateRule": "",
            "deleteRule": ""
        }
    ]

    for col in collections:
        create_or_update_collection(token, col)

    # 2. Cargar propiedades
    properties_by_code = {}

    # Desde el dump de Supabase
    if os.path.exists('scripts/supabase_dump_properties.json'):
        with open('scripts/supabase_dump_properties.json', 'r', encoding='utf-8') as f:
            dump_data = json.load(f)
            for p in dump_data:
                properties_by_code[p.get('code') or p.get('slug')] = {
                    "legacy_id": p.get('id'),
                    "code": p.get('code', ''),
                    "slug": p.get('slug', ''),
                    "title": p.get('title', ''),
                    "commune": p.get('commune', ''),
                    "location": p.get('location', ''),
                    "address": p.get('address', ''),
                    "price_display": p.get('price_display', ''),
                    "price_uf": float(p.get('price_uf') or 0),
                    "price_clp": float(p.get('price_clp') or 0),
                    "bedrooms": int(p.get('bedrooms') or 0),
                    "bathrooms": int(p.get('bathrooms') or 0),
                    "parking": int(p.get('parking') or 0),
                    "area": str(p.get('area') or ''),
                    "land_area": str(p.get('land_area') or ''),
                    "is_featured": bool(p.get('is_featured')),
                    "operation": p.get('operation', ''),
                    "type": p.get('type', ''),
                    "image": p.get('image', ''),
                    "gallery": p.get('gallery') if isinstance(p.get('gallery'), list) else [],
                    "description": p.get('description', ''),
                    "features": p.get('features') if isinstance(p.get('features'), list) else [],
                    "map_coords": p.get('map_coords') if isinstance(p.get('map_coords'), dict) else {"lat": -41.4693, "lng": -72.9424}
                }
            print(f"Cargadas {len(properties_by_code)} propiedades de Supabase dump.")

    # 3. Cargar agentes
    agents = [
        {
            "name": "Cristián Muñoz",
            "role": "Agente Inmobiliario Senior",
            "phone": "+56 9 6192 4570",
            "email": "urbanos@urbanosinmobiliaria.cl",
            "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
        },
        {
            "name": "Felipe Loyola",
            "role": "Director Comercial & Broker",
            "phone": "+56 9 9593 0321",
            "email": "contacto@urbanosgestion.cl",
            "image": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
        }
    ]

    print("\n--- Migrando Agentes a PocketBase ---")
    existing_agents = pb_request("/api/collections/agents/records", token=token).get('items', [])
    existing_agent_names = {a['name'] for a in existing_agents}
    for ag in agents:
        if ag['name'] not in existing_agent_names:
            pb_request("/api/collections/agents/records", method='POST', data=ag, token=token)
            print(f"  + Agente '{ag['name']}' insertado.")
        else:
            print(f"  = Agente '{ag['name']}' ya existe.")

    # 4. Migrar Propiedades
    print(f"\n--- Migrando {len(properties_by_code)} Propiedades a PocketBase ---")
    
    # Obtener propiedades existentes en PocketBase para no duplicar
    existing_pb_props = []
    page = 1
    while True:
        res = pb_request(f"/api/collections/properties/records?page={page}&perPage=50", token=token)
        items = res.get('items', [])
        existing_pb_props.extend(items)
        if page >= res.get('totalPages', 1):
            break
        page += 1

    existing_slugs = {p.get('slug') for p in existing_pb_props if p.get('slug')}
    existing_codes = {p.get('code') for p in existing_pb_props if p.get('code')}

    inserted_count = 0
    skipped_count = 0

    for key, prop in properties_by_code.items():
        if prop['slug'] in existing_slugs or (prop['code'] and prop['code'] in existing_codes):
            skipped_count += 1
            continue
        
        try:
            pb_request("/api/collections/properties/records", method='POST', data=prop, token=token)
            inserted_count += 1
            if inserted_count % 10 == 0 or inserted_count == len(properties_by_code):
                print(f"  -> {inserted_count} propiedades migradas...")
        except Exception as err:
            print(f"  ❌ Error insertando propiedad {prop.get('code')} - {prop.get('title')}: {err}")

    print(f"\n✅ Resumen de migración de propiedades:")
    print(f"   Insertadas nuevas: {inserted_count}")
    print(f"   Omitidas (ya existían): {skipped_count}")
    print(f"   Total en PocketBase: {len(existing_pb_props) + inserted_count}")

if __name__ == '__main__':
    main()
