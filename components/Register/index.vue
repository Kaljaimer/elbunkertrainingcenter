<template>
  <div class="authentication-area ptb-20">
    <div class="container">
      <div class="authentication-content">
        <div class="row">
          <div class="col-lg-5">
            <div class="login h-100 text-center">
              <img
                src="~/assets/images/register.png"
                class="h-100 object-fit-cover"
                alt="Registro"
              />
            </div>
          </div>
          <div class="col-lg-7">
            <div class="authentication-form">
              <ul class="nav nav-tabs login-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <NuxtLink to="/login" class="nav-link">Acceso</NuxtLink>
                </li>
                <li class="nav-item" role="presentation">
                  <NuxtLink to="/register" class="nav-link active">
                    Registro
                  </NuxtLink>
                </li>
              </ul>
              <p>
                Si no tienes una cuenta, regístrate con tu nombre de usuario o tu correo electrónico.
              </p>
              <div>
                <div class="form-group mb-4">
                  <label class="label">Nombre *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Introduzca su nombre"
                    v-model="name"
                  />
                </div>
                <div class="form-group mb-4">
                  <label class="label">Apellido(s) *</label>
                  <input
                      type="text"
                      class="form-control"
                      placeholder="Introduzca su(s) apellido(s)"
                      v-model="surname"
                  />
                </div>
                <div class="form-group mb-4">
                  <label class="label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    placeholder="Introduzca email"
                    v-model="email"
                  />
                </div>
                <div class="form-group mb-4">
                  <label class="label">Contraseña *</label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Introduzca contraseña"
                    v-model="password"
                  />
                </div>
                <div class="form-group mb-4">
                  <button
                    type="submit"
                    class="btn btn-warning btn-pill text-white w-100 d-block"
                    @click="register"
                    :disabled="!name || !surname || !email || !password"
                  >
                    Registrarse
                  </button>
                </div>
                <div class="form-group mb-0">
                  <p class="text-secondary ms-1 text-primary">
                    ¿Ya tienes una cuenta?
                    <NuxtLink
                      to="/login"
                      class="text-decoration-none text-primary"
                    >
                      Acceso
                    </NuxtLink>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showError } from '~/composables/useToast';
import router from "#app/plugins/router";

const name = ref('');
const surname = ref('');
const email = ref('');
const password = ref('');

async function register() {
  const response: any = await usePost(`/users/`, {
    username: email.value,
    email: email.value,
    password: password.value,
    name: name.value,
    lastname: surname.value,
  });
  if (response?.error?.value) {
    showError(response);
  } else {
    showSuccess('Usuario registrado correctamente');
    navigateTo(`/`);
  }
}
</script>
