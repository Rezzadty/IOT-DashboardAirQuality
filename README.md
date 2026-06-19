# IoT Air Quality Dashboard — React + Vite

This is a **React + Vite** web application built as a real-time **Dashboard Monitoring** system. It receives and displays air quality data transmitted from an **ESP8266** microcontroller through **Firebase Realtime Database**.

## Project Overview

This dashboard is part of a bachelor's final project (Tugas Akhir) focused on IoT-based air quality monitoring. The ESP8266 collects sensor readings and transmits them to Firebase Realtime Database via Wi-Fi. This React + Vite web application then fetches that data in real-time and presents it through an intuitive, user-friendly dashboard interface.

### Data Flow

```
Sensors → ESP8266 (Wi-Fi) → Firebase Realtime Database → React + Vite Dashboard
```

### Hardware & Sensors Used

| Component | Function |
|-----------|----------|
| **ESP8266** | Main microcontroller — collects data & transmits to Firebase via Wi-Fi |
| **MQ-7** | Carbon Monoxide (CO) gas sensor |
| **MQ-135** | Air quality sensor (detects NH₃, NOₓ, alcohol, benzene, CO₂, smoke) |
| **DHT-20** | Temperature & Humidity sensor (I2C) |
| **ADS1115** | 16-bit ADC module — converts analog sensor outputs for ESP8266 |
| **HW-389** | Support/breakout board for the ESP8266 |

### Key Features
- Real-time data synchronization with Firebase Realtime Database
- Interactive dashboard for air quality monitoring
- Responsive design for various devices
- Data visualization for IoT sensor readings (CO, air quality, temperature, humidity)

### Technology Stack
- **Frontend Framework**: React (with Vite build tool)
- **Database / Backend**: Firebase Realtime Database
- **Build Tool**: Vite
- **Styling**: CSS

### Important Notes
> This project is currently under active development. The primary focus at this stage is implementing reliable data fetching from Firebase and visualizing the sensor readings. The codebase may still require optimization and refactoring as the project progresses.

### Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure Firebase credentials in your environment/config file
4. Run development server: `npm run dev`

### Future Improvements
- Enhanced UI/UX design
- Additional data visualization charts
- Historical data analysis
- Alert system for critical air quality levels

---

## Related Project — Gomi

This project shares the **same IoT concept and hardware setup** as the [**Gomi**](https://github.com/Rezzadty/Gomi) project.

| | This Project | [Gomi](https://github.com/Rezzadty/Gomi) |
|---|---|---|
| **Platform** | Web (Browser) | Mobile (Android / iOS) |
| **Framework** | React + Vite | React Native + Expo |
| **Purpose** | Web-based Dashboard Monitoring | Mobile-based Dashboard Monitoring |
| **Data Source** | Firebase Realtime Database | Firebase Realtime Database |
| **Hardware** | ESP8266 + same sensors | ESP8266 + same sensors |

> Both projects were developed as part of the same bachelor's final project (Tugas Akhir), providing two different client interfaces — **web** and **mobile** — for the same IoT air quality monitoring system.

---

Thank you for reading this! (つ≧▽≦)つ