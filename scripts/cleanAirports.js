const cleanData = async () => {
  const airports = await Airport.find();
  
  for (const airport of airports) {
   
    if (!airport.city || airport.city === 'Unknown') {
      airport.city = airport.name
        .replace('International Airport', '')
        .replace('Airport', '')
        .trim();
      await airport.save();
    }
    
   
    if (!airport.location?.coordinates?.length === 2) {
      console.warn(`Invalid coordinates for ${airport.iata}`);
    }
  }
  
  console.log('✅ Data cleaning completed');
  process.exit(0);
};