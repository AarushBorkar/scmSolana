import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (fix Leaflet's default marker issue)
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Function to generate random phone numbers
const generatePhoneNumber = () => {
  return '9' + Math.floor(Math.random() * 1000000000);
};

// Sample addresses
const sampleAddresses = [
  "Near Kalyan Station, Kalyan",
  "Opp. Seawoods Mall, Navi Mumbai",
  "Near Dombivli East, Dombivli",
  "Behind Shankar Mandir, Thane",
  "Near Vashi Plaza, Vashi",
  "Near Ghatkopar Station, Mumbai",
  "Opp. Mulund West Market, Mulund",
  "Next to Borivali East Station, Borivali",
  "Near Manpada, Thane",
  "Near Kopar Khairane, Navi Mumbai"
];

const VendorsPage = () => {
  const [vendors] = useState([
    { id: 1, name: "Ramesh Kumar", lat: 19.2183, lng: 72.9782 },
    { id: 2, name: "Shankar Patel", lat: 19.0758, lng: 72.8777 },
    { id: 6, name: "Suresh Singh", lat: 19.1155, lng: 72.8310 },
    { id: 7, name: "Vikash Reddy", lat: 19.0450, lng: 73.0143 },
    { id: 8, name: "Rajesh Deshmukh", lat: 19.1896, lng: 73.0857 },
    { id: 9, name: "Kiran Patil", lat: 19.2438, lng: 72.8753 },
    { id: 10, name: "Manoj Kumar", lat: 19.4500, lng: 72.8291 },
    { id: 11, name: "Vishal Gupta", lat: 19.2352, lng: 73.2892 },
    { id: 12, name: "Pradeep Joshi", lat: 19.2234, lng: 72.9521 },
  ]);

  // Add phone number and address to each vendor
  const vendorsWithDetails = vendors.map((vendor) => ({
    ...vendor,
    phone: generatePhoneNumber(),
    address: sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)],
  }));

  return (
    <div>
      <h1>Available Vendors</h1>
      <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: "500px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {vendorsWithDetails.map((vendor) => (
          <Marker key={vendor.id} position={[vendor.lat, vendor.lng]} icon={customIcon}>
            <Popup>
              <strong>{vendor.name}</strong>
              <br />
              Phone: {vendor.phone}
              <br />
              Address: {vendor.address}
              <br />
              Wallet: <code style={{ wordWrap: 'break-word', maxWidth: '150px' }}>dad6YRNQKc2Kq56gSubF1mcJ8JBmaWKJyQxr4T2AQt5</code>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default VendorsPage;