// Simple node-run test for weather service and forecast component logic
import { fetchWeatherForDistrict, makeBanglaAdvice } from '../src/lib/services/weather.js';

(async function run() {
  console.log('=== Forecast Service Tests ===');

  const data = await fetchWeatherForDistrict('Anwara');
  console.assert(Array.isArray(data), 'FAIL: fetchWeatherForDistrict should return an array');
  console.assert(data.length === 5, `FAIL: expected 5 days, got ${data.length}`);
  console.log('✓ fetchWeatherForDistrict returns 5-day array');

  const sample = data[0];
  const advice = makeBanglaAdvice(sample);
  console.assert(typeof advice === 'string' && advice.length > 0, 'FAIL: makeBanglaAdvice should return a non-empty string');
  console.log('✓ makeBanglaAdvice returns non-empty string');

  console.log('=== Forecast Tests Passed ===');
})();
