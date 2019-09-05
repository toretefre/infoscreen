import React, { useState, useEffect } from 'react';

export const MannenCard = () => {
  const [mannenStatus, setMannenStatus] = useState();

  useEffect(() => setMannenStatus('nei'), []);

  return (
    <section className="card">
      <h1>Har Mannen falt?</h1>
      <h3>NEI</h3>
    </section>
  );
};

export default MannenCard;
