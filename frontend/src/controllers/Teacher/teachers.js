import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-teachers';

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
  create(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(`${Endpoints.teachers}/create`, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });

  },
  delete(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.delete(Endpoints.teachers, { id: id })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      })
      .catch(err => console.log(err));
  },
  getAll: function(token, filter = {}) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(Endpoints.teachersGetAll, {
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
  getData(token, filter = {}, pageNum = 1, pageLimit = 10) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.post(Endpoints.teachers, {
      pageParams: {
        'pageNum': pageNum, 'pageLimit': pageLimit,
      }, filter: filter,
    })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        json = json.items;
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
  unlinkUser(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(Endpoints.teachersBreakUser, body)
      .then(response => response.json())
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
};
