import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-faculty';
const baseEndpoint = Endpoints.faculties;

export default {
  data: [], saveMinData() {
    localStorage.setItem(data_key, JSON.stringify(this.data));
  }, loadMinData() {
    let stored = localStorage.getItem(data_key);
    if (stored !== null) {
      this.data = JSON.parse(stored);
    }
  }, removeMinData() {
    localStorage.removeItem(data_key);
  }, getData(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(baseEndpoint + '/' + id)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });
  }, edit(token, faculty) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(baseEndpoint, {
      facultyId: faculty.id, ...faculty,
    })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });
  }, getDetails(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(baseEndpoint + '/details/' + id)
      .then(response => response.json(), response => console.log('Error getting the response.'))
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
