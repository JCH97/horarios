import Petitions from '@/controllers/petitions';
import Endpoints from '@/endpoints/endpoints';

const data_key = 'calendario-matcom-relational-restriction-details';

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
  },

  getData(token, id) {
    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(`${Endpoints.relational_restrictions}/find_one/${id}`)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        this.data = json;
        this.saveMinData();

        return json !== null && !json.hasOwnProperty('error');
      });
  },
};
