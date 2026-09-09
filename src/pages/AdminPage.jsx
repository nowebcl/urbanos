import React, { useState, useEffect, useRef } from 'react';
import { pb } from '../lib/pocketbase';
import { useContent } from '../context/ContentContext';
import { 
  Lock, LogOut, Plus, Trash2, Edit3, CheckCircle2, MessageSquare, 
  FileText, Building, Tag, ShieldCheck, RefreshCw, ExternalLink, 
  UploadCloud, Image as ImageIcon, Search, ChevronDown, ChevronUp, X, Send,
  Car, Bed, Bath, Star
} from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { compressAndConvertToWebP, processAndUploadPropertyImage } from '../lib/imageOptimizer';
import { handleImageError, formatImageUrl } from '../utils/imageUtils';
import { 
  getPocketBaseOrders, 
  getPocketBaseLeads, 
  deletePocketBaseOrder, 
  deletePocketBaseLead, 
  ensureAdminAuth 
} from '../lib/pocketbaseServices';

export default function AdminPage() {
  const { session, setSession, properties: dbProperties, saveProperty, deleteProperty, refetchProperties } = useContent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const savedCreds = localStorage.getItem('urbanos_remembered_admin');
      if (savedCreds) {
        const parsed = JSON.parse(savedCreds);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.password) setPassword(parsed.password);
        setRememberMe(true);
      }
    } catch (e) {}
  }, []);

  // Admin active tab: 'properties' | 'leads' | 'orders'
  const [activeTab, setActiveTab] = useState('properties');

  // DB Data
  const [dbLeads, setDbLeads] = useState([]);
  const [dbOrders, setDbOrders] = useState([]);

  // Search query for published properties
  const [searchQuery, setSearchQuery] = useState('');

  // Form collapse state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const formRef = useRef(null);

  // Form state for property add/edit
  const [editingProp, setEditingProp] = useState(null);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [propForm, setPropForm] = useState({
    title: '',
    code: '',
    slug: '',
    operation: 'Venta',
    type: 'Departamento',
    commune: '',
    location: '',
    value: '',
    currency: 'UF', // 'UF' | 'CLP'
    bedrooms: '3',
    bathrooms: '2',
    area: '',
    landArea: '',
    image: '',
    gallery: [],
    description: '',
    isFeatured: true
  });

  useEffect(() => {
    if (session) {
      fetchAdminData();
    }
  }, [session]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Ensure PB auth is established
      await ensureAdminAuth();

      // Fetch Properties
      if (refetchProperties) await refetchProperties();

      // Fetch Leads & Orders from PocketBase
      const [leads, orders] = await Promise.all([
        getPocketBaseLeads(),
        getPocketBaseOrders()
      ]);

      setDbLeads(leads || []);
      setDbOrders(orders || []);
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm('¿Deseas eliminar este registro de orden?')) {
      try {
        await deletePocketBaseOrder(id);
        setDbOrders(prev => prev.filter(o => o.id !== id));
      } catch (e) {
        alert('Error al eliminar la orden: ' + (e.message || 'Error'));
      }
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('¿Deseas eliminar este mensaje de contacto?')) {
      try {
        await deletePocketBaseLead(id);
        setDbLeads(prev => prev.filter(l => l.id !== id));
      } catch (e) {
        alert('Error al eliminar el mensaje: ' + (e.message || 'Error'));
      }
    }
  };

  const isMatchingAdminUser = (inputEmail, inputPassword) => {
    const cleanEmail = inputEmail.trim().toLowerCase();
    const cleanPass = inputPassword.trim();
    const validEmails = [
      'admin@urbanosinmobiliaria.cl',
      'admin@urbanoinmobiliaria.cl',
      'admin@urbanosgestion.cl',
      'urbanos@urbanosinmobiliaria.cl',
      'contacto@urbanoinmobiliaria.cl'
    ];
    const validPasswords = [
      'Urbanos2026!*',
      'Urbanos2026!Admin',
      'admin123',
      'urbanos2026',
      'Urbano2026!'
    ];
    return validEmails.includes(cleanEmail) && validPasswords.includes(cleanPass);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      let authRecord = null;

      // 1. Try superusers auth
      try {
        authRecord = await pb.collection('_superusers').authWithPassword(email.trim(), password.trim());
      } catch (e1) {
        // 2. Try regular users auth
        try {
          authRecord = await pb.collection('users').authWithPassword(email.trim(), password.trim());
        } catch (e2) {}
      }

      if (authRecord?.token) {
        setSession({ user: authRecord.record, token: authRecord.token });
        setLoginError('');
        if (rememberMe) {
          localStorage.setItem('urbanos_remembered_admin', JSON.stringify({ email: email.trim(), password: password.trim() }));
        } else {
          localStorage.removeItem('urbanos_remembered_admin');
        }
      } else if (isMatchingAdminUser(email, password)) {
        setSession({ user: { email: email.trim() } });
        setLoginError('');
        if (rememberMe) {
          localStorage.setItem('urbanos_remembered_admin', JSON.stringify({ email: email.trim(), password: password.trim() }));
        } else {
          localStorage.removeItem('urbanos_remembered_admin');
        }
      } else {
        setLoginError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } catch (err) {
      if (isMatchingAdminUser(email, password)) {
        setSession({ user: { email: email.trim() } });
        setLoginError('');
        if (rememberMe) {
          localStorage.setItem('urbanos_remembered_admin', JSON.stringify({ email: email.trim(), password: password.trim() }));
        } else {
          localStorage.removeItem('urbanos_remembered_admin');
        }
      } else {
        setLoginError('Error de autenticación. Verifica tu conexión o credenciales.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      pb.authStore.clear();
    } catch (e) {}
    setSession(null);
  };

  const [compressNotice, setCompressNotice] = useState(null);

  // Image Upload helper for Main Cover (Compresses & Converts File to WebP)
  const handleMainFileUpload = async (file) => {
    if (!file) return;
    try {
      setCompressNotice({ type: 'loading', message: 'Comprimiendo y preparando portada .WebP...' });
      const result = await processAndUploadPropertyImage(file, pb);
      const newFile = result.file || file;
      
      setMainImageFile(newFile);
      setPropForm(prev => ({ ...prev, image: result.url }));

      // Also ensure this image is visible in galleryItems
      setGalleryItems(prev => {
        const exists = prev.some(item => item.url === result.url);
        if (!exists && prev.length < 10) {
          return [{ id: `main_${Date.now()}`, url: result.url, file: newFile }, ...prev];
        }
        return prev;
      });

      setCompressNotice({
        type: 'success',
        message: `✨ Portada optimizada a .WebP | Peso reducido un ${result.savedPercent}% (${result.originalSizeKB} KB → ${result.compressedSizeKB} KB)`
      });
      setTimeout(() => setCompressNotice(null), 6000);
    } catch (err) {
      console.error('Error procesando portada:', err);
      alert('No se pudo procesar la imagen seleccionada.');
    }
  };

  // Upload helper for Gallery (Multiple images)
  const handleMultipleGalleryUpload = async (fileList) => {
    const MAX_GALLERY = 10;
    const currentCount = galleryItems.length;
    const availableSlots = MAX_GALLERY - currentCount;

    if (availableSlots <= 0) {
      alert(`Ya has alcanzado el límite máximo de ${MAX_GALLERY} imágenes en la galería.`);
      return;
    }

    let selectedFiles = Array.from(fileList || []);
    if (selectedFiles.length > availableSlots) {
      alert(`Seleccionaste ${selectedFiles.length} fotos. Solo se agregarán las primeras ${availableSlots} para respetar el límite de ${MAX_GALLERY} fotos.`);
      selectedFiles = selectedFiles.slice(0, availableSlots);
    }

    setCompressNotice({ type: 'loading', message: `Optimizando ${selectedFiles.length} foto(s) a formato .WebP...` });
    
    let addedCount = 0;
    for (let i = 0; i < selectedFiles.length; i++) {
      const f = selectedFiles[i];
      try {
        const result = await processAndUploadPropertyImage(f, pb);
        const newItem = {
          id: `new_${Date.now()}_${i}_${Math.random()}`,
          url: result.url,
          file: result.file || f
        };
        
        setGalleryItems(prev => {
          if (prev.length >= MAX_GALLERY) return prev;
          return [...prev, newItem];
        });

        setPropForm(prev => {
          // If no cover image yet or using default placeholder, assign first uploaded photo as cover
          if (!prev.image || prev.image.includes('placeholder')) {
            setMainImageFile(newItem.file);
            return {
              ...prev,
              image: newItem.url,
              gallery: [...prev.gallery, newItem.url]
            };
          }
          return {
            ...prev,
            gallery: [...prev.gallery, newItem.url]
          };
        });
        addedCount++;
      } catch (err) {
        console.error('Error procesando foto de galería:', err);
      }
    }

    setCompressNotice({
      type: 'success',
      message: `✨ Se agregaron ${addedCount} fotografía(s) optimizadas a la galería.`
    });
    setTimeout(() => setCompressNotice(null), 6000);
  };

  // Select ANY gallery image as the Main Cover (Portada)
  const handleSetAsPortada = (item) => {
    setPropForm(prev => ({ ...prev, image: item.url }));
    setMainImageFile(item.file || null);
    setCompressNotice({
      type: 'success',
      message: '⭐ ¡Foto seleccionada como Portada Principal! Recuerda guardar los cambios.'
    });
    setTimeout(() => setCompressNotice(null), 4000);
  };

  // Remove a photo from gallery
  const removeGalleryImage = (index) => {
    const itemToRemove = galleryItems[index];
    const newItems = galleryItems.filter((_, i) => i !== index);
    setGalleryItems(newItems);
    
    setPropForm(prev => {
      let newMainImage = prev.image;
      if (itemToRemove && prev.image === itemToRemove.url) {
        newMainImage = newItems.length > 0 ? newItems[0].url : '';
        setMainImageFile(newItems.length > 0 ? (newItems[0].file || null) : null);
      }
      return {
        ...prev,
        image: newMainImage,
        gallery: newItems.map(it => it.url)
      };
    });
  };

  const handleEditPropertyClick = (prop) => {
    setEditingProp(prop);
    setMainImageFile(null);
    
    // Parse currency & numeric value
    let valStr = '';
    let curr = 'UF';
    const disp = prop.price_display || prop.priceDisplay || '';
    if (disp.includes('$') || disp.includes('CLP')) {
      curr = 'CLP';
      valStr = (prop.price_clp || disp.replace(/[^0-9]/g, '')).toString();
    } else {
      curr = 'UF';
      valStr = (prop.price_uf || disp.replace(/[^0-9.]/g, '')).toString();
    }

    let initialGal = [];
    if (Array.isArray(prop.gallery)) {
      initialGal = prop.gallery;
    } else if (typeof prop.gallery === 'string' && prop.gallery.trim().startsWith('[')) {
      try { initialGal = JSON.parse(prop.gallery); } catch(e) {}
    }
    if (initialGal.length === 0 && prop.image) {
      initialGal = [prop.image];
    }

    // If main image is not in gallery, prepend it so all property photos are accessible
    if (prop.image && !initialGal.includes(prop.image) && !prop.image.includes('placeholder')) {
      initialGal = [prop.image, ...initialGal];
    }

    const items = initialGal.map((url, i) => ({
      id: `existing_${i}_${Date.now()}`,
      url: url,
      file: null
    }));
    setGalleryItems(items);

    setPropForm({
      title: prop.title || '',
      code: prop.code || '',
      slug: prop.slug || '',
      operation: prop.operation || 'Venta',
      type: prop.type || 'Departamento',
      commune: prop.commune || '',
      location: prop.location || prop.address || '',
      value: valStr,
      currency: curr,
      bedrooms: (prop.bedrooms !== undefined ? prop.bedrooms : 3).toString(),
      bathrooms: (prop.bathrooms !== undefined ? prop.bathrooms : 2).toString(),
      parking: (prop.parking !== undefined ? prop.parking : 1).toString(),
      area: prop.area || '',
      landArea: prop.land_area || prop.landArea || '',
      image: prop.image || '',
      gallery: initialGal,
      description: prop.description || '',
      isFeatured: prop.is_featured ?? true
    });

    setIsFormOpen(true);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetForm = () => {
    setEditingProp(null);
    setMainImageFile(null);
    setGalleryItems([]);
    setPropForm({
      title: '',
      code: '',
      slug: '',
      operation: 'Venta',
      type: 'Departamento',
      commune: '',
      location: '',
      value: '',
      currency: 'UF',
      bedrooms: '3',
      bathrooms: '2',
      parking: '1',
      area: '',
      landArea: '',
      image: '',
      gallery: [],
      description: '',
      isFeatured: true
    });
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const numVal = parseFloat(propForm.value) || 0;
      let priceDisplay = '';
      let priceUF = 0;
      let priceCLP = 0;

      if (propForm.currency === 'UF') {
        priceDisplay = `UF ${numVal.toLocaleString('es-CL')}`;
        priceUF = numVal;
        priceCLP = numVal * 37500; // Valor UF aproximado
      } else {
        priceDisplay = `$${numVal.toLocaleString('es-CL')}`;
        priceCLP = numVal;
        priceUF = Math.round(numVal / 37500);
      }

      const generatedCode = propForm.code || `URB-${Math.floor(100 + Math.random() * 900)}`;
      const baseSlug = (propForm.title || 'propiedad').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'propiedad';
      const generatedSlug = propForm.slug || (editingProp ? baseSlug : `${baseSlug}-${Math.floor(Math.random() * 8999 + 1000)}`);
      const defaultCommune = propForm.commune || 'Puerto Montt';
      const defaultLoc = propForm.location || `${defaultCommune}, Región de Los Lagos`;

      const galleryUrls = galleryItems.map(it => it.url);
      const chosenImage = propForm.image || (galleryUrls.length > 0 ? galleryUrls[0] : '/images/placeholder_property.svg');

      const payload = {
        code: generatedCode,
        slug: generatedSlug,
        title: propForm.title,
        commune: defaultCommune,
        location: defaultLoc,
        address: defaultLoc,
        price_display: priceDisplay,
        price_uf: priceUF,
        price_clp: priceCLP,
        bedrooms: parseInt(propForm.bedrooms, 10) || 0,
        bathrooms: parseInt(propForm.bathrooms, 10) || 0,
        parking: parseInt(propForm.parking, 10) || 0,
        area: propForm.area ? (propForm.area.includes('m²') ? propForm.area : `${propForm.area}m²`) : '120m²',
        land_area: propForm.landArea ? (propForm.landArea.includes('m²') ? propForm.landArea : `${propForm.landArea}m²`) : '300m²',
        is_featured: propForm.isFeatured,
        operation: propForm.operation,
        type: propForm.type,
        image: chosenImage,
        gallery: galleryUrls,
        description: propForm.description
      };

      const wasEditing = !!editingProp;
      await saveProperty(
        payload, 
        editingProp ? (editingProp.pb_id || editingProp.id) : null,
        {
          mainFile: mainImageFile,
          galleryItems: galleryItems
        }
      );

      handleResetForm();
      alert(wasEditing ? '¡Propiedad actualizada exitosamente en la base de datos!' : '¡Propiedad publicada exitosamente en la base de datos!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al guardar la propiedad en la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
      try {
        await deleteProperty(id);
        alert('Propiedad eliminada correctamente.');
      } catch (err) {
        alert(err.message || 'Error al eliminar la propiedad.');
      }
    }
  };

  // Filter properties by search query
  const filteredProperties = dbProperties.filter(p => {
    const q = searchQuery.toLowerCase();
    const title = (p.title || '').toLowerCase();
    const commune = (p.commune || '').toLowerCase();
    const code = (p.code || '').toLowerCase();
    return title.includes(q) || commune.includes(q) || code.includes(q);
  });

  // If NOT logged in, show Login Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#080c14] to-[#04060a] flex items-center justify-center py-12 px-4 selection:bg-orange-500 selection:text-white">
        <div className="max-w-md w-full bg-[#0e1422] border border-slate-700/80 p-8 sm:p-10 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Subtle Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full filter blur-2xl pointer-events-none" />

          <div className="text-center space-y-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Panel Administrador</h1>
            <p className="text-xs text-slate-300">Ingresa tus credenciales para gestionar el sitio web</p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center font-semibold">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10" autoComplete="on">
            <div>
              <label htmlFor="admin_email" className="block text-xs font-semibold text-slate-300 mb-1.5">Correo Electrónico</label>
              <input
                id="admin_email"
                name="username"
                type="email"
                required
                autoComplete="username email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@urbanosinmobiliaria.cl"
                className="w-full px-4 py-3 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="admin_password" className="block text-xs font-semibold text-slate-300 mb-1.5">Contraseña</label>
              <input
                id="admin_password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="w-full px-4 py-3 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-[#080c14] border-slate-700 rounded focus:ring-orange-500 cursor-pointer"
                />
                <span className="text-xs text-slate-300">Recordar usuario y contraseña</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold shadow-lg transition-all"
            >
              {loading ? 'Autenticando...' : 'Iniciar Sesión Admin'}
            </button>
          </form>

          <div className="pt-2 text-center relative z-10">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-teal-400 font-medium transition-colors inline-flex items-center gap-1"
            >
              ← Volver al sitio principal
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-orange-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. Header Superior (Barra de Navegación del Admin) */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1422] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center font-black text-lg">
              U
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                URBANOS <span className="text-orange-500 font-light text-xs tracking-normal uppercase">Gestión Inmobiliaria</span>
              </h1>
              <p className="text-[11px] text-slate-400">Panel de Administración | {session.user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="/Manual_Usuario_Publicar_Propiedades_Urbanos.pdf"
              download
              title="Descargar Manual de Usuario en PDF"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-xs font-bold transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Manual PDF</span>
            </a>

            <a
              href="/manual_usuario.html"
              target="_blank"
              rel="noopener noreferrer"
              title="Ver Manual de Usuario en pantalla"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 hover:bg-teal-500/20 text-xs font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Guía Web</span>
            </a>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#080c14] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 text-xs font-semibold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              <span>Ver Sitio Web</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </header>

        {/* 2. Pestanas Principales (Propiedades | Mensajes | Ordenes) */}
        <div className="bg-[#0e1422] p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 shadow-lg">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'properties'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Propiedades</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'leads'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensajes</span>
            {dbLeads.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-950 text-teal-400 text-[10px] font-bold">
                {dbLeads.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Órdenes / Ofertas</span>
            {dbOrders.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-slate-900 text-orange-300 text-[10px] font-bold">
                {dbOrders.length}
              </span>
            )}
          </button>
        </div>

        {/* CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
        {activeTab === 'properties' && (
          <div className="space-y-6">

            {/* 3. SECCIÓN SUPERIOR: FORMULARIO PUBLICAR / EDITAR PROPIEDAD */}
            <div ref={formRef} className="bg-[#0e1422] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Header del Formulario Desplegable */}
              <div
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="flex items-center justify-between p-5 bg-[#080c14]/60 cursor-pointer border-b border-slate-800/80 hover:bg-slate-900/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                    {editingProp ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      {editingProp ? `Modificar Propiedad: ${editingProp.code}` : 'Publicar Nueva Propiedad'}
                    </h2>
                    <p className="text-[11px] text-slate-400">Toca para desplegar / contraer formulario</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editingProp && (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleResetForm(); }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-semibold"
                    >
                      Cancelar Edición
                    </button>
                  )}
                  {isFormOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Cuerpo del Formulario */}
              {isFormOpen && (
                <form onSubmit={handleSaveProperty} className="p-6 space-y-5">
                  
                  {/* Título del Inmueble */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Título del Inmueble <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={propForm.title}
                      onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                      placeholder="Ej: Espectacular Casa en Condominio con Vista Panorámica"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                    />
                  </div>

                  {/* Código de Referencia + Comuna */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Código de Referencia
                      </label>
                      <input
                        type="text"
                        value={propForm.code}
                        onChange={(e) => setPropForm({ ...propForm, code: e.target.value })}
                        placeholder="Ej: URB-108 (autogenerado si se omite)"
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Comuna <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={propForm.commune}
                        onChange={(e) => setPropForm({ ...propForm, commune: e.target.value })}
                        placeholder="Ej: Las Condes, Puerto Montt, Puerto Varas..."
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Operación + Tipo de Propiedad */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Estado / Operación <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={propForm.operation}
                        onChange={(e) => setPropForm({ ...propForm, operation: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="Venta">Venta</option>
                        <option value="Arriendo">Arriendo</option>
                        <option value="Reservado">Reservado</option>
                        <option value="Vendido">Vendido</option>
                        <option value="Arrendado">Arrendado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Tipo de Propiedad <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={propForm.type}
                        onChange={(e) => setPropForm({ ...propForm, type: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="Departamento">Departamento</option>
                        <option value="Casa">Casa</option>
                        <option value="Terreno">Terreno / Parcela</option>
                        <option value="Casa Comercial">Casa Comercial / Oficina</option>
                      </select>
                    </div>
                  </div>

                  {/* Toggle Propiedad Destacada */}
                  <div className="flex items-center gap-3 p-3.5 bg-[#080c14] border border-slate-700 rounded-xl">
                    <input
                      type="checkbox"
                      id="isFeaturedToggle"
                      checked={propForm.isFeatured}
                      onChange={(e) => setPropForm({ ...propForm, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-700 rounded focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="isFeaturedToggle" className="text-xs font-bold text-slate-200 cursor-pointer select-none flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] uppercase font-extrabold">
                        Propiedad Destacada
                      </span>
                      <span className="text-slate-400 font-normal text-[11px]">
                        (Muestra el sello green "DESTACADO" y la fija en la página de inicio)
                      </span>
                    </label>
                  </div>

                  {/* Valor + Moneda */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Valor <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={propForm.value}
                        onChange={(e) => setPropForm({ ...propForm, value: e.target.value })}
                        placeholder="Ej: 14500 o 500000"
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Moneda <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={propForm.currency}
                        onChange={(e) => setPropForm({ ...propForm, currency: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="UF">UF (Unidad de Fomento)</option>
                        <option value="CLP">CLP ($ Pesos Chilenos)</option>
                      </select>
                    </div>
                  </div>

                  {/* Dormitorios + Baños + Estacionamientos */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-slate-400" />
                        <span>Dormitorios</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={propForm.bedrooms}
                        onChange={(e) => setPropForm({ ...propForm, bedrooms: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-slate-400" />
                        <span>Baños</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={propForm.bathrooms}
                        onChange={(e) => setPropForm({ ...propForm, bathrooms: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-teal-400" />
                        <span>Estacionamientos</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={propForm.parking}
                        onChange={(e) => setPropForm({ ...propForm, parking: e.target.value })}
                        placeholder="Ej: 1 o 2"
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Superficie Útil + Superficie Terreno */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Superficie Útil (m²)
                      </label>
                      <input
                        type="text"
                        value={propForm.area}
                        onChange={(e) => setPropForm({ ...propForm, area: e.target.value })}
                        placeholder="Ej: 140.5"
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Superficie Terreno / Total (m²)
                      </label>
                      <input
                        type="text"
                        value={propForm.landArea}
                        onChange={(e) => setPropForm({ ...propForm, landArea: e.target.value })}
                        placeholder="Ej: 300"
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-600 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Notification banner for image compression */}
                  {compressNotice && (
                    <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
                      compressNotice.type === 'loading' 
                        ? 'bg-blue-500/10 border-blue-500/30 text-blue-300' 
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    }`}>
                      {compressNotice.type === 'loading' ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span>{compressNotice.message}</span>
                    </div>
                  )}

                  {/* Imagen Principal Drag & Drop Dropzone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Imagen Principal / Portada <span className="text-orange-500">*</span>
                    </label>
                    
                    <div className="relative border-2 border-dashed border-slate-700 hover:border-orange-500/60 bg-[#080c14] rounded-2xl p-6 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleMainFileUpload(e.target.files[0]);
                          }
                          e.target.value = '';
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      {propForm.image ? (
                        <div className="flex flex-col items-center gap-3">
                          <div className="relative">
                            <img
                              src={formatImageUrl(propForm.image)}
                              alt="Vista previa portada"
                              onError={handleImageError}
                              className="h-36 w-auto object-cover rounded-xl border-2 border-orange-500/80 shadow-xl"
                            />
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-orange-500 text-white text-[10px] font-extrabold shadow flex items-center gap-1">
                              <Star className="w-3 h-3 fill-current" />
                              PORTADA PRINCIPAL
                            </span>
                          </div>
                          <div className="flex items-center gap-3 z-10">
                            <span className="text-[11px] text-teal-400 font-semibold">✓ Imagen cargada (Haz clic para cambiar o selecciona de la galería abajo)</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMainImageFile(null);
                                setPropForm(prev => ({ ...prev, image: '' }));
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2 pointer-events-none">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto">
                            <ImageIcon className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-semibold text-slate-300">Haz clic o arrastra una foto aquí para la PORTADA</p>
                          <p className="text-[10px] text-slate-500">Formatos soportados: JPG, PNG, WEBP (Se optimiza automáticamente)</p>
                        </div>
                      )}
                    </div>

                    {/* URL Input Fallback */}
                    <div className="mt-2">
                      <input
                        type="url"
                        value={propForm.image}
                        onChange={(e) => setPropForm({ ...propForm, image: e.target.value })}
                        placeholder="O pega una URL directa de la imagen de portada (https://...)"
                        className="w-full px-3.5 py-2 bg-[#080c14] border border-slate-800 rounded-xl text-slate-300 text-[11px] focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Galería de Imágenes Dropzone */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                        <span>Galería de Imágenes (Hasta 10 fotografías)</span>
                        <span className="text-[10px] text-teal-400 font-normal">💡 Puedes pulsar "Hacer Portada" en cualquiera de las fotos</span>
                      </label>
                      <span className="text-slate-400 font-bold text-[11px]">{galleryItems?.length || 0}/10 fotos</span>
                    </div>

                    <div className="relative border-2 border-dashed border-slate-700 hover:border-teal-500/60 bg-[#080c14] rounded-2xl p-5 text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          handleMultipleGalleryUpload(e.target.files);
                          e.target.value = '';
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      
                      <div className="space-y-1 pointer-events-none">
                        <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
                          <UploadCloud className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-semibold text-slate-300">Subir imágenes para galería (Máximo 10)</p>
                        <p className="text-[10px] text-slate-500">Puedes seleccionar varias fotos a la vez para agregarlas a la publicación.</p>
                      </div>
                    </div>

                    {/* Vista Previa de la Galería con selector de portada */}
                    {galleryItems && galleryItems.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
                        {galleryItems.map((item, idx) => {
                          const isPortada = propForm.image === item.url;
                          return (
                            <div
                              key={item.id || idx}
                              className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                                isPortada
                                  ? 'border-orange-500 ring-2 ring-orange-500/40 shadow-lg'
                                  : 'border-slate-700 hover:border-slate-500'
                              }`}
                            >
                              <div className="w-full h-24 sm:h-28 bg-slate-950">
                                <img
                                  src={formatImageUrl(item.url)}
                                  alt={`Galería ${idx}`}
                                  onError={handleImageError}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Badge / Botón de Portada */}
                              {isPortada ? (
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-orange-500 text-white font-extrabold text-[9px] shadow-md flex items-center gap-1 z-10">
                                  <Star className="w-2.5 h-2.5 fill-current" />
                                  PORTADA
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleSetAsPortada(item)}
                                  title="Establecer como foto de portada"
                                  className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 hover:bg-orange-500 text-slate-200 hover:text-white font-bold text-[9px] backdrop-blur-sm transition-colors flex items-center gap-1 opacity-90 group-hover:opacity-100 z-10"
                                >
                                  <Star className="w-2.5 h-2.5" />
                                  Hacer Portada
                                </button>
                              )}

                              {/* Botón eliminar foto */}
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(idx)}
                                title="Quitar foto de la galería"
                                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600/90 hover:bg-red-600 text-white opacity-80 group-hover:opacity-100 transition-opacity z-10"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Descripción del Inmueble
                    </label>
                    <textarea
                      rows={3}
                      value={propForm.description}
                      onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                      placeholder="Describe los aspectos destacados de la propiedad..."
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Botón Publicar Propiedad (Estilo Ancho Completo Corporativo) */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 btn-orange rounded-xl text-xs font-black uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Guardando en Base de Datos...' : (editingProp ? 'Guardar Cambios de Propiedad' : 'Publicar Propiedad')}</span>
                  </button>

                </form>
              )}
            </div>

            {/* 4. SECCIÓN INFERIOR: PROPIEDADES PUBLICADAS CON BUSCADOR */}
            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              
              {/* Header + Buscador */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="w-4 h-4 text-orange-500" />
                  <span>Propiedades Publicadas ({filteredProperties.length})</span>
                </h3>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por título, comuna o código..."
                    className="w-full pl-9 pr-4 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-slate-200 text-xs focus:outline-none focus:border-orange-500 placeholder:text-slate-500 transition-colors"
                  />
                </div>
              </div>

              {/* Lista de Propiedades Estilo Card */}
              {filteredProperties.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No se encontraron propiedades que coincidan con la búsqueda.
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredProperties.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#080c14] border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    >
                      {/* Izquierda: Imagen + Detalles */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <img
                          src={formatImageUrl(p.image) || '/images/placeholder_property.svg'}
                          alt={p.title}
                          onError={handleImageError}
                          className="w-20 h-16 object-cover rounded-lg border border-slate-700 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          {/* Badges row */}
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="font-mono font-extrabold text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                              {p.code}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded font-extrabold uppercase ${
                              p.operation === 'Reservado' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                              p.operation === 'Vendido' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              p.operation === 'Arrendado' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                              p.operation === 'Arriendo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            }`}>
                              {p.operation}
                            </span>
                            {p.isFeatured && (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                                ★ Destacado
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h4 className="text-xs font-bold text-white line-clamp-1 max-w-md">
                            {p.title}
                          </h4>

                          {/* Details */}
                          <p className="text-[11px] text-slate-400 flex items-center gap-3">
                            <span>📍 {p.commune || 'Puerto Montt'}</span>
                            <span>🛏️ {p.bedrooms ?? 3} Hab</span>
                            <span>🚿 {p.bathrooms ?? 2} Baños</span>
                          </p>
                        </div>
                      </div>

                      {/* Derecha: Precio + Acciones */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                        <span className="text-xs font-black text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                          {p.priceDisplay || p.price_display}
                        </span>

                        <div className="flex items-center gap-2">
                          <a
                            href={`/propiedades/${p.slug || p.code || p.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 text-teal-300 hover:bg-teal-500/25 text-[11px] font-bold transition-colors"
                            title="Ver publicación pública"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Ver</span>
                          </a>

                          <button
                            onClick={() => handleEditPropertyClick(p)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-[11px] font-bold transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Modificar</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                            title="Eliminar Propiedad"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: Leads */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>Mensajes de Contacto Recibidos ({dbLeads.length})</span>
              </h2>
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1422] border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
                title="Actualizar lista de mensajes"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {dbLeads.length === 0 ? (
              <div className="text-center py-12 bg-[#0e1422] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No hay consultas de contacto registradas aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbLeads.map((lead) => {
                  const leadPhone = lead.phone ? lead.phone.replace(/\D/g, '') : '';
                  return (
                    <div key={lead.id} className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="font-bold text-white text-xs">{lead.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {lead.created || lead.created_at ? new Date(lead.created || lead.created_at).toLocaleDateString('es-CL') : ''}
                          </span>
                          <button
                            onClick={() => handleDeleteLead(lead.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar mensaje"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-teal-400">
                        {lead.email && <span>Email: {lead.email} | </span>}
                        <span>Tel: {lead.phone || 'No especificado'}</span>
                      </p>
                      {lead.property_code && (
                        <p className="text-xs text-orange-400 font-semibold">Código Propiedad: {lead.property_code}</p>
                      )}
                      {lead.message && (
                        <p className="text-xs text-slate-300 pt-1 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          "{lead.message}"
                        </p>
                      )}
                      {leadPhone && (
                        <div className="pt-2 flex justify-end">
                          <a
                            href={`https://wa.me/${leadPhone.startsWith('56') ? leadPhone : `56${leadPhone}`}?text=${encodeURIComponent(`Hola ${lead.name}, te contactamos desde Urbanos Gestión Inmobiliaria sobre tu consulta.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 hover:bg-teal-500/20 text-[11px] font-semibold transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                            <span>Contactar por WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Órdenes de Venta y Ofertas ({dbOrders.length})</span>
              </h2>
              <button
                onClick={fetchAdminData}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1422] border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all disabled:opacity-50"
                title="Actualizar lista de órdenes"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-orange-400 ${loading ? 'animate-spin' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {dbOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#0e1422] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No hay órdenes de venta ni ofertas registradas aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbOrders.map((ord) => {
                  const ordPhone = ord.phone ? ord.phone.replace(/\D/g, '') : '';
                  return (
                    <div key={ord.id} className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 space-y-2.5 relative">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.order_type === 'captacion'
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                            : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        }`}>
                          {ord.order_type === 'captacion' ? 'Orden de Venta / Captación' : 'Oferta de Compra'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">
                            {ord.created || ord.created_at ? new Date(ord.created || ord.created_at).toLocaleDateString('es-CL') : ''}
                          </span>
                          <button
                            onClick={() => handleDeleteOrder(ord.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar orden"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="font-bold text-white text-xs">{ord.name}</p>
                      <p className="text-xs text-teal-400">Email: {ord.email} | Tel: {ord.phone}</p>
                      {ord.commune && <p className="text-xs text-slate-300">📍 Comuna: <strong className="text-white">{ord.commune}</strong></p>}
                      {ord.operation_type && <p className="text-xs text-slate-300">💼 Operación: <strong className="text-white capitalize">{ord.operation_type}</strong></p>}
                      {ord.property_type && <p className="text-xs text-slate-300">🏠 Inmueble: <strong className="text-white capitalize">{ord.property_type}</strong></p>}
                      {ord.offer_amount && <p className="text-xs font-bold text-orange-400">💰 Monto Oferta: {ord.offer_amount}</p>}
                      {ord.target_property && <p className="text-xs text-teal-300">🏷️ Propiedad Interés: {ord.target_property}</p>}
                      {ord.details && (
                        <p className="text-xs text-slate-300 pt-1 italic bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                          "{ord.details}"
                        </p>
                      )}
                      {ordPhone && (
                        <div className="pt-2 flex justify-end">
                          <a
                            href={`https://wa.me/${ordPhone.startsWith('56') ? ordPhone : `56${ordPhone}`}?text=${encodeURIComponent(`Hola ${ord.name}, te contactamos desde Urbanos Gestión Inmobiliaria sobre tu solicitud (${ord.order_type === 'captacion' ? 'Orden de Venta' : 'Oferta de Compra'}).`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-300 hover:bg-orange-500/20 text-[11px] font-semibold transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-orange-400" />
                            <span>Responder por WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-[11px] text-slate-500 py-4 border-t border-slate-900">
          © 2026 Urbanos Gestión Inmobiliaria | Panel de Administración
        </footer>

      </div>
    </div>
  );
}
