<template>
  <div id='login'>
    <div class='container'>
      <!-- Outer Row -->
      <div class='row justify-content-center'>
        <div class='col-xl-10 col-lg-12 col-md-9'>
          <div class='card o-hidden border-0 shadow-lg my-5'>
            <div class='card-body p-0'>
              <!-- Nested Row within Card Body -->
              <div class='row'>
                <div class='col-lg-6 d-none d-lg-block bg-login-image'></div>
                <div class='col-lg-6'>
                  <div class='p-5'>
                    <div class='text-center'>
                      <h1 class='h5 text-gray-900 mb-4'>Bienvenido a <strong>Calendario</strong></h1>
                    </div>
                    <form class='user'>
                      <div class='form-group'>
                        <input :class="{'form-control': true, 'form-control-user': true, 'border-danger': showError}"
                               id='exampleInputEmail' aria-describedby='emailHelp' placeholder='Introduzca su email'
                               v-model.trim='email'>
                      </div>
                      <div class='form-group'>
                        <input type='password'
                               :class="{'form-control': true, 'form-control-user': true, 'border-danger': showError}"
                               id='exampleInputPassword' placeholder='Introduzca su contraseña' v-model='password'
                               @keypress.enter='validateUser'>
                      </div>
                      <div v-if='showError' class='form-group'>
                        <div class='card bg-gradient-danger text-white small animated--grow-in'>
                          <div class='card-body'>Email o Constraseña Invalidos</div>
                        </div>
                      </div>
                      <!-- <div class="form-group">
                          <div class="custom-control custom-checkbox small">
                              <input type="checkbox" class="custom-control-input" id="customCheck" v-model="remember">
                              <label class="custom-control-label" for="customCheck">Recuerdame</label>
                          </div>
                      </div> -->
                      <a @click='validateUser' class='btn btn-primary btn-user btn-block text-white'
                         style='cursor: pointer'>
                        Iniciar Sesión
                      </a>
                      <router-link :to="{name: 'homePage'}" class='btn btn-primary btn-user btn-block text-white'
                                   style='cursor: pointer'>
                        Entrar como usuario anónimo
                      </router-link>
                    </form>
                    <hr>
                    <div class='text-center'>
                      <router-link :to="{name: 'registerPage'}" class='small text-dark'><strong>Registrarse</strong>
                      </router-link>
                    </div>
                    <!-- <div class="text-center">
                        <a class="small" href="forgot-password.html">Recuperar Contraseña</a>
                    </div> -->
                    <!--                    <div class='text-center'>-->
                    <!--                      <router-link :to="{name: 'registerPage'}" class='small text-dark'><strong>Registrarse</strong>-->
                    <!--                      </router-link>-->
                    <!--                    </div>-->
                  </div>
                </div>
              </div>
              <!-- Footer -->
              <footer class='sticky-footer'>
                <div class='container'>
                  <div class='copyright text-center text-dark'>
                    <strong>Facultad de Matemática y Computación de la Universidad de La Habana &copy; 2022</strong>
                  </div>
                </div>
              </footer>
              <!-- End of Footer -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      remember: false,
      showError: false,
    };
  },
  methods: {
    validateUser() {

      // Petitions.clearHeaders();
      // Petitions.set_JSONHeaders();
      //
      // Petitions.post(Endpoints.login, {
      //   email: 'yancarloglez98@gmail.com',
      //   password: '12345678ABC',
      // }).then(response => console.log(response.json()), response => console.log('Error getting the response.'));


      this.getToken(this.email, this.password, this.remember);
    },
    getToken(username, password, remember) {
      this.$store.state.profile.authenticate(username, password, remember)
        .then(result => {
          if (result === false) {
            this.showError = true;
            setTimeout(() => {
              this.showError = false;
            }, 2000);
          } else {
            this.$router.push({ name: 'homePage' });
          }
        });
    },
  },
};
</script>
