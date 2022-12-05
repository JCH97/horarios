import Petitions from '@/controllers/petitions';
import Endpoints from '@/endpoints/endpoints';
import Condition_types from '@/controllers/Restrictions/condition_types';

const data_key_conditions = 'calendario-matcom-restrictions-conditions';

export default {
  data: {},
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
  updateDataValue(data, key) {
    this.data[key] = data;

    this.saveMinData();
  },
  getHappiness(body = {}) {

    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, null);

    return Petitions.get(`${Endpoints.happiness}`, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          // this.data = json;
          this.updateDataValue(json, Condition_types.HAPPINESS);
          return true;
        }
        return false;
      });
  },

  getDescriptionRestrictions(body = {}) {

    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, null);

    return Petitions.post(`${Endpoints.getRestrictionsDescriptions}`, body)
      .then(response => response.json(), response => console.log('Error getting the response.'))
      .then(json => {
        if (json !== null && !json.hasOwnProperty('error')) {
          // this.data = json;
          this.updateDataValue(json, Condition_types.RESTRICTIONS_DESCRIPTIONS);
          return true;
        }
        return false;
      });
  },
};
