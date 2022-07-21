import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-semester';
const baseEndpoint = Endpoints.semesters;

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
  }, edit(token, semester) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.put(baseEndpoint, {
      semesterId: semester.id, ...semester,
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
  }, getDetails(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(baseEndpoint + '/details/' + id)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        console.log(json);

        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });
  },
};
