# Stock Portfolio Tracker 📈

[![Node.js](https://img.shields.io/badge/Node.js->=18-success)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Tests](https://github.com/yourusername/StockPortfolioTracker/actions/workflows/nodejs.yml/badge.svg)](https://github.com/yourusername/StockPortfolioTracker/actions)

A production‑ready Node.js application that lets you track a stock portfolio, fetch real‑time quotes, and calculate the current value of your holdings. 
It demonstrates clean architecture, proper error handling, logging, configuration management, and unit testing.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Overview](#api-overview)
- [Testing](#testing)
- [License](#license)

## Features

- **Portfolio management** – add, remove, and update positions.
- **Live price fetching** – integrates with Alpha Vantage (or any compatible API) via `axios`.
- **Robust logging** – Winston transports with console and file logging.
- **Environment based configuration** – `dotenv` + `config.js`.
- **Extensive unit tests** – Jest test suite covering core logic.
- **Type hints & JSDoc** – for better IDE support.

## Prerequisites

- **Node.js** v18 or newer
- **npm** (comes with Node) or **yarn**
- An API key for a stock quote provider (Alpha Vantage demo key works out‑of‑the‑box)

## Installation