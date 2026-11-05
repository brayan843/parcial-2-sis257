
<script setup>
import { ref, computed, onMounted } from 'vue';

const API = 'http://localhost:3000';

const recintos = ref([]);
const eventos = ref([]);
const mensaje = ref('');
const error = ref('');
const seccion = ref('inicio');

const recintoForm = ref({
  nombre: '',
  ciudad: '',
  aforo_maximo: ''
});

const eventoForm = ref({
  id_recinto: '',
  titulo: '',
  artista_principal: '',
  duracion_minutos: '',
  precio_entrada: '',
  fecha_evento: '',
  estado: 'Programado'
});

const recintoEditando = ref(null);
const eventoEditando = ref(null);

const programados = computed(() =>
  eventos.value.filter(e => e.estado === 'Programado').length
);

async function peticion(url, opciones = {}) {
  const respuesta = await fetch(API + url, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      ...opciones.headers
    }
  });

  const texto = await respuesta.text();

  if (!respuesta.ok) {
    throw new Error(texto || 'Error en la solicitud');
  }

  return texto ? JSON.parse(texto) : null;
}

async function cargarDatos() {
  try {
    error.value = '';

    const [listaRecintos, listaEventos] = await Promise.all([
      peticion('/recintos'),
      peticion('/eventos-culturales')
    ]);

    recintos.value = listaRecintos;
    eventos.value = listaEventos;
  } catch (e) {
    error.value = 'No se pudo conectar con el servidor. Comprueba que NestJS esté funcionando.';
    console.error(e);
  }
}

function mostrarMensaje(texto) {
  mensaje.value = texto;
  error.value = '';
}

async function guardarRecinto() {
  try {
    const datos = {
      nombre: recintoForm.value.nombre,
      ciudad: recintoForm.value.ciudad,
      aforo_maximo: recintoForm.value.aforo_maximo === ''
        ? null
        : Number(recintoForm.value.aforo_maximo)
    };

    if (recintoEditando.value) {
      await peticion('/recintos/' + recintoEditando.value, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      });
      mostrarMensaje('Recinto actualizado correctamente');
    } else {
      await peticion('/recintos', {
        method: 'POST',
        body: JSON.stringify(datos)
      });
      mostrarMensaje('Nuevo recinto registrado');
    }

    cancelarEdicionRecinto();
    await cargarDatos();
  } catch (e) {
    error.value = 'Error al guardar recinto: ' + e.message;
  }
}

function editarRecinto(recinto) {
  recintoEditando.value = recinto.id;
  recintoForm.value = {
    nombre: recinto.nombre,
    ciudad: recinto.ciudad,
    aforo_maximo: recinto.aforo_maximo ?? ''
  };
}

function cancelarEdicionRecinto() {
  recintoEditando.value = null;
  recintoForm.value = {
    nombre: '',
    ciudad: '',
    aforo_maximo: ''
  };
}

async function eliminarRecinto(id) {
  if (!confirm('¿Deseas eliminar este recinto?')) return;

  try {
    await peticion('/recintos/' + id, { method: 'DELETE' });
    mostrarMensaje('Recinto eliminado correctamente');
    await cargarDatos();
  } catch (e) {
    error.value = 'No se pudo eliminar el recinto. Puede tener eventos relacionados.';
  }
}

async function guardarEvento() {
  try {
    const datos = {
      id_recinto: Number(eventoForm.value.id_recinto),
      titulo: eventoForm.value.titulo,
      artista_principal: eventoForm.value.artista_principal,
      duracion_minutos: Number(eventoForm.value.duracion_minutos),
      precio_entrada: Number(eventoForm.value.precio_entrada),
      fecha_evento: eventoForm.value.fecha_evento,
      estado: eventoForm.value.estado
    };

    if (eventoEditando.value) {
      await peticion('/eventos-culturales/' + eventoEditando.value, {
        method: 'PATCH',
        body: JSON.stringify(datos)
      });
      mostrarMensaje('Evento actualizado correctamente');
    } else {
      await peticion('/eventos-culturales', {
        method: 'POST',
        body: JSON.stringify(datos)
      });
      mostrarMensaje('Evento registrado correctamente');
    }

    cancelarEdicionEvento();
    await cargarDatos();
  } catch (e) {
    error.value = 'Error al guardar evento: ' + e.message;
  }
}

