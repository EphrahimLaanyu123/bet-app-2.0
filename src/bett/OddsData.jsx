import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import CsvUploadModal from './CsvUploadModal';  // Import the modal component
import './OddsData.css';

const OddsData = () => {
    const [homeGames, setHomeGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [csvFiles, setCsvFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

    // Handle CSV file upload and trigger comparison
    const handleFileUpload = (files) => {
        const newCsvFiles = files.map(file => ({
            file,
            name: file.name
        }));
        setCsvFiles(newCsvFiles);
        setIsModalOpen(false); // Close modal after file upload
    };

    useEffect(() => {
        const fetchAndParseData = async () => {
            let gamesMap = {};

            // Fetch and parse each CSV (dynamically uploaded files)
            for (let { file, name } of csvFiles) {
                const reader = new FileReader();
                reader.onload = async () => {
                    const text = reader.result;
                    const parsedData = Papa.parse(text, { header: true, skipEmptyLines: true });
                    const games = parsedData.data;

                    // Process each game in the CSV
                    games.forEach(game => {
                        if (game.Home && game.Away && game['1'] && game['x'] && game['2']) {
                            const gameKey = `${game.Home} vs ${game.Away}`;
                            if (gamesMap[gameKey]) {
                                gamesMap[gameKey].push({
                                    source: name,
                                    homeOdds: game['1'],
                                    drawOdds: game['x'],
                                    awayOdds: game['2']
                                });
                            } else {
                                gamesMap[gameKey] = [{
                                    source: name,
                                    homeOdds: game['1'],
                                    drawOdds: game['x'],
                                    awayOdds: game['2']
                                }];
                            }
                        }
                    });

                    const allGames = Object.keys(gamesMap).map(gameKey => ({
                        gameKey,
                        details: gamesMap[gameKey]
                    }));

                    setHomeGames(allGames);
                };
                reader.readAsText(file); // Read the CSV file content
            }
        };

        if (csvFiles.length > 0) {
            fetchAndParseData();  // Trigger comparison when files are uploaded
        }
    }, [csvFiles]);

    // Handle dropdown toggle
    const handleDropdownToggle = (game) => {
        if (selectedGame === game.gameKey) {
            setSelectedGame(null); // Close the dropdown if clicked again
        } else {
            setSelectedGame(game.gameKey); // Open the dropdown
        }
    };

    // Toggle modal visibility
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div>
            <h1>All Games</h1>

            {/* Add CSV Button to open the modal */}
            <button className="add-csv-btn" onClick={toggleModal}>
                Add CSV Files
            </button>

            {/* Modal for uploading CSV files */}
            <CsvUploadModal 
                isModalOpen={isModalOpen} 
                toggleModal={toggleModal} 
                handleFileUpload={handleFileUpload} 
            />

            {/* Display all games */}
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
