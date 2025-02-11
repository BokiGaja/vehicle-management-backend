# Vehicle Management API

## Setup & Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node server.js
   ```

The API runs on `http://localhost:3500`.

---

## Endpoints

### Get All Vehicles
- **GET** `/vehicles`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "license_plate": "ABC123",
      "manufacturer": "Toyota",
      "vin": "1HGCM82633A123456",
      "custom_name": "MyCar",
      "slug": "mycar-abc123"
    }
  ]
  ```

### Get Vehicle by Slug
- **GET** `/vehicles/:slug`
- **Response:**
  ```json
  {
    "id": 1,
    "license_plate": "ABC123",
    "manufacturer": "Toyota",
    "vin": "1HGCM82633A123456",
    "custom_name": "MyCar",
    "slug": "mycar-abc123"
  }
  ```

### Add a Vehicle
- **POST** `/vehicles`
- **Body:**
  ```json
  {
    "license_plate": "XYZ789",
    "manufacturer": "Honda",
    "vin": "2HGCM82633A987654",
    "custom_name": "Speedster"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "license_plate": "XYZ789",
    "manufacturer": "Honda",
    "vin": "2HGCM82633A987654",
    "custom_name": "Speedster",
    "slug": "speedster-xyz789"
  }
  ```

### Update a Vehicle
- **PUT** `/vehicles/:id`
- **Body:**
  ```json
  {
    "license_plate": "XYZ789",
    "manufacturer": "Honda",
    "vin": "2HGCM82633A987654",
    "custom_name": "SuperFast"
  }
  ```
- **Response:**
  ```json
  {
    "id": 2,
    "license_plate": "XYZ789",
    "manufacturer": "Honda",
    "vin": "2HGCM82633A987654",
    "custom_name": "SuperFast",
    "slug": "superfast-xyz789"
  }
  ```

