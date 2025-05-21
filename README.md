📸 PhotoUpload
PhotoUpload is a React Native application that enables users to capture or select photos, assign labels, and upload them to a server with real-time progress feedback. It's designed to provide a seamless and efficient image uploading experience.



🚀 Features
📷 Capture photos using the device camera

🖼️ Select images from the device gallery

🏷️ Assign labels to images before uploading

📤 Upload images to a server with real-time progress indication

🔒 Secure image storage with unique filenames

📊 View upload history with timestamps and labels



🛠️ Installation

Clone the repository:
git clone https://github.com/yourusername/photoupload.git
cd photoupload

Install dependencies:
npm install

Start the development server:
npm start

Run the app:
For Android:
npx react-native run-android
For iOS:
npx react-native run-ios

📸 Usage

Launch the app on your device or emulator.

Capture or select a photo using the provided options.

Assign labels to the image as prompted.

Initiate the upload, and monitor the progress through the displayed indicator.

View upload history to see previously uploaded images along with their labels and timestamps.

🧰 Technologies Used

React Native

Multer for handling file uploads on the server

Express.js for the backend server

SQLite for local data storage

react-native-image-picker for image selection

react-native-progress for displaying upload progress

📂 Project Structure

pgsql
Copy
Edit
photoupload/
├── android/
├── ios/
├── src/
│   ├── components/
│   ├── screens/
│   ├── services/
│   └── utils/
├── server/
│   ├── uploads/
│   └── index.js
├── App.js
├── package.json
└── README.md
