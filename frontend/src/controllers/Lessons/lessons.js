import Petitions from '../petitions';
import Endpoints from '../../endpoints/endpoints';

const data_key = 'calendario-matcom-lessons';

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
  }, create(token, body) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(`${Endpoints.lessons}/create`, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });

  }, delete(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.delete(Endpoints.lessons, { id: id })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      })
      .catch(err => console.log(err));
  }, getAll(token, filter = {}) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.post(Endpoints.lessonsGetAll, {
      'filter': filter,
    })
      .then(response => response.json())
      .then(json => {
        json = json.items;

        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');

      });
  }, getData(token, pageNum = 1, pageLimit = 10, filter = {}) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);
    return Petitions.post(Endpoints.lessons, {
      pageParams: {
        'pageNum': pageNum, 'pageLimit': pageLimit,
      }, filter: filter,
    })
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {

        json = json.items;

        if (json !== null && !json.hasOwnProperty('error')) {
          this.data = json;
          this.saveMinData();
          return true;
        }
        return false;
      });
  },
};
