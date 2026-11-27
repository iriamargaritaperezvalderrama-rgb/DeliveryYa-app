import React, { useState } from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView, TextInput, StatusBar, Platform } from 'react-native';
import { WHATSAPP_VZLA, WHATSAPP_ECU, ZONAS_ENVIO, RESTAURANTES } from './Datos';
import { InfoPagoMovil } from './PagoMovil';
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

  const avisar = (titulo, mensaje) => {
    if (Platform.OS === 'web') window.alert(titulo + ': ' + mensaje);
  };

  const agregar = (plato, restNombre) => setCarrito([...carrito, { ...plato, restNombre, uid: Math.random().toString() }]);
  const quitar = (uid) => setCarrito(carrito.filter(i => i.uid !== uid));
  const subtotal = () => carrito.reduce((s, i) => s + i.precio, 0);

  const abrirWhatsapp = (numero, msg) => {
    const cleanNum = String(numero).replace(/[^0-9]/g, '');
    const link = document.createElement('a');
    link.href = 'whatsapp://send?phone=' + cleanNum + '&text=' + encodeURIComponent(msg);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const enviarComida = (numero) => {
    if (!dirComida.trim()) return avisar('Falta dirección', 'Por favor escribe tu dirección exacta de entrega.');
    const total = (subtotal() + zonaSel.precio).toFixed(2);
    const items = carrito.map(i => '- ' + i.nombre + ' (' + i.restNombre + '): $' + i.precio.toFixed(2)).join('\n');
    const texto = '🛵 *PEDIDO COMIDA - DeliveryYa*\n\n' + items + '\n\n📍 *Zona:* ' + zonaSel.nombre + ' ($' + zonaSel.precio.toFixed(2) + ')\n🏠 *Dirección:* ' + dirComida + '\n💳 *Pago:* ' + pago + '\n💰 *TOTAL:* $' + total;
    abrirWhatsapp(numero, texto);
    setCarrito([]); setDirComida(''); setPantalla('inicio');
  };

  const enviarEncomienda = (numero) => {
    if (!origen.trim() || !destino.trim() || !paquete.trim()) return avisar('Faltan datos', 'Por favor completa origen, destino y qué envías.');
    const texto = '📦 *ENCOMIENDA MOTO - DeliveryYa*\n\n🟢 *Retiro:* ' + origen + '\n🔴 *Entrega:* ' + destino + '\n📦 *Paquete:* ' + paquete + '\n📍 *Zona:* ' + zonaSel.nombre + '\n💳 *Pago:* ' + pago + '\n💰 *Tarifa Delivery:* $' + zonaSel.precio.toFixed(2);
    abrirWhatsapp(numero, texto);
    setOrigen(''); setDestino(''); setPaquete(''); setPantalla('inicio');
  };

  const SelectorZonas = () => (
    <View style={{ marginBottom: 12 }}>
      <Text style={st.label}>Selecciona la zona de entrega:</Text>
      {ZONAS_ENVIO.map(z => (
        <TouchableOpacity key={z.id} style={[st.zonaBtn, zonaSel.id === z.id && { backgroundColor: '#FF5500', borderColor: '#FF5500' }]} onPress={() => setZonaSel(z)}>
          <Text style={zonaSel.id === z.id ? st.wText : st.bold}>{z.nombre}</Text>
          <Text style={zonaSel.id === z.id ? st.wText : st.bold}>${z.precio.toFixed(2)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5500" />
      <View style={st.header}>
        <Text style={st.hTitle}>🛵 DeliveryYa</Text>
        <Text style={st.hSub}>Comidas y encomiendas en moto</Text>
      </View>

      {pantalla === 'inicio' && (
        <View style={st.content}>
          <Text style={st.qText}>¿Qué necesitas hoy?</Text>
          <TouchableOpacity style={[st.card, { backgroundColor: '#FFF3E0' }]} onPress={() => setPantalla('restaurantes')}>
            <Text style={st.emoji}>🍔</Text>
            <View style={{ flex: 1 }}><Text style={[st.cTitle, { color: '#111111' }]}>Pedir Comida</Text><Text style={st.cSub}>Restaurantes y comida rápida</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={[st.card, { backgroundColor: '#E3F2FD' }]} onPress={() => setPantalla('encomienda')}>
            <Text style={st.emoji}>📦</Text>
            <View style={{ flex: 1 }}><Text style={[st.cTitle, { color: '#111111' }]}>Enviar Encomienda</Text><Text style={st.cSub}>Paquetes, llaves y mandados</Text></View>
          </TouchableOpacity>
                  <TouchableOpacity
            style={[st.okBtn, { marginTop: 12 }]}
            onPress={() => {
                                        const textoCompartir = '🛵 ¡Pide comida o envía encomiendas rápido con *DeliveryYa*! Entra aquí: https://iriamargaritaperezvalderrama-rgb.github.io/DeliveryYa-app/';
  

              const link = document.createElement('a');
              link.href = 'whatsapp://send?text=' + encodeURIComponent(textoCompartir);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Text style={st.wText}>📲 Compartir DeliveryYa por WhatsApp</Text>
          </TouchableOpacity>

        </View>
      )}

      {pantalla === 'restaurantes' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>🍽️ Elige un Local</Text>
          {RESTAURANTES.map(r => (
            <TouchableOpacity key={r.id} style={st.restCard} onPress={() => { setRestSel(r); setPantalla('menu'); }}>
              <Text style={{ fontSize: 30, marginRight: 12 }}>{r.emoji}</Text>
              <View style={{ flex: 1 }}><Text style={st.bold}>{r.nombre}</Text><Text style={st.gray}>{r.categoria}</Text></View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('inicio')}><Text style={st.bold}>← Volver al inicio</Text></TouchableOpacity>
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
            <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('restaurantes')}><Text style={st.bold}>← Otros locales</Text></TouchableOpacity>
          </ScrollView>
          {carrito.length > 0 && (
            <TouchableOpacity style={st.cartBar} onPress={() => setPantalla('carrito')}>
              <Text style={st.wText}>🛒 Ver Carrito ({carrito.length})</Text>
              <Text style={st.wText}>${subtotal().toFixed(2)} →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {pantalla === 'carrito' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>🛒 Tu Pedido</Text>
          {carrito.map(i => (
            <View key={i.uid} style={st.platoCard}>
              <View style={{ flex: 1 }}><Text style={st.bold}>{i.nombre}</Text><Text style={st.gray}>{i.restNombre} • ${i.precio.toFixed(2)}</Text></View>
              <TouchableOpacity onPress={() => quitar(i.uid)}><Text style={{ color: 'red', fontWeight: 'bold' }}>Quitar</Text></TouchableOpacity>
            </View>
          ))}
          <SelectorZonas />
          <View style={st.box}>
            <Text>Comida: ${subtotal().toFixed(2)} | Delivery: ${zonaSel.precio.toFixed(2)}</Text>
            <Text style={[st.bold, { fontSize: 16, marginTop: 4 }]}>Total a pagar: ${(subtotal() + zonaSel.precio).toFixed(2)}</Text>
          </View>
          <View style={st.payRow}>
            {['Efectivo ($)', 'Pago Móvil', 'Zelle'].map(m => (
              <TouchableOpacity key={m} style={[st.payBtn, pago === m && { backgroundColor: '#FF5500', borderColor: '#FF5500' }]} onPress={() => setPago(m)}>
                <Text style={pago === m ? st.wText : st.bold}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <InfoPagoMovil pago={pago} />
          <TextInput style={st.input} placeholder="Dirección exacta de entrega..." value={dirComida} onChangeText={setDirComida} />
          <TouchableOpacity style={st.okBtn} onPress={() => enviarComida(WHATSAPP_VZLA)}><Text style={st.wText}>📲 Pedir por WhatsApp (Venezuela)</Text></TouchableOpacity>
          <TouchableOpacity style={st.blueBtn} onPress={() => enviarComida(WHATSAPP_ECU)}><Text style={st.wText}>📲 Pedir por WhatsApp (Ecuador)</Text></TouchableOpacity>
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('menu')}><Text style={st.bold}>← Seguir pidiendo</Text></TouchableOpacity>
        </ScrollView>
      )}

      {pantalla === 'encomienda' && (
        <ScrollView style={st.content}>
          <Text style={st.sTitle}>📦 Encomienda en Moto</Text>
          <TextInput style={st.input} placeholder="¿Dónde retiramos el paquete?" value={origen} onChangeText={setOrigen} />
          <TextInput style={st.input} placeholder="¿Dónde lo entregamos?" value={destino} onChangeText={setDestino} />
          <TextInput style={st.input} placeholder="¿Qué envías? (Ej: Llaves, comida, caja)" value={paquete} onChangeText={setPaquete} />
          <SelectorZonas />
          <View style={st.payRow}>
            {['Efectivo ($)', 'Pago Móvil', 'Zelle'].map(m => (
              <TouchableOpacity key={m} style={[st.payBtn, pago === m && { backgroundColor: '#FF5500', borderColor: '#FF5500' }]} onPress={() => setPago(m)}>
                <Text style={pago === m ? st.wText : st.bold}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <InfoPagoMovil pago={pago} />
          <TouchableOpacity style={st.okBtn} onPress={() => enviarEncomienda(WHATSAPP_VZLA)}><Text style={st.wText}>📲 Enviar a WhatsApp (Venezuela)</Text></TouchableOpacity>
          <TouchableOpacity style={st.blueBtn} onPress={() => enviarEncomienda(WHATSAPP_ECU)}><Text style={st.wText}>📲 Enviar a WhatsApp (Ecuador)</Text></TouchableOpacity>
          <TouchableOpacity style={st.backBtn} onPress={() => setPantalla('inicio')}><Text style={st.bold}>← Volver al inicio</Text></TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
