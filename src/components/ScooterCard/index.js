import React from 'react';

export const ScooterCard = () => {
  return (
    <section id="scooter" className="card">
      <table>
        <tbody>
          <tr>
            <th>Tier</th>
            <td>
              0 sparkesyklar
            </td>
            <td>20 meter</td>
          </tr>
          <tr>
            <th>Voi</th>
            <td>
              0 sparkesyklar
            </td>
            <td>38 meter</td>
          </tr>
          <tr>
            <th>Zvipp</th>
            <td>
              0 sparkesyklar
            </td>
            <td>80 meter</td>
          </tr>
        </tbody>
      </table>
      <h6>Sparkesykkeldata i 200 meters omkrets levert av Entur</h6>
    </section>
  );
}

export default ScooterCard;