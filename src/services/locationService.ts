import * as Location from "expo-location"

export const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
  
    if (status !== "granted") {
      console.log("Permission to access location was denied.");
      return false;
    }
  
    const isLocationEnabled = await Location.hasServicesEnabledAsync();
    if (!isLocationEnabled) {
      console.log("Location services are disabled.");
      return false;
    }
  
    return true;
  };

  export const getCurrentLocation = async (): Promise<Location.LocationObjectCoords | undefined> => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // Richiede alta precisione
      });
      return location.coords;
    } catch (error: any) {
      if (error.code === 1) {
        console.log("Permission denied.");
      } else if (error.code === 2) {
        console.log("Position unavailable. Ensure GPS is enabled.");
      } else {
        console.log("Unknown error while fetching location:", error);
      }
      return undefined;
    }
  };

  // Sostituisci con la tua chiave API di Google Maps
const GOOGLE_API_KEY = "QUI METTETE LA API KEY";

// Funzione per ottenere coordinate da un indirizzo
const getCoordinatesFromAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      console.error("HTTP error:", response.status, response.statusText);
      return null;
    }

    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

export default getCoordinatesFromAddress;

const placeMarker = async () => {
  const address = "1600 Amphitheatre Parkway, Mountain View, CA";
  const coordinates = await getCoordinatesFromAddress(address);

  if (coordinates) {
    console.log("Coordinates:", coordinates);
    // Usali per creare un marker personalizzato sulla tua mappa
    // Esempio: map.addMarker(coordinates.lat, coordinates.lng);
  } else {
    console.log("Impossibile ottenere coordinate per l'indirizzo fornito.");
  }
};

placeMarker();

  