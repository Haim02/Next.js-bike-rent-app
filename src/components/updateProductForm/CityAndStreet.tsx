"use client";

import React, { useEffect, useState, FC, ChangeEvent } from "react";

interface ChildProps {
  onInputsChange: (data: {
    city: string;
    street: string;
    houseNumber: number;
  }) => void;
}

const CityAndStreet: FC<ChildProps> = ({ onInputsChange }) => {
  const [cities, setCities] = useState<string[]>([]);
  const [streets, setStreets] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);

  const handleCityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const cityInput = e.target.value;
    setCity(cityInput);
    onInputsChange({ city: cityInput, street, houseNumber });
  };

  const handleStreetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const streetInput = e.target.value;
    setStreet(streetInput);
    onInputsChange({ city, street: streetInput, houseNumber });
  };

  const handleHouseNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    setHouseNumber(val);
    onInputsChange({ city, street, houseNumber: val });
  };

  useEffect(() => {
    fetch("/api/locations/cities")
      .then((r) => r.json())
      .then((json) => {
        const names: string[] = json.result.records.map(
          (r: any) => r["שם_ישוב"]
        );
        setError(false);
        setCities(Array.from(new Set(names)));
      })
      .catch((err) => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (!city) return;
    fetch(`/api/locations/${encodeURIComponent(city)}`)
      .then((r) => r.json())
      .then((json) => {
        const names: string[] = json.result.records.map(
          (r: any) => r["שם_רחוב"]
        );
        setError(false);
        setStreets(Array.from(new Set(names)));
      })
      .catch((err) => {
        setError(true);
      });
  }, [city]);

  return (
    <div className="md:grid md:grid-cols-3 md:gap-4 text-right">
      <div>
        <label>עיר</label>
        <input
          list="cities"
          value={city}
          onChange={handleCityChange}
          className="w-full border rounded-lg px-4 py-2 text-right"
        />
        <datalist id="cities">
          {cities.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </div>

      <div>
        <label>רחוב</label>
        <input
          list="streets"
          value={street}
          onChange={handleStreetChange}
          disabled={!city}
          className="w-full border rounded-lg px-4 py-2 text-right"
        />
        <datalist id="streets">
          {streets.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div>
        <label>מספר בית</label>
        <input
          type="number"
          value={houseNumber || ""}
          onChange={handleHouseNumberChange}
          className="w-full border rounded-lg px-4 py-2 text-right"
        />
      </div>
    </div>
  );
};

export default CityAndStreet;
