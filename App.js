import React, { useState } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert, ScrollView, Linking } from 'react-native';
import { WHATSAPP_CENTRAL, ZONAS_ENVIO, RESTAURANTES } from './Datos';
import { st } from './Estilos';

export default function App() {
  const [pantalla, setPantalla] = useState('inicio');
  const [restSel, setRestSel] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [zonaSel, setZonaSel] = useState(ZONAS_ENVIO[0]);
  const [dirComida, setDirComida] = useState('');
  const [pago, setPago] = useState('Efectivo ($)');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [paquete, setPaquete] = useState('');

  const agregar = (plato, restNombre) => setCarrito([...carrito, { ...plato, rest: restNombre, uid: Math.random() }]);
  const quitar = (uid) => setCarrito(carrito.filter(i => i.uid !== uid));
  const subtotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const abrirWhatsApp = (msg) => {
    Linking.openURL(`https://wa.me{WHATSAPP_CENTRAL}?text=${encodeURIComponent(msg)}`).catch(() => Alert.alert('Pedido', msg));
  };

  const enviarComida = () => {
    if (!dirComida.trim()) return Alert.alert('Falta dirección', 'Escribe urbanización, calle y referencia.');
    const total = (subtotal() + zonaSel.precio).toFixed(2);
    const items = carrito.map(i => `- ${i.nombre} ($${i.precio.toFixed(2)})`).join('\n');
    abrirWhatsApp(`🛵 *PEDIDO COMIDA - DeliveryYa*\n\n${items}\n\n📍 Zona: ${zonaSel.nombre} ($${zonaSel.precio.toFixed(2)})\n*TOTAL A PAGAR: $${total}*\n💳 Pago: ${pago}\n🏠 Dirección: ${dirComida}`);
    setCarrito([]); setDirComida(''); setPantalla('inicio');
  };

  const enviarEncomienda = () => {
    if (!origen || !destino || !paquete) return Alert.alert('Faltan datos', 'Completa origen, destino y paquete.');
    abrirWhatsApp(`📦 *ENCOMIENDA MOTO - DeliveryYa*\n\n🟢 Recoger: ${origen}\n🔴 Entregar: ${destino}\n🎒 Paquete: ${paquete}\n📍 Zona: ${zonaSel.nombre}\n💳 Pago: ${pago}\n💵 *TOTAL CARRERA: $${zonaSel.precio.toFixed(2)}*`);
    setOrigen(''); setDestino(''); setPaquete(''); setPantalla('inicio');
  };

  const SelectorZonas = () => (
    <View style={{ marginBottom: 12 }}>
      <Text style={st.label}>Selecciona la zona de entrega:</Text>
      {ZONAS_ENVIO.map(z => (
        <TouchableOpacity key={z.id} style={[st.zonaBtn, zonaSel.id === z.id && st.zonaAct]} onPress={() => setZonaSel(z)}>
          <Text style={zonaSel.id === z.id ? st.wText : st.bold}>{z.nombre}</Text>
          <Text style={zonaSel.id === z.id ? st.wText : st.price}>${z.precio.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5722" />
      <View style={st.header}>
        <Text style={st.hTitle}>🛵 DeliveryYa</Text>
        <Text style={st.hSub}>Comidas y encomiendas en moto</Text>
      </View>

      {pantalla === 'inicio' && (
        <View style={st.content}>
          <Text style={st.qText}>¿Qué necesitas hoy?</Text>
          <TouchableOpacity style={[st.card, { backgroundColor: '#FF5722' }]} onPress={() => setPantalla('restaurantes')}>
            <Text style={st.emoji}>🍔</Text>
            <View style={{ flex: 1 }}><Text style={st.cTitle}>Pedir Comida</Text><Text style={st.cDesc}>Restaurantes locales a tu puerta</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[st.card, { backgroundColor: '#1E88E5' }]} onPress={() => setPantalla('encomienda')}>
            <Text style={st.emoji}>📦</Text>
            <View style={{ flex: 1 }}><Text style={st.cTitle}>Enviar Encomienda</Text><Text style={st.cDesc}>Mandados y paquetes en moto</Text></View>
          </TouchableOpacity>
        </View>
      )}

      {pantalla === 'restaurantes' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>🍴 Elige un Local</Text>
          {RESTAURANTES.map(r => (
            <TouchableOpacity key={r.id} style={st.restCard} onPress={() => { setRestSel(r); setPantalla('menu'); }}>
              <Text style={{ fontSize: 30, marginRight: 12 }}>{r.emoji}</Text>
              <View style={{ flex: 1 }}><Text style={st.bold}>{r.nombre}</Text><Text style={st.gray}>{r.categoria}</Text></View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('inicio')}><Text style={st.gray}>← Volver</Text></TouchableOpacity>
        </ScrollView>
      )}

      {pantalla === 'menu' && restSel && (
        <View style={{ flex: 1 }}>
          <ScrollView style={st.content}>
            <Text style={st.sTitle}>{restSel.emoji} {restSel.nombre}</Text>
            {restSel.platos.map(p => (
              <View key={p.id} style={st.platoCard}>
                <View style={{ flex: 1 }}><Text style={st.bold}>{p.nombre}</Text><Text style={st.price}>${p.precio.toFixed(2)}</Text></View>
                <TouchableOpacity style={st.addBtn} onPress={() => agregar(p, restSel.nombre)}><Text style={st.wText}>+ Agregar</Text></TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('restaurantes')}><Text style={st.gray}>← Otros locales</Text></TouchableOpacity>
          </ScrollView>
          {carrito.length > 0 && (
            <TouchableOpacity style={st.cartBar} onPress={() => setPantalla('carrito')}>
              <Text style={st.wText}>🛒 Ver Carrito ({carrito.length})</Text>
              <Text style={st.wText}>${subtotal().toFixed(2)}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {pantalla === 'carrito' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>🛒 Tu Pedido</Text>
          {carrito.map(i => (
            <View key={i.uid} style={st.platoCard}>
              <View style={{ flex: 1 }}><Text style={st.bold}>{i.nombre}</Text><Text style={st.gray}>${i.precio.toFixed(2)}</Text></View>
              <TouchableOpacity onPress={() => quitar(i.uid)}><Text style={{ color: 'red' }}>Quitar</Text></TouchableOpacity>
            </View>
          ))}
          <SelectorZonas />
          <View style={st.box}>
            <Text>Comida: ${subtotal().toFixed(2)} | Moto: ${zonaSel.precio.toFixed(2)}</Text>
            <Text style={[st.bold, { fontSize: 16, marginTop: 5 }]}>Total a pagar: ${(subtotal() + zonaSel.precio).toFixed(2)}</Text>
          </View>
          <View style={st.payRow}>
            {['Efectivo ($)', 'Pago Móvil', 'Zelle'].map(m => (
              <TouchableOpacity key={m} style={[st.payBtn, pago === m && st.payAct]} onPress={() => setPago(m)}>
                <Text style={pago === m ? st.wText : st.bold}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={st.input} placeholder="Urbanización, calle y referencia" value={dirComida} onChangeText={setDirComida} />
          <TouchableOpacity style={st.okBtn} onPress={enviarComida}><Text style={st.wText}>Enviar por WhatsApp</Text></TouchableOpacity>
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('menu')}><Text style={st.gray}>← Seguir pidiendo</Text></TouchableOpacity>
        </ScrollView>
      )}

      {pantalla === 'encomienda' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>📦 Encomienda en Moto</Text>
          <TextInput style={st.input} placeholder="Recoger en (Sector y referencia)" value={origen} onChangeText={setOrigen} />
          <TextInput style={st.input} placeholder="Entregar en (Sector y referencia)" value={destino} onChangeText={setDestino} />
          <TextInput style={st.input} placeholder="¿Qué envías?" value={paquete} onChangeText={setPaquete} />
          <SelectorZonas />
          <View style={st.payRow}>
            {['Efectivo ($)', 'Pago Móvil', 'Zelle'].map(m => (
              <TouchableOpacity key={m} style={[st.payBtn, pago === m && st.payAct]} onPress={() => setPago(m)}>
                <Text style={pago === m ? st.wText : st.bold}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={st.blueBtn} onPress={enviarEncomienda}><Text style={st.wText}>Pedir Moto (${zonaSel.precio.toFixed(2)})</Text></TouchableOpacity>
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('inicio')}><Text style={st.gray}>← Volver</Text></TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
