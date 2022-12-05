import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-users';

export default {
  data: [],
  saveMinData() {
    localStorage.setItem(data_key, JSON.stringify(this.data));
  },
  loadMinData() {
    let stored = localStorage.getItem(data_key);
    if (stored !== null) {
      this.data = JSON.parse(stored);
    }
  },
  removeMinData() {
    localStorage.removeItem(data_key);
  },
  getAll: function(token, filter = {}) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(Endpoints.usersGetAll, {
      'filter': filter,
    })
      .then(response => response.json())
      .then(json => {
        json = json.items;

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      });
  },
  getData(token) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.get(Endpoints.users).then(response => response.json(), response => console.log('Error getting the response.')).then(json => {
      if (json !== null && !json.hasOwnProperty('error')) {
        this.data = json;
        this.saveMinData();
        return true;
      }
      return false;
    });
  },
  linkUser(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    console.log(`into link user ${body}`);

    return Petitions.post(Endpoints.linkUserTeacher, body)
      .then(response => response.json())
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });
  },
};