function editarEvento(evento) {
  eventoEditando.value = evento.id;

  eventoForm.value = {
    id_recinto: String(evento.id_recinto ?? evento.recinto?.id ?? ''),
    titulo: evento.titulo,
    artista_principal: evento.artista_principal,
    duracion_minutos: evento.duracion_minutos,
    precio_entrada: evento.precio_entrada,
    fecha_evento: String(evento.fecha_evento).slice(0, 10),
    estado: evento.estado
  };
}

function cancelarEdicionEvento() {
  eventoEditando.value = null;

  eventoForm.value = {
    id_recinto: '',
    titulo: '',
    artista_principal: '',
    duracion_minutos: '',
    precio_entrada: '',
    fecha_evento: '',
    estado: 'Programado'
  };
}

async function eliminarEvento(id) {
  if (!confirm('¿Deseas eliminar este evento?')) return;

  try {
    await peticion('/eventos-culturales/' + id, {
      method: 'DELETE'
    });

    mostrarMensaje('Evento eliminado correctamente');
    await cargarDatos();
  } catch (e) {
    error.value = 'No se pudo eliminar el evento: ' + e.message;
  }
}

function nombreRecinto(evento) {
  return evento.recinto?.nombre ??
    recintos.value.find(r => r.id === evento.id_recinto)?.nombre ??
    'Recinto #' + evento.id_recinto;
}

onMounted(cargarDatos);
</script>

