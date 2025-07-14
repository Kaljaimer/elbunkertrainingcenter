<template>
  <div class="authentication-area ptb-20">
    <div class="container">
      <div class="authentication-content">
        <div class="row">
          <div class="col-lg-5">
            <div class="login h-100 text-center">
              <img
                src="~/assets/images/login.png"
                class="h-100 object-fit-cover"
                alt="login"
              />
            </div>
          </div>
          <div class="col-lg-7">
            <div class="authentication-form">
              <ul class="nav nav-tabs login-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                  <NuxtLink to="/login" class="nav-link active">Acceso</NuxtLink>
                </li>
                <li class="nav-item" role="presentation">
                  <NuxtLink to="/register" class="nav-link">Registro</NuxtLink>
                </li>
              </ul>
              <p>
                Si tienes una cuenta, inicia sesión con tu email.
              </p>
              <div>
                <div class="form-group mb-4">
                  <label class="label">Email *</label>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Introduce email"
                    v-model="username"
                  />
                </div>
                <div class="form-group mb-4">
                  <label class="label">Contraseña *</label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="Introduce contraseña"
                    v-model="password"
                  />
                </div>
                <div class="d-flex justify-content-between mb-4">
                  <div class="form-check">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="flexCheckDefault"
                        v-model="rememberMe"
                    />
                    <label class="form-check-label" for="flexCheckDefault">
                      Recordarme
                    </label>
                  </div>
<!--                  <NuxtLink to="/forgot-password" class="text-primary">-->
<!--                    ¿Olvidaste tu contraseña?-->
<!--                  </NuxtLink>-->
                </div>
                <button
                    class="btn btn-warning btn-pill text-white w-100 d-block"
                    @click="login"
                >
                  Acceso
                </button>
                <div class="form-group mb-0">
                  <p class="text-secondary ms-1 text-primary">
                    ¿No tienes una cuenta?
                    <NuxtLink
                      to="/register"
                      class="text-decoration-none text-primary"
                    >
                      Registro
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
import {showError} from '~/composables/useToast';
import {backendURL, usePostExternal} from "~/composables/useApi";

const username = ref('');
const password = ref('');
const rememberMe = ref(false);

onBeforeMount(() => {
  if (localStorage?.getItem('loggedUser')) {
    username.value = localStorage.getItem('username') || '';
    password.value = localStorage.getItem('password') || '';
    rememberMe.value = true;
  }
});

async function login(){
  const endpointResponse: any = usePostExternal(`${backendURL}/auth/`,{username: username.value, password: password.value});
  endpointResponse.then((response: any) => {
    if (!response.error?.value) {
      if (rememberMe) {
        localStorage.setItem('username', username.value);
        localStorage.setItem('password', password.value);
      }
      localStorage.setItem('loggedUser', JSON.stringify(response.data.value));
      navigateTo(`/`);
    } else {
      showError(response);
    }
  });
}
</script>
