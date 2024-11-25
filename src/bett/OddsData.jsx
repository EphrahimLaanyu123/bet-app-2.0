import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Bangbet from '../assets/Bangbet - Sheet1.csv';
import Betika from '../assets/Betika - Sheet1.csv';
import Betlion from '../assets/Betlion - Sheet1.csv';
import Odibet from '../assets/Odibet - Sheet1.csv';
import Sportpesa from '../assets/Sportpesa - Sheet1.csv';
import './OddsData.css';

const OddsData = () => {
    const [homeGames, setHomeGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null); // to manage the dropdown
    const csvFiles = [
        { file: Bangbet, name: 'Bangbet' },
        { file: Betika, name: 'Betika' },
        { file: Betlion, name: 'Betlion' },
        { file: Odibet, name: 'Odibet' },
        { file: Sportpesa, name: 'Sportpesa' }
    ];

    useEffect(() => {
        const fetchAndParseData = async () => {
            let gamesMap = {};

            // Fetch and parse each CSV
            for (let { file, name } of csvFiles) {
                const response = await fetch(file);
                const text = await response.text();

                // Parse the CSV data
                const parsedData = Papa.parse(text, { header: true, skipEmptyLines: true });
                const games = parsedData.data;

                // Process each game in the CSV
                games.forEach(game => {
                    if (game.Home && game.Away && game['1'] && game['x'] && game['2']) {
                        // Home and Away game with odds
                        const gameKey = `${game.Home} vs ${game.Away}`;
                        
                        // If this home/away game already exists, push the new source and odds
                        if (gamesMap[gameKey]) {
                            gamesMap[gameKey].push({
                                source: name,
                                homeOdds: game['1'],  // Column '1' for Home odds
                                drawOdds: game['x'],  // Column 'x' for Draw odds
                                awayOdds: game['2']   // Column '2' for Away odds
                            });
                        } else {
                            // Otherwise, create a new entry with this game and its source
                            gamesMap[gameKey] = [{
                                source: name,
                                homeOdds: game['1'],
                                drawOdds: game['x'],
                                awayOdds: game['2']
                            }];
                        }
                    }
                });
            }

            // Convert the map into a list for display
            const allGames = Object.keys(gamesMap).map(gameKey => ({
                gameKey,
                details: gamesMap[gameKey]
            }));

            setHomeGames(allGames);
        };

        fetchAndParseData();
    }, []);

    // Handle dropdown toggle
    const handleDropdownToggle = (game) => {
        if (selectedGame === game.gameKey) {
            setSelectedGame(null); // Close the dropdown if clicked again
        } else {
            setSelectedGame(game.gameKey); // Open the dropdown
        }
    };

    return (
        <div>
            <h1>All Games</h1>
            <ul>
                {homeGames.map((game, index) => (
                    <li key={index}>
                        <div>
                            <span>{game.gameKey}</span>
                            {game.details.length > 1 && (
                                <button onClick={() => handleDropdownToggle(game)}>
                                    {selectedGame === game.gameKey ? 'Hide' : 'Show'} Sources
                                </button>
                            )}
                        </div>
                        {selectedGame === game.gameKey && game.details.length > 1 && (
                            <ul>
                                {game.details.map((sourceDetail, idx) => (
                                    <li key={idx}>
                                        <strong>{sourceDetail.source}</strong>
                                        <div>
                                            Home Odds: {sourceDetail.homeOdds} | Draw Odds: {sourceDetail.drawOdds} | Away Odds: {sourceDetail.awayOdds}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OddsData;
