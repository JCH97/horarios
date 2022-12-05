import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-profile';
const data_user = 'calendario-matcom-user';

export default {
  data: {
    id: -1,
    username: '',
    fullname: '',
    email: '',
    token: '',
    remember: '',
    permissions: 0,
  },
  saveMinData() {
    localStorage.setItem(data_key, JSON.stringify({
      token: String(this.data.token),
      remember: String(this.data.remember),
    }));

    localStorage.setItem(data_user, JSON.stringify(this.data));
  },
  loadMinData() {
    if (localStorage.getItem(data_key) !== null) {
      let temp_data = JSON.parse(localStorage.getItem(data_key));
      this.data.token = String(temp_data.token);
      this.data.remember = Boolean(temp_data.remember);
    }
  },
  removeMinData() {
    // localStorage.removeItem(data_key);
    // localStorage.removeItem(data_user);

    localStorage.clear();
  },
  isLogued() {
    let temporalData = this.data;

    if (localStorage.getItem(data_user) !== null)
      temporalData = JSON.parse(localStorage.getItem(data_user));

    return temporalData.token !== '' && temporalData.email !== '';
  },
  logOut() {
    this.data.id = -1;
    this.data.username = '';
    this.data.fullname = '';
    this.data.email = '';
    this.data.year = '';
    this.data.token = '';

    this.removeMinData();
  },
  getAuthJson(email, password) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null);
    const ans = Petitions.post(Endpoints.login, {
      email,
      password,
    }).then(response => response.json(), response => console.log('Error getting the response.'));

    return ans;
  },
  authenticate(username, password, remember) {
    return this.getAuthJson(username, password)
      .then(json => {
        if (json.hasOwnProperty('token')) {

          this.getData().then(r => {
          });

          this.data.token = String(json.token);
          this.data.remember = Boolean(json.remember || false);
          this.saveMinData();

          return true;
        }
        console.log(json.error + ':' + json.message);
        return false;
      });
  },
  getData() {
    this.loadMinData();
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders('', '', this.data.token);
    return Petitions.get(Endpoints.profile).then(
      response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json.hasOwnProperty('email') && json.hasOwnProperty('username') && json.hasOwnProperty('id')) {
          this.data.email = json.email;
          this.data.username = json.username;
          this.data.id = json.id;
          this.data.permissions = json.permissions;

          this.saveMinData();
        }
      });
  },
  register(username, email, password) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders();
    return Petitions.post(Endpoints.register, {
      username: username,
      email: email,
      password: password,
    }).then(response => response.json(), response => console.log('Error getting the response.'));
  },
  hasRole(role) {
    let temporalData = this.data;

    if (localStorage.getItem(data_user) !== null)
      temporalData = JSON.parse(localStorage.getItem(data_user));

    return ((this.isLogued() === true) && ((temporalData.permissions & role) === role));
  },
  updateUser(token, body, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(Endpoints.users, {
      id,
      data: { ...body },
    })
      .then(response => response.json(),
        response => console.log('Error getting the response.'));
  },
};
