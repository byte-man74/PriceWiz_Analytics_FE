import APIinstance from "../../api/api";

export const getStation = async (setData, setLoading, setOriginalData) => {
  setLoading(true);
  try {

    const response = await APIinstance.get("admin/get_all_stations/");

    setData(response.data.data);
    setOriginalData(response.data.data);
  } catch (error) {
    //j
  } finally {
    setLoading(false);
  }
};


export const getStates = async (setState) => {
  try {
    const response = await APIinstance.get("admin/get_all_state_available/");
    setState(response.data)
  } catch (error) {
  }
}

export const getLga = async (setLga) => {
  try {
    const response = await APIinstance.get("admin/get_all_lga_available/");
    setLga(response.data)
  } catch (error) {
  }
}

export const processSearch = async (setData, data, setLoading, name, local_government, state) => {
  setLoading(true);
  if (!name && !local_government && !state) {
    // If both name and local_government are falsy, reset the data to the original state
    setData(data);
  } else {
    let processed_data = filterStations(data, name, local_government, state);
    setData(processed_data);
  }

  setLoading(false);
};



export function filterStations(data, nameFilter, localGovFilter, stateFilter) {
  console.log(stateFilter);
  try {
    if (!data || !Array.isArray(data)) {
      throw new Error('Invalid or missing data array');
    }

    if (typeof nameFilter !== 'string' || typeof localGovFilter !== 'string') {
      throw new Error('Invalid filter parameters');
    }

    const processedData = data.filter((station) => {
      const nameMatch =
        station.station.name &&
        station.station.name.toLowerCase().includes(nameFilter.toLowerCase());

      const localGovMatch =
        station.station.local_government &&
        station.station.local_government
          .toLowerCase()
          .includes(localGovFilter.toLowerCase());

    
      const stateMatch =
          station.station.state &&
          station.station.state
            .toLowerCase()
            .includes(stateFilter.toLowerCase());

      return nameMatch && localGovMatch && stateMatch;
    });

    return processedData;
  } catch (error) {
    console.error('Error in filterStations:', error.message);
    return [];
  }
}





export function calculateStationsAndAveragePrice(data, setAveragePrice) {
  console.log('Calculating')
  if (data.length === 0) {
    return { numberOfStations: 0, averagePrice: 0 };
  }

  // Calculate the total number of stations
  const numberOfStations = data.length;

  // Calculate the average price
  const totalPrices = data.reduce((sum, station) => sum + station.price.amount, 0);
  const averagePrice = totalPrices / numberOfStations;

  // Round the average price to two decimal places
  const roundedAveragePrice = Math.round(averagePrice * 100) / 100;
  setAveragePrice(roundedAveragePrice)

  return { numberOfStations, averagePrice: roundedAveragePrice };
}