import React, { Fragment, useEffect, useState } from "react";
import EditTodo from "./EditTodo";

const ListTodos = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState(null); // Stan dla danych o pogodzie
  const [weatherError, setWeatherError] = useState(""); // Błędy związane z pogodą

  const WEATHER_API_KEY = "7eb19459aa84d3ce787d7a4ee0386cf6"; // Zamień na klucz API OpenWeatherMap

  // Delete todo function
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      // Update state without refreshing the page
      setTodos(todos.filter((todo) => todo.todo_id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err.message);
      setError("Failed to delete todo. Please try again.");
    }
  };

  // Fetch todos from the server
  const getTodos = async () => {
    try {
      const response = await fetch("http://localhost:5001/todos");

      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }

      const jsonData = await response.json();
      setTodos(jsonData);
      setError(""); // Clear any existing error
    } catch (err) {
      console.error("Error fetching todos:", err.message);
      setError("Failed to load todos. Please try again later.");
    }
  };

  // Fetch weather data
  const fetchWeather = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await response.json();
      setWeather({
        city: weatherData.name,
        cityId: weatherData.id, // Pobierz ID miasta
        temperature: weatherData.main.temp,
        icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`,
        description: weatherData.weather[0].description,
      });
      setWeatherError("");
    } catch (err) {
      console.error("Error fetching weather:", err.message);
      setWeatherError("Unable to fetch weather data.");
    }
  };

  // Get user's location
  const getLocationAndFetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error.message);
          setWeatherError("Unable to retrieve location.");
        }
      );
    } else {
      setWeatherError("Geolocation is not supported by this browser.");
    }
  };

  // Function to open detailed weather forecast
  const openWeatherDetails = () => {
    if (weather && weather.cityId) {
      const weatherUrl = `https://openweathermap.org/city/${weather.cityId}`;
      window.open(weatherUrl, "_blank");
    }
  };

  // Fetch todos and weather on component mount
  useEffect(() => {
    getTodos();
    getLocationAndFetchWeather();
  }, []);

  // Render the table rows
  const renderTodoRows = () => {
    if (todos.length === 0 && !error) {
      return (
        <tr>
          <td colSpan="3">No todos found. Add one!</td>
        </tr>
      );
    }

    return todos.map((todo) => (
      <tr key={todo.todo_id}>
        <td>{todo.description}</td>
        <td>
          <EditTodo
            todo={todo}
            onEdit={(id, newDescription) => {
              setTodos(
                todos.map((t) =>
                  t.todo_id === id ? { ...t, description: newDescription } : t
                )
              );
            }}
          />
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => deleteTodo(todo.todo_id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <Fragment>
      {/* Weather Bar */}
      <div
        className="weather-bar text-center bg-light py-2 mb-3"
        style={{ cursor: "pointer" }}
        onClick={openWeatherDetails}
        title="Click for detailed weather forecast"
      >
        {weather ? (
          <div>
            <strong>{weather.city}</strong> {weather.temperature}°C
            <img
              src={weather.icon}
              alt={weather.description}
              title={weather.description}
              style={{ width: "30px", marginLeft: "10px" }}
            />
          </div>
        ) : (
          <p className="text-muted">
            {weatherError || "Loading weather data..."}
          </p>
        )}
      </div>

      {/* Todos Table */}
      {error && <p className="text-danger">{error}</p>}
      <table className="table mt-5 text-center">
        <thead>
          <tr>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>{renderTodoRows()}</tbody>
      </table>
    </Fragment>
  );
};

export default ListTodos;