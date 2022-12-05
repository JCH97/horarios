import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-class';

export default {
  data: {},
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
  }, create(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.post(Endpoints.createClass, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });

  },
  getData(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.get(Endpoints.classes + '/' + id)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
  edit(token, _class) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(Endpoints.classes, {
      classId: _class.id,
      ..._class,
    })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
  editMultiple(token, serieId, originalClass, toUpdateClass) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(Endpoints.multipleEditionClass, {
      serieId,
      originalClass,
      toUpdateClass,
    })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
  editMultipleByFields(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(Endpoints.multipleEditionByFields, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
  getDetails(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(Endpoints.classes + '/details/' + id)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
};
