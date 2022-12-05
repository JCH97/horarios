const data_key = 'calendario-matcom-location';

export default {
  data: {},
  saveMinData() {
    localStorage.setItem(data_key, JSON.stringify(this.data));
  },
  getComponent(name) {
    this.data = localStorage.getItem(data_key);

    if (this.data) {
      this.data = JSON.parse(this.data);
      if (this.data[name])
        return this.data[name];
    }

    return '';
  },
  saveComponent(name, value) {
    this.data = localStorage.getItem(data_key);

    localStorage.removeItem(data_key);

    this.data = this.data ? JSON.parse(this.data) : {};
    this.data[name] = value;

    this.saveMinData();
  },
  removeComponent(name) {
    this.data = localStorage.getItem(data_key);

    if (this.data) {
      this.data = JSON.parse(this.data);
      localStorage.removeItem(data_key);

      delete this.data[name];
      this.saveMinData();
    }
  },
};