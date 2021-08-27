
<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://cardapp77.herokuapp.com/">
    <img src="client/images/White on Transparent.png" alt="Logo" width="300" height="80">
  </a>

  <p align="center">
    Fun and simple way to create, save and print greeting cards.
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#configuration">Configuration</a></li>
        <li><a href="#running-the-app">Running the app</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

Check out the latest design ideas on [Figma](https://www.figma.com/file/vwMJLncwv4sh645oHM45mB/Cards?node-id=24%3A4770)

### Built With

* [Bootstrap](https://getbootstrap.com/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Install the latest version of [Node.js](https://nodejs.org/en/) (if you do not already have it)

### Installation

1. Open a new terminal
2. Clone the repo
   ```sh
   git clone https://github.com/nme077/card_app.git
   ```
2. Navigate to the project directory in the terminal
    ```sh
    cd card_app
    ```
3. Install NPM packages
   ```sh
   npm install
   ```
   
### Configuration

1. Add .env file with the variables in [.env.example](.env.example)

2. Connect to MongoDB - get started with MongoDB Atlas at https://docs.atlas.mongodb.com/getting-started/
  - Obtain the unique URI to connect to your MongoDB database add it to your .env file.
  ```sh
  URI="mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]"
  ```

3. Setup a Google OAuth 2.0 client - get started at https://developers.google.com/identity/protocols/oauth2
  - Obtain the following credentials and add them to your .env file.
  ```sh
  CLIENT_ID="YOUR_GOOGLE_CLIENT ID"
  CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"
  REDIRECT_URI="http://localhost:3000/cards"
  REFRESH_TOKEN="YOUR_OUATH_2.0_REFRESH_TOKEN"
  CALLBACK_URL="http://localhost:3000/auth/google/callback"
  ```

4. Create a Cloudinary account to upload and access photos. Get started at https://cloudinary.com/
  - Obtain the following information from your Cloudinary account and add them to your .env file.
  ```sh
  CLOUD_NAME="YOUR_CLOUD_NAME"
  API_KEY="YOUR_API_KEY"
  API_SECRET="YOUR_API_SECRET"
  ```

<!-- RUN THE APP -->
## Running the app

1. Run ```npm start```


<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/nme077/card_app/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- CONTACT -->
## Contact

Nicholas Eveland - nicholaseveland93@gmail.com

Project Link: [https://github.com/nme077/card_app](https://github.com/nme077/card_app)
