const cleanData = async () => {
  const airports = await Airport.find();
  
  for (const airport of airports) {
    // Fix empty cities
    if (!airport.city || airport.city === 'Unknown') {
      airport.city = airport.name
        .replace('International Airport', '')
        .replace('Airport', '')
        .trim();
      await airport.save();
    }
    
    // Validate coordinates
    if (!airport.location?.coordinates?.length === 2) {
      console.warn(`Invalid coordinates for ${airport.iata}`);
    }
  }
  
  console.log('✅ Data cleaning completed');
  process.exit(0);
};