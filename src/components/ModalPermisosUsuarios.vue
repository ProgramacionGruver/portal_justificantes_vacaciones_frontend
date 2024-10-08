<template>
  <q-dialog v-model="modalPermisos">
    <q-card class="full-width" style="height: auto;">
      <q-card-section class="bg-primary text-white row"
        style="position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between;">
        <h4 class="q-my-none q-mt-sm">Editar permisos</h4>
        <q-btn flat round dense v-close-popup class="text-white" icon="close" />
      </q-card-section>

      <q-card-section class="q-pb-none">
        <q-select class="q-mb-md" v-model="usuarioSeleccionado" label="Selecciona un usuario" option-label="nombre"
          option-disable="inactive" emit-value outlined map-options clearable use-input input-debounce="0"
          :options="opcionesUsuariosAcceso"  behavior="menu"
          :rules="[(val) => { return val !== null && val !== undefined && val !== '' ? true : 'Seleccione un usuario' }]"
          @filter="parametrosFiltradosEmpleados" @update:model-value="seleccionarUsuario"/>
      </q-card-section>

      <q-card-section style="max-height: 50vh" class="scroll q-pt-none" v-if="!usuarioSeleccionado">
        <div align="center">
          <q-icon name="checklist" color="grey" size="3rem" class="q-mr-sm"></q-icon>
          <div class="text-weight-light text-grey">
            Selecciona un usuario para editar sus permisos
          </div>
        </div>
      </q-card-section>
      <div v-else>
        <q-card-section>
          <div class="text-h4">Permisos de módulos</div>
          <q-tree
            class="col-12 col-sm-6"
            :nodes="checksPermisos"
            node-key="name"
            tick-strategy="leaf"
            v-model:ticked="tickedSeleccionados"
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h4">Permisos de sucursales</div>
          <q-tree class="col-12 col-sm-6" :nodes="checksSucursales" node-key="label" tick-strategy="leaf"
            v-model:ticked="tickedSucursales" />
        </q-card-section>
      </div>
      <q-card-actions align="center">
        <q-btn v-if="usuarioSeleccionado" class="q-my-sm" @click="actualizarPermisos" icon="update"
          label="Actualizar permisos" color="primary" :loading="loading">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useModulosStore } from 'src/stores/permisosModulos.js'
import { useSucursalesStore } from 'src/stores/sucursales.js'
import { storeToRefs } from 'pinia'
import { ID_SERVIDOR } from 'src/constant/servidor.js'
import { filtradoBusquedauUsuariosAcceso } from 'src/helpers/filtradoBusquedaObj.js'
import { useAutenticacionStore } from 'src/stores/autenticaciones'

