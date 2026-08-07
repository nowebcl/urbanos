import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, LogOut, Plus, Trash2, Edit3, CheckCircle2, MessageSquare, FileText, Building, Tag, ShieldCheck, RefreshCw } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin active tab: 'properties' | 'leads' | 'orders'
  const [activeTab, setActiveTab] = useState('properties');

  // DB Data
  const [dbProperties, setDbProperties] = useState([]);
  const [dbLeads, setDbLeads] = useState([]);
  const [dbOrders, setDbOrders] = useState([]);

  // Form modal for property add/edit
  const [editingProp, setEditingProp] = useState(null);
  const [showPropModal, setShowPropModal] = useState(false);
  const [propForm, setPropForm] = useState({
    title: '',
    code: '',
    slug: '',
    operation: 'Venta',
    type: 'Casa',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    priceDisplay: 'UF 5.000',
    priceUF: 5000,
    priceCLP: 187500000,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    area: '120m²',
    landArea: '300m²',
    image: '',
    description: '',
    isFeatured: false
  });

  useEffect(() => {
    // Check initial auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchAdminData();
    }
  }, [session]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch Properties
      const { data: props } = await supabase.from('properties').select('*').order('id', { ascending: false });
      setDbProperties(props && props.length > 0 ? props : PROPERTIES);

      // Fetch Leads
      const { data: leads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      setDbLeads(leads || []);

      // Fetch Orders
      const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      setDbOrders(orders || []);
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setLoginError(error.message || 'Credenciales inválidas');
    } catch (err) {
      setLoginError('Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        code: propForm.code || `URB-${Date.now().toString().slice(-4)}`,
        slug: propForm.slug || propForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title: propForm.title,
        commune: propForm.commune,
        location: propForm.location,
        address: propForm.location,
        price_display: propForm.priceDisplay,
        price_uf: parseFloat(propForm.priceUF) || 0,
        price_clp: parseFloat(propForm.priceCLP) || 0,
        bedrooms: parseInt(propForm.bedrooms, 10) || 0,
        bathrooms: parseInt(propForm.bathrooms, 10) || 0,
        parking: parseInt(propForm.parking, 10) || 0,
        area: propForm.area,
        land_area: propForm.landArea,
        is_featured: propForm.isFeatured,
        operation: propForm.operation,
        type: propForm.type,
        image: propForm.image || '/images/house_monte_verde.jpg',
        description: propForm.description
      };

      if (editingProp) {
        await supabase.from('properties').update(payload).eq('id', editingProp.id);
      } else {
        const newId = Math.floor(Math.random() * 90000) + 10000;
        await supabase.from('properties').insert([{ id: newId, ...payload }]);
      }

      setShowPropModal(false);
      setEditingProp(null);
      fetchAdminData();
    } catch (err) {
      alert('Error guardando propiedad en Supabase');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
      await supabase.from('properties').delete().eq('id', id);
      fetchAdminData();
    }
  };

  // If NOT logged in, show Login Screen
  if (!session) {
    return (
      <div className="min-h-[80vh] bg-[#080c14] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-[#0e1422] border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Panel de Administración</h1>
            <p className="text-xs text-slate-400">Ingresa con tus credenciales de Supabase</p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@urbanosgestion.cl"
                className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold shadow-lg"
            >
              {loading ? 'Autenticando...' : 'Iniciar Sesión Admin'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged In Dashboard
  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1422] p-6 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">SISTEMA SUPABASE ACTIVO</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Panel Administrador</h1>
            <p className="text-xs text-slate-400 mt-1">Conectado como: {session.user.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white bg-[#080c14]"
              title="Recargar datos"
            >
              <RefreshCw className="w-4 h-4 text-teal-400" />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 text-xs font-bold hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'properties'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-[#0e1422] border border-slate-700 text-slate-300'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Propiedades ({dbProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-teal-500 text-slate-950 shadow-lg'
                : 'bg-[#0e1422] border border-slate-700 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Mensajes / Leads ({dbLeads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-[#0e1422] border border-slate-700 text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Órdenes / Ofertas ({dbOrders.length})</span>
          </button>
        </div>

        {/* Tab 1: Properties List & Management */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Catálogo de Propiedades en Supabase</h2>
              <button
                onClick={() => {
                  setEditingProp(null);
                  setPropForm({
                    title: '',
                    code: '',
                    slug: '',
                    operation: 'Venta',
                    type: 'Casa',
                    commune: 'Puerto Montt',
                    location: 'Puerto Montt, Región de Los Lagos',
                    priceDisplay: 'UF 5.000',
                    priceUF: 5000,
                    priceCLP: 187500000,
                    bedrooms: 3,
                    bathrooms: 2,
                    parking: 2,
                    area: '120m²',
                    landArea: '300m²',
                    image: '',
                    description: '',
                    isFeatured: false
                  });
                  setShowPropModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 btn-orange rounded-xl text-xs font-bold shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Propiedad</span>
              </button>
            </div>

            <div className="bg-[#0e1422] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-[#080c14] border-b border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                    <tr>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">Título</th>
                      <th className="px-4 py-3">Operación</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Comuna</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {dbProperties.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/50">
                        <td className="px-4 py-3 font-mono font-bold text-teal-400">{p.code}</td>
                        <td className="px-4 py-3 font-semibold text-white truncate max-w-xs">{p.title}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.operation === 'Venta' ? 'bg-orange-500/20 text-orange-400' : 'bg-teal-500/20 text-teal-400'
                          }`}>
                            {p.operation}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-white">{p.priceDisplay || p.price_display}</td>
                        <td className="px-4 py-3">{p.commune}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProperty(p.id)}
                            className="p-1.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Leads */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Mensajes de Contacto Recibidos</h2>
            {dbLeads.length === 0 ? (
              <div className="text-center py-12 bg-[#0e1422] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No hay consultas de contacto aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbLeads.map((lead) => (
                  <div key={lead.id} className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-sm">{lead.name}</span>
                      <span className="text-[10px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-teal-400">Email: {lead.email} | Tel: {lead.phone}</p>
                    {lead.property_code && <p className="text-xs text-orange-400">Código Propiedad: {lead.property_code}</p>}
                    <p className="text-xs text-slate-300 pt-2 italic">"{lead.message}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Órdenes de Venta y Ofertas de Compra</h2>
            {dbOrders.length === 0 ? (
              <div className="text-center py-12 bg-[#0e1422] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No hay solicitudes de orden aún.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dbOrders.map((ord) => (
                  <div key={ord.id} className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500/20 text-orange-400 uppercase">
                        {ord.order_type === 'captacion' ? 'Orden de Venta / Captación' : 'Oferta de Compra'}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-white text-sm">{ord.name}</p>
                    <p className="text-xs text-teal-400">Email: {ord.email} | Tel: {ord.phone}</p>
                    {ord.commune && <p className="text-xs text-slate-300">Comuna: {ord.commune}</p>}
                    {ord.offer_amount && <p className="text-xs font-bold text-orange-400">Oferta: {ord.offer_amount}</p>}
                    {ord.target_property && <p className="text-xs text-teal-300">Propiedad: {ord.target_property}</p>}
                    {ord.details && <p className="text-xs text-slate-300 pt-2 italic">"{ord.details}"</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for Adding Property */}
        {showPropModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0e1422] border border-slate-700 max-w-xl w-full p-6 rounded-3xl space-y-4 shadow-2xl">
              <h3 className="text-xl font-bold text-white">Agregar Nueva Propiedad a Supabase</h3>

              <form onSubmit={handleSaveProperty} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Título de la Propiedad *</label>
                  <input
                    type="text"
                    required
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    placeholder="Ej: Se Vende Casa en Sector Residencial"
                    className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Operación</label>
                    <select
                      value={propForm.operation}
                      onChange={(e) => setPropForm({ ...propForm, operation: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                    >
                      <option value="Venta">Venta</option>
                      <option value="Arriendo">Arriendo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Tipo Inmueble</label>
                    <select
                      value={propForm.type}
                      onChange={(e) => setPropForm({ ...propForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                    >
                      <option value="Casa">Casa</option>
                      <option value="Departamento">Departamento</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Casa Comercial">Casa Comercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Precio Texto (UF / $)</label>
                    <input
                      type="text"
                      required
                      value={propForm.priceDisplay}
                      onChange={(e) => setPropForm({ ...propForm, priceDisplay: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Comuna</label>
                    <input
                      type="text"
                      required
                      value={propForm.commune}
                      onChange={(e) => setPropForm({ ...propForm, commune: e.target.value })}
                      className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">URL Imagen Principal</label>
                  <input
                    type="url"
                    value={propForm.image}
                    onChange={(e) => setPropForm({ ...propForm, image: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={propForm.description}
                    onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPropModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 btn-orange rounded-xl text-xs font-bold"
                  >
                    Guardar Propiedad
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
