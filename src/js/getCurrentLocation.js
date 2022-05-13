export async function getCurrentLocation() {
  try {
    const response = await fetch("https://api.sypexgeo.net/json/");
    const data = await response.json();
    return data.city.name_ru;
  } catch (error) {
    console.log(`Error: ${error.message}`);
    console.log(error.response);
    return false;
  }
}
