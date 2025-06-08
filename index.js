import fs from 'fs';
import crypto from 'crypto';

// Define file paths
const inputFilePath = './roomdata.json';
const outputFilePath = './roomdata-ids.json';

// Read the input file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    console.log(`Reading file: ${inputFilePath}`);
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        // Parse the JSON data
        const jsonData = JSON.parse(data);

        // Check if "rooms" array exists
        if (!Array.isArray(jsonData.rooms)) {
            console.error('Invalid file format: "rooms" array not found.');
            return;
        }

        // Iterate through the "rooms" array and assign a UUID to each item
        jsonData.rooms.forEach((room) => {
            room.id = crypto.randomUUID();
        });

        // Write the updated data to the output file
        fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return;
            }
            console.log(`File successfully written to ${outputFilePath}`);
        });
    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});