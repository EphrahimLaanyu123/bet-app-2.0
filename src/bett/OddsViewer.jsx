import { useEffect, useState } from 'react';

function OddsApp() {
  const [oddsData, setOddsData] = useState(null);
  const apiKey = 'b5d1de1ee8a2c79e75a92165964e9fce';
  const url = `https://api.the-odds-api.com/v4/sports/upcoming/odds/?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=decimal`;

  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setOddsData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Upcoming Odds</h1>
      {oddsData ? (
        oddsData.map(event => (
          <div key={event.id}>
            <h2>{event.home_team} vs {event.away_team}</h2>
            <p>Commence Time: {event.commence_time}</p>
            {event.bookmakers.map(bookmaker => (
              <div key={bookmaker.key}>
                <h3>Bookmaker: {bookmaker.title}</h3>
                {bookmaker.markets.map(market => (
                  <div key={market.key}>
                    <h4>Market: {market.key}</h4>
                    {market.outcomes.map(outcome => (
                      <p key={outcome.name}>{outcome.name}: {outcome.price}</p>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default OddsApp;
