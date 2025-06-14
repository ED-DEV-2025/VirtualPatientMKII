# VirtualPatientMKII

A simple static web application for running virtual patient simulations.

## Files
- **index.html** – interface for Learning Designers to upload a patient case JSON and start the simulation.
- **vsp.html** – chat interface for learners to interact with the virtual patient.
- **script.js** – shared JavaScript for loading case files, storing data and handling chat with the OpenAI API.
- **caseTemplate.json** – example patient case file that can be edited and uploaded.

## Usage
Open `index.html` in a browser. Upload a patient case file in the same format as `caseTemplate.json`, provide your OpenAI API key and click **Start Simulation**. The learner interface will load in `vsp.html`.

The application uses the OpenAI Chat Completions API. Responses depend on your API key and quota.

This project is ready for future integration with OpenAI's Assistants API by adjusting the `sendMessage` function in `script.js`.
