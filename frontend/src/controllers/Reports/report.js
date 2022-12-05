import Petitions from '../petitions';
import Endpoints from '@/endpoints/endpoints';

const data_key = 'calendario-matcom-report';

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
  }, generateExcelReport(token) {

    Petitions.clearHeaders();
    Petitions.set_JSONHeaders(null, null, token);

    return Petitions.get(Endpoints.excelReport)
      .then(response => response.blob())
      .then(response => {
        this.data = {
          data: response,
        };
        this.saveMinData();

        return true;
      });
  },
};
