type Stations = {
  idOf: (station: number) => string;
};

export const stations: Stations = {
  idOf: station => `station-${station}`
};
