# Balance Scorecard Frontend Application

This is the frontend application for the Balance Scorecard system at Pride Microfinance Bank. Built using React.js, it provides the user interface for managing and viewing the application, offering an intuitive and responsive design for HR-related operations.

---

Getting Started
---------------  

### Prerequisites  

* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment

Installation
------------

#### Step 1: Clone the Repository

1. Clone the repository via Git. Make sure you fork the repository first to your account and clone the copy of your forked
    ```sh
    git clone git@github.com:Pride-Innovation/BSC-HRMS-Front-End.git
    ```
2. Navigate to the project directory
    ```sh
    cd BSC-HRMS-Front-End
    ```
3. Set Up the Upstream Remote
    ```sh
    git remote add upstream git@github.com:Pride-Innovation/BSC-HRMS-Front-End.git
    ```

#### Step 2: Installing Dependencies
Inside the project directory,install all the necessary dependencies specified in the package.json file. Run the following command
```sh
npm install
```
This command will install all the packages listed under dependencies and devDependencies in the package.json file

Configuration
------------

#### Step 3: Set Up Environment Variables
Create a .env file in the root directory of the project and add the necessary variables
```sh
cp .env.example .env
```

#### Step 4: Run development server
To run the development server, execute the following command within the main directory
```sh
npm run dev
```
This command will start the development server and open the application in your default web browser at http://localhost:5173 or any available port given by vite

#### Step 5 : Running Tests
To ensure the application works as expected, run the following command to execute the test suite: This command will execute all the test cases defined in the project
```sh
npm test
```
Built with
------------
* [React.js](https://react.dev/) - An open-source front-end JavaScript library for building user interfaces  
* [Vite](https://github.com/vitejs/vite-plugin-react-swc/) - As a JS bundler
* [Tailwind CSS](https://tailwindcss.com/docs/guides/create-react-app) - A utility-first CSS framework 

Authors
------------
* **Solomon Obwot** - [Software Developer](https://github.com/SolObwot/)  
* **Sunday Odong** - [Software Developer](https://github.com/OdongAlican)  
* **Joseph Gibusiwa** - [Software Developer](https://github.com/gibsjoseph)  
* **Derrick Katamba** - [Supervisor IT Projects](https://github.com/derricking) 
* **John Aogon** - [Innovation & Business Automation Manager](https://github.com/jaogon2025) 

## License

This project is licensed under the MIT License - see the [license.md](https://license.md/) file for details.