<template>
  <div class="pagina">
    <header class="cabecera">
      <div class="marca">
        <div class="logo">EC</div>
        <div>
          <strong>Encuentro Cultural</strong>
          <small>Agenda y boletaje</small>
        </div>
      </div>

      <div class="fecha">
        SISTEMA DE EVENTOS CULTURALES
      </div>
    </header>

    <main class="contenido">
      <section class="bienvenida">
        <div>
          <span class="etiqueta">BIENVENIDO AL SISTEMA</span>
          <h1>La cultura nos reúne<span>.</span></h1>
          <p>Organiza recintos y administra tus eventos culturales desde un solo lugar.</p>
        </div>
        <div class="decoracion">✳</div>
      </section>

      <div class="estadisticas">
        <div class="estadistica">
          <span>Espacios culturales</span>
          <strong>{{ recintos.length }}</strong>
          <small>Recintos registrados</small>
        </div>

        <div class="estadistica">
          <span>Eventos registrados</span>
          <strong>{{ eventos.length }}</strong>
          <small>En nuestra agenda</small>
        </div>

        <div class="estadistica destacado">
          <span>Eventos programados</span>
          <strong>{{ programados }}</strong>
          <small>Disponibles en agenda</small>
        </div>
      </div>

      <div v-if="mensaje" class="mensaje">✓ {{ mensaje }}</div>
      <div v-if="error" class="error">{{ error }}</div>

      <nav class="menu">
        <button :class="{ activo: seccion === 'inicio' }" @click="seccion = 'inicio'">
          Inicio
        </button>
        <button :class="{ activo: seccion === 'recintos' }" @click="seccion = 'recintos'">
          Recintos
        </button>
        <button :class="{ activo: seccion === 'eventos' }" @click="seccion = 'eventos'">
          Eventos
        </button>
        <button class="recargar" @click="cargarDatos">↻ Actualizar</button>
      </nav>

      <section v-if="seccion === 'inicio'" class="seccion">
        <div class="titulo-seccion">
          <div>
            <span class="etiqueta">RESUMEN GENERAL</span>
            <h2>Actividad cultural</h2>
          </div>
          <span class="contador">Últimos registros</span>
        </div>

        <div class="inicio-grid">
          <div class="bloque-info">
            <h3>Próximos pasos</h3>
            <p>Desde este sistema puedes administrar los espacios donde se realizan actividades culturales y organizar sus eventos.</p>

            <button class="boton-principal" @click="seccion = 'eventos'">
              Ver eventos →
            </button>
          </div>

          <div class="bloque-lista">
            <h3>Eventos en la agenda</h3>

            <div v-for="evento in eventos.slice(0, 4)" :key="evento.id" class="evento-mini">
              <div class="mini-icono">♫</div>
              <div class="mini-datos">
                <strong>{{ evento.titulo }}</strong>
                <small>{{ evento.artista_principal }}</small>
              </div>
              <span class="punto">●</span>
            </div>

            <p v-if="eventos.length === 0" class="vacio">
              Todavía no hay eventos registrados.
            </p>
          </div>
        </div>
      </section>

      <section v-if="seccion === 'recintos'" class="seccion">
        <div class="titulo-seccion">
          <div>
            <span class="etiqueta">ADMINISTRACIÓN</span>
            <h2>Recintos culturales</h2>
          </div>
          <span class="contador">{{ recintos.length }} registrados</span>
        </div>

        <div class="panel-formulario">
          <h3>{{ recintoEditando ? 'Editar recinto' : 'Registrar nuevo recinto' }}</h3>

          <form @submit.prevent="guardarRecinto" class="formulario">
            <label>
              Nombre del recinto
              <input v-model="recintoForm.nombre" required maxlength="100" placeholder="Ej. Teatro Municipal">
            </label>

            <label>
              Ciudad
              <input v-model="recintoForm.ciudad" required maxlength="50" placeholder="Ej. Sucre">
            </label>

            <label>
              Aforo máximo
              <input v-model="recintoForm.aforo_maximo" type="number" min="1" placeholder="Ej. 500">
            </label>

            <div class="acciones">
              <button class="boton-principal" type="submit">
                {{ recintoEditando ? 'Guardar cambios' : '+ Registrar recinto' }}
              </button>
              <button v-if="recintoEditando" class="boton-cancelar" type="button" @click="cancelarEdicionRecinto">
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div class="tabla-panel">
          <h3>Lista de recintos</h3>
          <div class="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Ciudad</th>
                  <th>Aforo</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="recinto in recintos" :key="recinto.id">
                  <td>#{{ recinto.id }}</td>
                  <td><strong>{{ recinto.nombre }}</strong></td>
                  <td>{{ recinto.ciudad }}</td>
                  <td>{{ recinto.aforo_maximo ?? 'No definido' }}</td>
                  <td class="acciones-tabla">
                    <button class="editar" @click="editarRecinto(recinto)">Editar</button>
                    <button class="eliminar" @click="eliminarRecinto(recinto.id)">Eliminar</button>
                  </td>
                </tr>
                <tr v-if="recintos.length === 0">
                  <td colspan="5" class="vacio">No hay recintos registrados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section v-if="seccion === 'eventos'" class="seccion">
        <div class="titulo-seccion">
          <div>
            <span class="etiqueta">PROGRAMACIÓN</span>
            <h2>Eventos culturales</h2>
          </div>
          <span class="contador">{{ eventos.length }} registrados</span>
        </div>

        <div class="panel-formulario">
          <h3>{{ eventoEditando ? 'Editar evento' : 'Registrar nuevo evento' }}</h3>

          <form @submit.prevent="guardarEvento" class="formulario">
            <label>
              Título del evento
              <input v-model="eventoForm.titulo" required maxlength="150" placeholder="Nombre del evento">
            </label>

            <label>
              Artista principal
              <input v-model="eventoForm.artista_principal" required maxlength="100" placeholder="Nombre del artista">
            </label>

            <label>
              Recinto
              <select v-model="eventoForm.id_recinto" required>
                <option value="" disabled>Seleccione un recinto</option>
                <option v-for="recinto in recintos" :key="recinto.id" :value="String(recinto.id)">
                  {{ recinto.nombre }}
                </option>
              </select>
            </label>

            <label>
              Fecha del evento
              <input v-model="eventoForm.fecha_evento" type="date" required>
            </label>

            <label>
              Duración (minutos)
              <input v-model="eventoForm.duracion_minutos" type="number" min="1" required placeholder="120">
            </label>

            <label>
              Precio de entrada (Bs)
              <input v-model="eventoForm.precio_entrada" type="number" min="0" step="0.01" required placeholder="50">
            </label>

            <label>
              Estado
              <select v-model="eventoForm.estado" required>
                <option value="Programado">Programado</option>
                <option value="Agotado">Agotado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </label>

            <div class="acciones">
              <button class="boton-principal" type="submit" :disabled="recintos.length === 0">
                {{ eventoEditando ? 'Guardar cambios' : '+ Registrar evento' }}
              </button>
              <button v-if="eventoEditando" class="boton-cancelar" type="button" @click="cancelarEdicionEvento">
                Cancelar
              </button>
            </div>
          </form>

          <p v-if="recintos.length === 0" class="aviso">
            Primero debes registrar un recinto para poder crear eventos.
          </p>
        </div>

        <div class="tabla-panel">
          <h3>Lista de eventos</h3>
          <div class="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Evento</th>
                  <th>Artista</th>
                  <th>Recinto</th>
                  <th>Fecha</th>
                  <th>Precio</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="evento in eventos" :key="evento.id">
                  <td><strong>{{ evento.titulo }}</strong></td>
                  <td>{{ evento.artista_principal }}</td>
                  <td>{{ nombreRecinto(evento) }}</td>
                  <td>{{ String(evento.fecha_evento).slice(0, 10) }}</td>
                  <td>{{ evento.precio_entrada }} Bs</td>
                  <td>
                    <span class="estado" :class="evento.estado.toLowerCase()">
                      {{ evento.estado }}
                    </span>
                  </td>
                  <td class="acciones-tabla">
                    <button class="editar" @click="editarEvento(evento)">Editar</button>
                    <button class="eliminar" @click="eliminarEvento(evento.id)">Eliminar</button>
                  </td>
                </tr>
                <tr v-if="eventos.length === 0">
                  <td colspan="7" class="vacio">No hay eventos registrados.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <footer>
        <span>EC · Encuentro Cultural</span>
        <span>Proyecto académico · 2026</span>
      </footer>
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f5f3ed;
  color: #263b42;
}

