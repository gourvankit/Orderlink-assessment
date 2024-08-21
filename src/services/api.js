import axios from "axios";

export const fetchData = async () => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=100");
    return response.data.results.map((user) => ({
      id: user.login.uuid,
      name: `${user.name.first} ${user.name.last}`,
      age: user.dob.age,
      email: user.email,
    }));
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
