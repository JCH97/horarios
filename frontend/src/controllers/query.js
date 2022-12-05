import Petitions from './petitions';
import Endpoints from '../endpoints/endpoints';

const data_key = 'calendario-matcom-query';

export default {
  data: {}, saveMinData() {
    localStorage.setItem(data_key, JSON.stringify(this.data));
  }, loadMinData() {
    let stored = localStorage.getItem(data_key);
    if (stored !== null) {
      this.data = JSON.parse(stored);
    }
  }, removeMinData() {
    localStorage.removeItem(data_key);
  }, makeQuery(token, lessons, locals, groups, types, majors, start, end) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(token, '');

    let body = {
      lessons, locals, groups, types, majors,
    };

    if (start !== null) {
      body.start = start;
    }
    if (end !== null) {
      body.end = end;
    }

    return Petitions.post(Endpoints.query, body)
      .then(response => response.json(), response => console.log('Error getting the response!', response))
      .then(json => {


        this.data = json.items;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
};
