# Music Player Readme

## Overview

Welcome to the `musicplayer` project! This is a web-based music player built using React, Vite, and various other technologies. The player allows you to play MP3 files and provides a user-friendly interface for managing your music.

## Project Structure

- **name**: musicplayer
- **private**: true
- **version**: 0.0.0
- **type**: module

## Scripts

- **dev**: Start development server using Vite.
- **build**: Build the project for production using Vite.
- **lint**: Run ESLint to lint JavaScript and JSX files.
- **preview**: Preview the production build locally.

## Dependencies

### Runtime Dependencies

- **react**: ^18.2.0
- **react-dom**: ^18.2.0

### Development Dependencies

- **@types/react**: ^18.2.43
- **@types/react-dom**: ^18.2.17
- **@vitejs/plugin-react**: ^4.2.1
- **eslint**: ^8.55.0
- **eslint-plugin-react**: ^7.33.2
- **eslint-plugin-react-hooks**: ^4.6.0
- **eslint-plugin-react-refresh**: ^0.4.5
- **vite**: ^5.0.8

## Icon Font

This project uses Google Font Material Icons to provide a visually appealing set of icons for various actions within the music player.

## Data Storage

- **IndexedDB**: Traditional IndexedDB is utilized for storing and retrieving MP3 files within browser APIs. This allows for efficient local storage of music files.

- **localStorage**: Arrays and variables are stored using localStorage for maintaining user preferences and other necessary data.

## Deployment

The application is deployed and accessible at [https://music-player-two-taupe.vercel.app/](https://music-player-two-taupe.vercel.app/). Feel free to explore and enjoy the music player!

## How to Use

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Run the development server with `npm run dev`.
4. Build the project for production with `npm run build`.
5. Preview the production build locally with `npm run preview`.

Feel free to contribute, report issues, or suggest improvements. Happy listening! 🎶
