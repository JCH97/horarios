import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-classes';

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
  createInSerie(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.post(Endpoints.multipleCreateClass, body)
      .then(response => response.json())
      .then(json => {
        json = !json.hasOwnProperty('error') ? json.items : json;

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      });
  },
  deleteInSerie(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.delete(Endpoints.classRemoveInSerie, { id: id })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      })
      .catch(err => console.log(err));
  },
  delete(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.delete(Endpoints.classes, { id: id })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      })
      .catch(err => console.log(err));
  },
  getAll(token, filter = {}) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(Endpoints.classesGetAll, {
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
  getData(token, filter = {}, pageNum = 1, pageLimit = 100) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.post(Endpoints.classes, {
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
};