button, input, select {
  font: inherit;
}

button {
  cursor: pointer;
}

.pagina {
  min-height: 100vh;
}

.cabecera {
  height: 76px;
  padding: 0 7%;
  background: #183c43;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.marca {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #e9a35b;
  color: #183c43;
  font-weight: bold;
}

.marca strong, .marca small {
  display: block;
}

.marca small {
  color: #c4d4d1;
  margin-top: 4px;
}

.fecha {
  font-size: 11px;
  letter-spacing: 2px;
  color: #c4d4d1;
}

.contenido {
  max-width: 1150px;
  margin: auto;
  padding: 35px 24px;
}

.bienvenida {
  background: #e9e5d9;
  min-height: 185px;
  border-radius: 16px;
  padding: 30px 38px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
}

.etiqueta {
  color: #b26b35;
  font-size: 11px;
  font-weight: bold;
  letter-spacing: 1.8px;
}

.bienvenida h1 {
  font-size: 35px;
  margin: 12px 0;
  color: #183c43;
}

.bienvenida h1 span {
  color: #d68c4d;
}

.bienvenida p {
  color: #647477;
  margin-bottom: 0;
}

.decoracion {
  font-size: 115px;
  color: #d6a06d;
  transform: rotate(-15deg);
  margin-right: 35px;
}

.estadisticas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 22px 0;
}

.estadistica {
  background: white;
  padding: 20px 23px;
  border-radius: 12px;
  border: 1px solid #e9e5dc;
}

.estadistica span, .estadistica small {
  display: block;
  color: #758184;
  font-size: 13px;
}

.estadistica strong {
  display: block;
  font-size: 30px;
  color: #183c43;
  margin: 9px 0;
}

.estadistica.destacado {
  background: #183c43;
  border-color: #183c43;
}

.estadistica.destacado strong {
  color: #f2b36e;
}

.estadistica.destacado span,
.estadistica.destacado small {
  color: #d3dfdc;
}

.menu {
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #dddcd4;
  padding-bottom: 12px;
  margin: 28px 0;
}

.menu button {
  border: none;
  background: transparent;
  padding: 11px 18px;
  color: #667578;
  border-radius: 8px;
}

.menu button.activo {
  background: #183c43;
  color: white;
}

.menu .recargar {
  margin-left: auto;
  color: #b26b35;
}

.seccion {
  animation: aparecer .25s ease;
}

@keyframes aparecer {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

.titulo-seccion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.titulo-seccion h2 {
  color: #183c43;
  margin: 7px 0 0;
  font-size: 25px;
}

.contador {
  font-size: 12px;
  color: #788386;
  background: #e9e5d9;
  padding: 9px 13px;
  border-radius: 20px;
}

.inicio-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 18px;
}

