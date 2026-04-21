export default function fetchWithTimeout(url, options, timeout = 10000) {
  if (typeof options === 'number') {
    timeout = options;
    options = {};
  }

  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('La solicitud tardó demasiado')), timeout)
    ),
  ]);
};