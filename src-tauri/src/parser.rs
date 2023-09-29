use std::fmt;
use std::io::BufReader;
use std::str::FromStr;
use std::{error::Error, fs::File};

use xml::reader::{EventReader, XmlEvent};

#[derive(Debug, serde::Serialize)]
pub struct Invoice {
    year: i32,
    month: i32,
    company: String,
    amount: f32,
    pdf_path: Option<String>,
}

#[derive(Debug, Clone)]
pub struct InvoiceParseError(String);

impl fmt::Display for InvoiceParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Couldn't get {} from XML", self.0)
    }
}

impl Error for InvoiceParseError {}

pub struct Date {
    year: i32,
    month: i32,
}

impl FromStr for Date {
    type Err = Box<dyn Error>;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let mut parts = s.split("-");
        let year = parts
            .next()
            .ok_or(InvoiceParseError("Year".to_string()))?
            .parse::<i32>()?;
        let month = parts
            .next()
            .ok_or(InvoiceParseError("Month".to_string()))?
            .parse::<i32>()?;

        Ok(Date { year, month })
    }
}

pub fn parse_xml_file(path: &str) -> Result<Invoice, Box<dyn Error>> {
    let file = File::open(path)?;
    let file = BufReader::new(file);

    let parser = EventReader::new(file);

    let mut company = Err(InvoiceParseError("Company".to_string()));
    let mut date = Err(InvoiceParseError("Date".to_string()));
    let mut amount = Err(InvoiceParseError("Amount".to_string()));

    let mut seller_flags = (false, false, false);
    let mut date_flags = (false, false);
    let mut price_flags = (false, false);

    for e in parser {
        match e {
            Ok(XmlEvent::StartElement { name, .. }) => {
                if name.local_name == "S_NAD" {
                    seller_flags.0 = true;
                }

                if seller_flags.1 && name.local_name == "D_3036" {
                    seller_flags.2 = true;
                }

                if name.local_name == "C_C507" {
                    date_flags.0 = true;
                }

                if name.local_name == "G_SG50" {
                    price_flags.0 = true;
                }
            }
            Ok(XmlEvent::Characters(c)) => {
                if seller_flags.0 && c == "SE" {
                    seller_flags.1 = true;
                } else if seller_flags.2 {
                    seller_flags = (false, false, false);

                    company = Ok(c);
                    continue;
                }

                if date_flags.0 && c == "35" {
                    date_flags.1 = true;
                } else if date_flags.1 {
                    date_flags = (false, false);

                    date = Ok(c);
                    continue;
                }

                if price_flags.0 && c == "9" {
                    price_flags.1 = true;
                } else if price_flags.1 {
                    price_flags = (false, false);

                    amount = Ok(c);
                    continue;
                }
            }

            Ok(XmlEvent::EndElement { name, .. }) => {
                if name.local_name == "S_NAD" {
                    seller_flags = (false, false, false);
                }
                if name.local_name == "C_C507" {
                    date_flags = (false, false);
                }

                if name.local_name == "G_SG50" {
                    price_flags = (false, false);
                }
            }
            _ => {}
        }
    }

    let amount = amount?.parse()?;
    let company = company?;
    let date: Date = date?.parse()?;

    let invoice = Invoice {
        year: date.year,
        month: date.month - 1,
        company,
        amount,
        pdf_path: None,
    };

    Ok(invoice)
}
