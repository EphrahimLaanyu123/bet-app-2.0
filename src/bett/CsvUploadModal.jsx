import React, { useState } from 'react';
import './CsvUploadModal.css';

const CsvUploadModal = ({ isModalOpen, toggleModal, handleFileUpload }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);

    // Function to handle file selection and update the state
    const handleFileSelection = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to Array
        setSelectedFiles(prevFiles => [...prevFiles, ...files]); // Add new files to existing ones
    };

    // Function to remove a selected file
    const removeFile = (fileToRemove) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
    };

    // Handle Compare button click
    const handleCompareClick = () => {
        handleFileUpload(selectedFiles); // Pass selected files to OddsData component
    };

    if (!isModalOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Upload CSV Files</h2>
                    {/* Close button */}
                    <button className="close-btn" onClick={toggleModal}>X</button>
                </div>
                <div className="modal-body">
                    {/* File input allowing multiple files */}
                    <input
                        type="file"
                        accept=".csv"
                        multiple
                        onChange={handleFileSelection}
                    />
                    <p>Upload CSV Files (Multiple files allowed)</p>

                    {/* Display the names of selected files with remove buttons */}
                    {selectedFiles.length > 0 && (
                        <div className="file-list">
                            <ul>
                                {selectedFiles.map((file, index) => (
                                    <li key={index}>
                                        {file.name}
                                        {/* Remove button next to each file */}
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeFile(file)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    {/* Compare button */}
                    <button className="compare-btn" onClick={handleCompareClick}>Compare</button>
                    <button className="close-btn" onClick={toggleModal}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default CsvUploadModal;