.bloque-info, .bloque-lista, .panel-formulario, .tabla-panel {
  background: white;
  border: 1px solid #e9e5dc;
  border-radius: 13px;
  padding: 24px;
  margin-bottom: 18px;
}

.bloque-info {
  background: #e9e5d9;
}

.bloque-info h3, .bloque-lista h3,
.panel-formulario h3, .tabla-panel h3 {
  color: #183c43;
  margin: 0 0 20px;
  font-size: 17px;
}

.bloque-info p {
  color: #667578;
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 25px;
}

.evento-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0eee8;
}

.mini-icono {
  width: 38px;
  height: 38px;
  background: #f5eadb;
  color: #b26b35;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.mini-datos {
  flex: 1;
  min-width: 0;
}

.mini-datos strong, .mini-datos small {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-datos strong {
  color: #30464a;
  font-size: 13px;
}

.mini-datos small {
  color: #8b9697;
  margin-top: 4px;
}

.punto {
  color: #d69b5b;
  font-size: 12px;
}

.formulario {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 17px;
}

.formulario label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #536468;
  font-size: 13px;
  font-weight: bold;
}

.formulario input, .formulario select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dedfd9;
  border-radius: 7px;
  background: #fcfcfa;
  color: #263b42;
  outline: none;
}

.formulario input:focus, .formulario select:focus {
  border-color: #b77b47;
}

.acciones {
  display: flex;
  gap: 9px;
  align-items: end;
  flex-wrap: wrap;
}

.boton-principal {
  background: #183c43;
  color: white;
  border: none;
  padding: 12px 17px;
  border-radius: 7px;
}

.boton-principal:hover {
  background: #285760;
}

.boton-principal:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.boton-cancelar {
  background: #e9e5d9;
  color: #536468;
  border: none;
  padding: 12px 17px;
  border-radius: 7px;
}

.tabla-panel {
  padding-bottom: 10px;
}

.tabla-scroll {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
  font-size: 13px;
}

th {
  background: #f5f3ed;
  color: #788386;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .5px;
}

th, td {
  text-align: left;
  padding: 14px 12px;
  border-bottom: 1px solid #efeee9;
}

td {
  color: #647477;
}

td strong {
  color: #30464a;
}

.acciones-tabla {
  white-space: nowrap;
}

.acciones-tabla button {
  border: none;
  padding: 7px 9px;
  border-radius: 5px;
  font-size: 11px;
  margin-right: 4px;
}

.editar {
  background: #f6e8d7;
  color: #a2642f;
}

.eliminar {
  background: #f8e3df;
  color: #b34d40;
}

.estado {
  display: inline-block;
  padding: 6px 9px;
  border-radius: 20px;
  font-size: 11px;
  background: #e6eee7;
  color: #46734e;
}

.estado.agotado {
  background: #f8edda;
  color: #a16d2d;
}

.estado.cancelado {
  background: #f8e3df;
  color: #b34d40;
}

.mensaje, .error, .aviso {
  padding: 12px 15px;
  border-radius: 8px;
  margin: 12px 0;
  font-size: 13px;
}

.mensaje {
  background: #e5f1e6;
  color: #397047;
}

.error {
  background: #f8e3df;
  color: #a23f35;
  overflow-wrap: anywhere;
}

.aviso {
  background: #f8edda;
  color: #94632c;
}

.vacio {
  color: #899394;
  text-align: center;
  padding: 25px;
}

footer {
  display: flex;
  justify-content: space-between;
  color: #899394;
  font-size: 12px;
  border-top: 1px solid #e2e0d8;
  padding: 20px 0;
  margin-top: 35px;
}

@media (max-width: 700px) {
  .cabecera {
    padding: 0 18px;
  }

  .fecha {
    display: none;
  }

  .contenido {
    padding: 22px 15px;
  }

  .bienvenida {
    padding: 25px;
  }

  .bienvenida h1 {
    font-size: 27px;
  }

  .decoracion {
    display: none;
  }

  .estadisticas {
    grid-template-columns: 1fr;
  }

  .inicio-grid {
    grid-template-columns: 1fr;
  }

  .formulario {
    grid-template-columns: 1fr;
  }

  .menu {
    flex-wrap: wrap;
  }

  .menu .recargar {
    margin-left: 0;
  }

  footer {
    gap: 10px;
    flex-direction: column;
  }
}
</style>
