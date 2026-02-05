# CSV to Parquet Converter

A fast and reliable CLI tool built with Rust and Apache Arrow to convert CSV files to Apache Parquet format.

## Features

- 🚀 High-performance conversion using Apache Arrow
- 📊 Automatic schema detection from CSV headers
- 🗜️ Optional Snappy compression
- ⚡ Built with Rust for maximum performance
- ✅ Comprehensive validation and error handling
- 🧪 Unit tests included

## Installation

### Build from source
```bash
cargo build --release
cp target/release/csv-to-parquet /usr/local/bin/
```

## Usage

### Basic conversion
```bash
csv-to-parquet input.csv output.parquet
```

### With compression
```bash
csv-to-parquet input.csv output.parquet --compress
```

### Skip header lines (if CSV has comments)
```bash
csv-to-parquet input.csv output.parquet --skip-lines 1
```

### Help
```bash
csv-to-parquet --help
```

## Requirements

- Rust 1.70 or higher
- Linux, macOS, or Windows

## Example

```bash
# Create sample CSV
echo "id,name,value" > sample.csv
echo "1,John,100" >> sample.csv
echo "2,Jane,200" >> sample.csv

# Convert to Parquet
csv-to-parquet sample.csv output.parquet

# Verify
cargo install parquet-viewer
parquet-viewer output.parquet
```

## Development

Run tests:
```bash
cargo test
```

Build:
```bash
cargo build --release
```