export default {
  setup() {
    const useModulos = useModulosStore()
    const { actualizarPermisosModulos, obtenerPermisosSucursalesByUser, actualizarPermisosSucursales, actualizarPermisosCRUD } = useModulos
    const { filtroUsuariosAcceso, listaModulos, permisosSucursales } = storeToRefs(useModulos)

    const useAutenticacion = useAutenticacionStore()
    const { usuarioAutenticado } = storeToRefs(useAutenticacion)

    const useSucursales = useSucursalesStore()

    const { sucursalesAgrupadas } = storeToRefs(useSucursales)

    const modalPermisos = ref(false)
    const usuarioSeleccionado = ref(null)
    const checksPermisos = ref([])
    const tickedSeleccionados = ref([])
    const checksSucursales = ref([])
    const tickedSucursales = ref(null)
    const expanded = ref([])
    const loading = ref(false)
    const opcionesUsuariosAcceso = ref(filtroUsuariosAcceso.value)

    const abrir = () => {
      modalPermisos.value = true
      usuarioSeleccionado.value = null

      checksPermisos.value = listaModulos.value.map((modulo) => ({
        label: modulo.label,
        name: modulo.name,
        children: [
          { label: 'Leer', name: `${modulo.name}_leer` },
          { label: 'Actualizar', name: `${modulo.name}_actualizar` },
          { label: 'Agregar', name: `${modulo.name}_agregar` },
          { label: 'Eliminar', name: `${modulo.name}_eliminar` }
        ]
      }))

      checksSucursales.value = sucursalesAgrupadas.value.map((sucursal) => ({ label: sucursal.razonSocial, children: sucursal.sucursales.map((sucursal) => ({ label: sucursal.claveSucursal, name: sucursal.claveSucursal })) }))
    }

    const seleccionarUsuario = async () => {
      tickedSeleccionados.value = []
      if (usuarioSeleccionado.value !== null) {
        // Itera sobre cada módulo
      listaModulos.value.forEach((modulo) => {
      // Busca el permiso correspondiente al módulo actual
      const permiso = usuarioSeleccionado.value.permisos.find((permiso) => permiso.moduloPortale.nombreModulo === modulo.name)
          if (permiso) {
            // Si el permiso existe, verifica los valores true/false
            if (permiso.leer) {
              tickedSeleccionados.value.push(`${modulo.name}_leer`)
            }
            if (permiso.actualizar) {
              tickedSeleccionados.value.push(`${modulo.name}_actualizar`)
            }
            if (permiso.agregar) {
              tickedSeleccionados.value.push(`${modulo.name}_agregar`)
            }
            if (permiso.eliminar) {
              tickedSeleccionados.value.push(`${modulo.name}_eliminar`)
            }
          }
        })

        await obtenerPermisosSucursalesByUser(usuarioSeleccionado.value.idUsuario)
        tickedSucursales.value = permisosSucursales.value.filter(sucursal => sucursalesAgrupadas.value.some(empresa => empresa.sucursales.some(s => s.claveSucursal === sucursal.claveSucursal))).map(sucursal => sucursal.claveSucursal)
      }
    }

    const actualizarPermisos = async () => {
      loading.value = true

      let modulosSeleccionados = []
      let modulosSeleccionadosCRUD = []
      let modulosSeleccionadosAuxiliar = []
      for (const modulo of tickedSeleccionados.value) {
        const moduloSeleccionado = modulo.split('_')[0]

        if (!modulosSeleccionadosAuxiliar.includes(moduloSeleccionado)) {
          modulosSeleccionadosAuxiliar.push(moduloSeleccionado)

          modulosSeleccionados.push({name: moduloSeleccionado})

          modulosSeleccionadosCRUD.push({
            modulo: moduloSeleccionado,
            leer: tickedSeleccionados.value.includes(`${moduloSeleccionado}_leer`),
            actualizar: tickedSeleccionados.value.includes(`${moduloSeleccionado}_actualizar`),
            agregar: tickedSeleccionados.value.includes(`${moduloSeleccionado}_agregar`),
            eliminar: tickedSeleccionados.value.includes(`${moduloSeleccionado}_eliminar`)
          })
        }
      }

      const permisosActualizar = {
        usuarioSeleccionado: usuarioSeleccionado.value,
        permisosSeleccionados: modulosSeleccionados,
        idPortal: ID_SERVIDOR
      }

      await actualizarPermisosModulos(permisosActualizar)

      const permisosSucursalesActualizar = {
        idUsuario: usuarioSeleccionado.value.idUsuario,
        permisosSeleccionados: tickedSucursales.value,
      }

      await actualizarPermisosSucursales(permisosSucursalesActualizar)

      const permisosCRUD = {
        usuarioSeleccionado: usuarioSeleccionado.value,
        permisosSeleccionados: modulosSeleccionadosCRUD,
        idPortal: ID_SERVIDOR,
        editedBy: usuarioAutenticado.value.usuario
      }

      await actualizarPermisosCRUD(permisosCRUD)

      loading.value = false
      modalPermisos.value = false
    }

    const parametrosFiltradosEmpleados = (val, update) => {
      filtradoBusquedauUsuariosAcceso(
        val,
        update,
        filtroUsuariosAcceso.value,
        opcionesUsuariosAcceso
      )
    }

    return {
      // States / Vars
      modalPermisos,
      usuarioSeleccionado,
      checksPermisos,
      tickedSeleccionados,
      filtroUsuariosAcceso,
      checksSucursales,
      tickedSucursales,
      expanded,
      loading,
      // Methods
      abrir,
      seleccionarUsuario,
      actualizarPermisos,
      parametrosFiltradosEmpleados,
      opcionesUsuariosAcceso
    }
  }
}
</script>
