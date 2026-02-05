use std::fs::File;
use std::path::Path;
use clap::Parser;
use anyhow::{Context, Result};
use arrow::csv::ReaderBuilder;
use arrow::datatypes::Schema;
use parquet::arrow::ArrowWriter;

#[derive(Parser, Debug)]
#[command(name = "csv-to-parquet", version = "1.0", about = "Convert CSV files to Parquet format")]
struct Args {
    /// Input CSV file path
    input: String,
    
    /// Output Parquet file path
    output: String,
    
    /// Number of lines to skip from the beginning
    #[arg(short, long, default_value = "0")]
    skip_lines: usize,
    
    /// Enable compression (Snappy)
    #[arg(short, long)]
    compress: bool,
}

fn main() -> Result<()> {
    let args = Args::parse();
    
    // Validate input file exists
    if !Path::new(&args.input).exists() {
        anyhow::bail!("Input CSV file does not exist: {}", args.input);
    }
    
    // Create output directory if needed
    let output_path = Path::new(&args.output);
    if let Some(parent) = output_path.parent() {
        std::fs::create_dir_all(parent)
            .context("Failed to create output directory structure")?;
    }
    
    println!("Converting {} to {}...", args.input, args.output);
    
    convert_csv_to_parquet(&args.input, &args.output, args.skip_lines, args.compress)?;
    
    println!("✅ Successfully converted CSV to Parquet!");
    Ok(())
}

fn convert_csv_to_parquet(
    input_path: &str,
    output_path: &str,
    skip_lines: usize,
    compress: bool,
) -> Result<()> {
    let file = File::open(input_path)
        .context(format!("Failed to open input file: {}", input_path))?;
    
    // Build CSV reader
    let reader_builder = ReaderBuilder::new()
        .has_header(true)
        .with_skip_rows(skip_lines);
    
    let mut reader = reader_builder
        .build(file)
        .context("Failed to build CSV reader")?;
    
    // Get schema from first batch
    let batch = reader.next()
        .ok_or_else(|| anyhow::anyhow!("No data in CSV file"))??;
    
    let schema = batch.schema();
    let batches = std::iter::once(Ok(batch))
        .chain(reader.map(|batch| batch.context("Failed to read batch")))
        .collect::<Result<Vec<_>, _>>()?;
    
    // Open output file
    let output_file = File::create(output_path)
        .context(format!("Failed to create output file: {}", output_path))?;
    
    // Configure compression
    let mut writer_properties = parquet::file::properties::WriterProperties::builder();
    if compress {
        writer_properties = writer_properties
            .set_compression(parquet::basic::Compression::SNAPPY);
    }
    let writer_props = writer_properties.build();
    
    // Write to Parquet
    let mut writer = ArrowWriter::try_new(output_file, schema.clone(), Some(writer_props))
        .context("Failed to create Parquet writer")?;
    
    for batch in batches {
        writer.write(&batch).context("Failed to write batch")?;
    }
    
    writer.close().context("Failed to close writer")?;
    
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    use tempfile::NamedTempFile;

    #[test]
    fn test_basic_conversion() -> Result<()> {
        let mut temp_csv = NamedTempFile::new()?;
        let temp_parquet = NamedTempFile::new()?;
        
        writeln!(temp_csv, "col1,col2,col3")?;
        writeln!(temp_csv, "1,hello,3.14")?;
        writeln!(temp_csv, "2,world,2.71")?;
        
        convert_csv_to_parquet(
            temp_csv.path().to_str().unwrap(),
            temp_parquet.path().to_str().unwrap(),
            0,
            false,
        )?;
        
        assert!(temp_parquet.path().exists());
        Ok(())
    }
    
    #[test]
    fn test_compression_enabled() -> Result<()> {
        let mut temp_csv = NamedTempFile::new()?;
        let temp_parquet = NamedTempFile::new()?;
        
        writeln!(temp_csv, "numbers,texts")?;
        writeln!(temp_csv, "1,test")?;
        writeln!(temp_csv, "2,data")?;
        
        convert_csv_to_parquet(
            temp_csv.path().to_str().unwrap(),
            temp_parquet.path().to_str().unwrap(),
            0,
            true,
        )?;
        
        assert!(temp_parquet.path().exists());
        Ok(())
    }
}