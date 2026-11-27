import React from 'react';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import { DATOS_PAGO_MOVIL } from './Datos';
import { st } from './Estilos';

export function InfoPagoMovil({ pago }) {
  if (pago !== 'Pago Móvil') return null;
  const textoCopiar = DATOS_PAGO_MOVIL.banco + '\nCédula: ' + DATOS_PAGO_MOVIL.cedula + '\nTeléfono: ' + DATOS_PAGO_MOVIL.telefono;
  const copiar = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textoCopiar);
    }
    if (Platform.OS === 'web') {
      window.alert('Copiado: Datos de Pago Móvil copiados para pegar en tu banco.');
    }
  };
  return (
    <View style={[st.box, { backgroundColor: '#FFF3E0', borderColor: '#FF5500', borderWidth: 1, marginBottom: 12 }]}>
      <Text style={[st.bold, { color: '#111111', marginBottom: 4 }]}>📲 Datos para Pago Móvil:</Text>
      <Text style={{ color: '#111111' }}>🏦 {DATOS_PAGO_MOVIL.banco}</Text>
      <Text style={{ color: '#111111' }}>🪪 Cédula: {DATOS_PAGO_MOVIL.cedula}</Text>
      <Text style={{ color: '#111111', marginBottom: 8 }}>📞 Teléfono: {DATOS_PAGO_MOVIL.telefono}</Text>
      <TouchableOpacity style={{ backgroundColor: '#FF5500', padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={copiar}>
        <Text style={st.wText}>📋 Copiar datos de Pago Móvil</Text>
      </TouchableOpacity>
    </View>
  );
}
