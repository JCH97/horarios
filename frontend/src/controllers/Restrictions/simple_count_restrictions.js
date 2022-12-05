import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key_conditions = 'calendario-matcom-simple-count-restrictions';

export default {
  data: {} | [],
  saveMinData() {
    localStorage.setItem(data_key_conditions, JSON.stringify(this.data));
  },
  loadMinData() {
    let stored = localStorage.getItem(data_key_conditions);
    if (stored !== null) {
      this.data = JSON.parse(stored);
    }
  },
  removeMinData() {
    localStorage.removeItem(data_key_conditions);
  },
  create(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(`${Endpoints.simple_count_restrictions}/create`, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });

  },
  getAll(token, filter = {}) {

    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(`${Endpoints.simple_count_restrictions}/all`, {
      'filter': filter,
    })
      .then(response => response.json())
      .then(json => {
        json = json.items ? json.items : json;
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      });

  },
  delete(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.delete(`${Endpoints.simple_count_restrictions}`, { id: id })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      })
      .catch(err => console.log(err));
  },

};
